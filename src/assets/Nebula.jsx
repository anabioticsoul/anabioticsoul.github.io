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

export default function Nebula({ position = [0, -50, 10], scale = 22, rotation = [0, 0, 0] }) {
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

useGLTF.preload('/models/need_some_space.glb')
