import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function PlanetMarker({ active, color }) {
  const ref = useRef()

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.32
    ref.current.rotation.x += delta * 0.08
    ref.current.scale.lerp(
      new THREE.Vector3(active ? 1.28 : 1, active ? 1.28 : 1, active ? 1.28 : 1),
      0.08
    )
  })

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[2.1, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.65 : 0.28}
          roughness={0.9}
        />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[2.1, 48, 48]} />
        <meshBasicMaterial color="#d8e8ff" transparent opacity={0.08} />
      </mesh>
    </group>
  )
}
