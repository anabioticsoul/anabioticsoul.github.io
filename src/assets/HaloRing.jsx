import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
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

export default function HaloRing({ position = [0, -46, -28], scale = 20, rotation = [0, 0, 0] }) {
  const group = useRef()
  const { scene } = useGLTF('/models/halo_ring.glb')

  const { cloned, baseRadius } = useMemo(() => {
    const s = cloneScene(scene)

    s.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return
      obj.material.side = THREE.DoubleSide

      // 提升一点可见度，避免暗材质在远处几乎不可见
      if (obj.material.color) obj.material.color.multiplyScalar(1.08)
      if ('emissiveIntensity' in obj.material) {
        obj.material.emissiveIntensity = Math.max(0.75, obj.material.emissiveIntensity ?? 1)
      }
    })

    // 把模型中心归一到原点，并记录半径做尺度归一化。
    const box = new THREE.Box3().setFromObject(s)
    const center = new THREE.Vector3()
    const sphere = new THREE.Sphere()
    box.getCenter(center)
    box.getBoundingSphere(sphere)
    s.position.sub(center)

    return {
      cloned: s,
      baseRadius: Math.max(1e-4, sphere.radius),
    }
  }, [scene])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.02
    group.current.rotation.z += delta * 0.006
  })

  return (
    <group ref={group} position={position} scale={scale / baseRadius} rotation={rotation}>
      <primitive object={cloned} />
    </group>
  )
}

useGLTF.preload('/models/halo_ring.glb')