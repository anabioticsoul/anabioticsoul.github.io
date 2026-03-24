import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Projects({ active }) {
  const ref = useRef()
  const { scene } = useGLTF('/models/dalaran_fantasyislandchallenge.glb')

  const model = useMemo(() => {
    const cloned = scene.clone(true)

    cloned.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      const boosted = mats.map((mat) => {
        const m = mat.clone()

        if (m.color) {
          m.color.multiplyScalar(1.04)
          m.color.lerp(new THREE.Color('#cfa8ff'), 0.018)
        }
        if (m.emissive) {
          m.emissive.multiplyScalar(1.08)
          m.emissive.lerp(new THREE.Color('#8f78ff'), 0.02)
        }
        if ('emissiveIntensity' in m) {
          m.emissiveIntensity = Math.max(0.16, m.emissiveIntensity ?? 0)
        }
        if ('roughness' in m) {
          m.roughness = Math.max(0.24, Math.min(0.82, m.roughness ?? 0.8))
        }

        return m
      })

      obj.material = Array.isArray(obj.material) ? boosted : boosted[0]
    })

    const box = new THREE.Box3().setFromObject(cloned)
    const sphere = new THREE.Sphere()
    const center = new THREE.Vector3()
    box.getBoundingSphere(sphere)
    box.getCenter(center)

    const wrapper = new THREE.Group()
    cloned.position.sub(center)

    const baseRadius = Math.max(1, sphere.radius)
    const targetRadius = 4.2
    wrapper.scale.setScalar(targetRadius / baseRadius)
    wrapper.add(cloned)

    return wrapper
  }, [scene])

  useFrame((_, delta) => {
    if (!ref.current) return

    ref.current.rotation.y += delta * 0.14
    ref.current.scale.lerp(
      new THREE.Vector3(active ? 1.18 : 1, active ? 1.18 : 1, active ? 1.18 : 1),
      0.08
    )
  })

  return (
    <group ref={ref} rotation={[0, Math.PI, 0]}>
      <pointLight
        position={[0, 2.2, 3.8]}
        intensity={active ? 1.15 : 0.78}
        distance={18}
        decay={2}
        color="#b79cff"
      />
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload('/models/dalaran_fantasyislandchallenge.glb')
