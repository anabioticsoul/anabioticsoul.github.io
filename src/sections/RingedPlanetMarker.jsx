import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function RingedPlanetMarker({ active, color }) {
  const ref = useRef()

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.28
    ref.current.scale.lerp(
      new THREE.Vector3(active ? 1.3 : 1, active ? 1.3 : 1, active ? 1.3 : 1),
      0.08
    )
  })

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[2.25, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.72 : 0.32}
          roughness={0.82}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.65, 0.15, 0.1]}>
        <torusGeometry args={[3.45, 0.28, 16, 100]} />
        <meshBasicMaterial color="#dbcfff" transparent opacity={active ? 0.82 : 0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2.65, 0.15, 0.1]} scale={[1.1, 1.1, 1.1]}>
        <torusGeometry args={[3.45, 0.08, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
      </mesh>
    </group>
  )
}
