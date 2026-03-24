import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Publications({ active, color }) {
  const a = useRef()
  const b = useRef()
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (a.current) {
      a.current.position.x = Math.cos(t * 1.1) * 1.8
      a.current.position.y = Math.sin(t * 1.1) * 0.65
    }
    if (b.current) {
      b.current.position.x = -Math.cos(t * 1.1) * 1.8
      b.current.position.y = -Math.sin(t * 1.1) * 0.65
    }
    if (group.current) {
      group.current.scale.lerp(
        new THREE.Vector3(active ? 1.25 : 1, active ? 1.25 : 1, active ? 1.25 : 1),
        0.08
      )
    }
  })

  return (
    <group ref={group}>
      <mesh ref={a}>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.92 : 0.5}
        />
      </mesh>
      <mesh ref={b}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial
          color="#d5f2ff"
          emissive="#d5f2ff"
          emissiveIntensity={active ? 0.95 : 0.45}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.55, 0.05, 8, 100]} />
        <meshBasicMaterial color="#7ed8ff" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
