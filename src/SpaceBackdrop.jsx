import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function SpaceBackdrop({
  position = [0, 8, -150],
  scale = 22,
  rotation = [0, 0, 0],
}) {
  const group = useRef()
  const { scene } = useGLTF('/models/need_some_space.glb')

  const cloned = useMemo(() => {
    const s = scene.clone(true)

    s.traverse((obj) => {
      if (!obj.isMesh) return
      obj.frustumCulled = false

      if (obj.material) {
        obj.material = obj.material.clone()

        if ('transparent' in obj.material) obj.material.transparent = true
        if ('depthWrite' in obj.material) obj.material.depthWrite = false
        if ('toneMapped' in obj.material) obj.material.toneMapped = false

        if ('emissive' in obj.material) {
          obj.material.emissive = new THREE.Color('#88ccff')
        }
        if ('emissiveIntensity' in obj.material) {
          obj.material.emissiveIntensity = 0.25
        }
      }
    })

    return s
  }, [scene])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.03
    group.current.rotation.z += delta * 0.01
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} />
    </group>
  )
}

useGLTF.preload('/models/need_some_space.glb')
