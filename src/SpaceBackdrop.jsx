import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import Nebula from './Nebula'
import HaloRing from './HaloRing'

const HALO_RING_POSITION = [50, -6, -78]
const HALO_RING_SCALE = 150
const HALO_RING_ROTATION = [-Math.PI / 2.7, 0, 0]

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
      if (mat.emissive) mat.emissive.multiplyScalar(0.5)
      if ('emissiveIntensity' in mat) {
        // 背景亮度上限
        mat.emissiveIntensity = Math.min(0.9, mat.emissiveIntensity ?? 1)
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

function DeepSpaceObject() {
  return (
    <>
      <Nebula />
      <HaloRing position={HALO_RING_POSITION} scale={HALO_RING_SCALE} rotation={HALO_RING_ROTATION} />
    </>
  )
}

export default function SpaceBackdrop(props) {
  return (
    <>
      <NebulaSkybox />
      <DeepSpaceObject />
    </>
  )
}

useGLTF.preload('/models/nebula_skybox_16k.glb')