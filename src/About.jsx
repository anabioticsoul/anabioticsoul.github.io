import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function About({ active }) {
  const ref = useRef()
  const { scene } = useGLTF('/models/planet_of_phoenix_1K.glb')

  const model = useMemo(() => {
    const cloned = scene.clone(true)

    cloned.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      const boosted = mats.map((mat) => {
        const m = mat.clone()

        // Push the planet toward a warm red glow while preserving texture detail.
        if (m.color) {
          m.color.multiplyScalar(1.08)
          m.color.lerp(new THREE.Color('#ff5f4d'), 0.02)
        }
        if (m.emissive) {
          m.emissive.multiplyScalar(1.15)
          m.emissive.lerp(new THREE.Color('#ff3b2f'), 0.01)
        }
        if ('emissiveIntensity' in m) {
          m.emissiveIntensity = Math.max(0.28, m.emissiveIntensity ?? 0)
        }
        if ('roughness' in m) {
          m.roughness = Math.max(0.28, Math.min(0.8, m.roughness ?? 0.8))
        }

        return m
      })

      obj.material = Array.isArray(obj.material) ? boosted : boosted[0]
    })

    return cloned
  }, [scene])

  useFrame((_, delta) => {
    if (!ref.current) return

    ref.current.rotation.y += delta * 0.18
    ref.current.rotation.x += delta * 0.04
    ref.current.scale.lerp(
      new THREE.Vector3(active ? 1.36 : 1.1, active ? 1.36 : 1.1, active ? 1.36 : 1.1),
      0.08
    )
  })

  return (
    <group ref={ref}>
      <pointLight
        position={[0, 0.9, 2.2]}
        intensity={active ? 1.3 : 0.9}
        distance={14}
        decay={2}
        color="#ff6a5a"
      />
      <primitive object={model} scale={1.72} />
    </group>
  )
}

useGLTF.preload('/models/planet_of_phoenix_1K.glb')
