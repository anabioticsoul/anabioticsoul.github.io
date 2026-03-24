import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function cloneScene(scene) {
  const s = scene.clone(true)

  s.traverse((obj) => {
    if (!obj.isMesh) return
    obj.frustumCulled = false

    if (obj.material) {
      obj.material = obj.material.clone()
      obj.material.toneMapped = false
    }
  })

  return s
}

function NebulaSkybox() {
  const holder = useRef()
  const { camera } = useThree()
  const { scene } = useGLTF('/models/nebula_skybox_16k.glb')

  const { cloned, baseRadius } = useMemo(() => {
    const s = cloneScene(scene)

    s.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return

      obj.renderOrder = -1000

      const mat = obj.material

      // 不强制 BackSide，先用 DoubleSide，避免模型法线方向和导出方式不一致时直接看不见
      mat.side = THREE.DoubleSide

      // 让它始终当背景显示，但不要粗暴强制透明
      mat.depthWrite = false
      mat.depthTest = false
      mat.fog = false

      // 压低天空盒亮度：参与 tone mapping，并降低基础反照率与自发光强度
      mat.toneMapped = true
      if (mat.color) mat.color.multiplyScalar(0.58)
      if (mat.emissive) mat.emissive.multiplyScalar(0.2)
      if ('emissiveIntensity' in mat) {
        mat.emissiveIntensity = Math.min(0.18, mat.emissiveIntensity ?? 1)
      }

      // 不要统一覆盖 transparent / opacity / emissive
      // Sketchfab 导出的材质很多自带贴图和透明设置，强改反而容易消失
    })

    // 使用模型真实尺寸做归一化，避免超大 skybox 被相机 far plane 整体裁掉。
    const box = new THREE.Box3().setFromObject(s)
    const sphere = new THREE.Sphere()
    box.getBoundingSphere(sphere)

    return {
      cloned: s,
      baseRadius: Math.max(1, sphere.radius),
    }
  }, [scene])

  useFrame(() => {
    if (!holder.current) return

    holder.current.position.copy(camera.position)

    // 目标半径控制在相机可见范围内，再按原始模型半径归一化缩放。
    const targetRadius = Math.max(200, camera.far * 0.28)
    holder.current.scale.setScalar(targetRadius / baseRadius)
  })

  return (
    <group ref={holder}>
      <primitive object={cloned} />
    </group>
  )
}

function DeepSpaceObject({ position = [0, 8, -150], scale = 22, rotation = [0, 0, 0] }) {
  const group = useRef()
  const { scene } = useGLTF('/models/need_some_space.glb')

  const cloned = useMemo(() => {
    const s = cloneScene(scene)

    s.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return
      obj.material.side = THREE.DoubleSide
    })

    return s
  }, [scene])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.03
    group.current.rotation.z += delta * 0.01
  })

  return (
    <group ref={group} position={position} scale={scale} rotation={rotation}>
      <primitive object={cloned} />
    </group>
  )
}

export default function SpaceBackdrop(props) {
  return (
    <>
      <NebulaSkybox />
      <DeepSpaceObject {...props} />
    </>
  )
}

useGLTF.preload('/models/nebula_skybox_16k.glb')
useGLTF.preload('/models/need_some_space.glb')