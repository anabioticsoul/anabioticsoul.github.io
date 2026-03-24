import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Contact({ active, color }) {
  const ref = useRef()

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.4
    ref.current.rotation.z += delta * 0.09
    ref.current.scale.lerp(
      new THREE.Vector3(active ? 1.22 : 1, active ? 1.22 : 1, active ? 1.22 : 1),
      0.08
    )
  })

  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[1.35, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.8 : 0.35}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[4.8, 0.12, 0.12]} />
        <meshStandardMaterial color="#d7c38a" emissive="#d7c38a" emissiveIntensity={0.28} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, Math.PI / 4]}>
        <boxGeometry args={[4.8, 0.12, 0.12]} />
        <meshStandardMaterial color="#d7c38a" emissive="#d7c38a" emissiveIntensity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <boxGeometry args={[4.8, 0.12, 0.12]} />
        <meshStandardMaterial color="#d7c38a" emissive="#d7c38a" emissiveIntensity={0.28} />
      </mesh>
    </group>
  )
}
