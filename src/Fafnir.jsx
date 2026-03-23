import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function ArmorMaterial({ color = '#dfe8ff', emissive = '#000000', emissiveIntensity = 0 }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.62}
      roughness={0.28}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  )
}

function EnergyMaterial({ color = '#55d8ff', opacity = 0.65 }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={1.2}
      metalness={0.15}
      roughness={0.08}
      transparent
      opacity={opacity}
    />
  )
}

function WingPanel({ side = 1, index = 0 }) {
  const x = side * (4.8 + index * 1.55)
  const y = 0.3 + index * 0.18
  const z = -0.6 - index * 0.6
  const rotZ = side * (-0.35 - index * 0.05)

  return (
    <group position={[x, y, z]} rotation={[0.05, 0.1 * -side, rotZ]}>
      <mesh>
        <boxGeometry args={[3.6, 0.22, 1.1]} />
        <ArmorMaterial color="#334b92" emissive="#284aa8" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.1, 0.04, 0.72]} />
        <EnergyMaterial color="#56d6ff" opacity={0.72} />
      </mesh>
      <mesh position={[-1.55 * side, 0, 0]} rotation={[0, 0, side * 0.16]}>
        <boxGeometry args={[0.75, 0.14, 0.2]} />
        <ArmorMaterial color="#cfdcff" />
      </mesh>
    </group>
  )
}

function TailSegment({ index = 0 }) {
  const scale = Math.max(0.75, 1.15 - index * 0.06)
  return (
    <group position={[0, -0.35 - index * 0.06, 3.1 + index * 0.95]}>
      <mesh scale={[0.62 * scale, 0.48 * scale, 1.05 * scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <ArmorMaterial color="#d9e4ff" />
      </mesh>
      <mesh position={[0, 0.1, -0.05]} scale={[0.42 * scale, 0.22 * scale, 0.9 * scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <EnergyMaterial color="#47d4ff" opacity={0.55} />
      </mesh>
      <mesh position={[0, -0.05, 0.62]} scale={[0.18 * scale, 0.18 * scale, 0.55 * scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <ArmorMaterial color="#aebfe9" />
      </mesh>
    </group>
  )
}

function ClawArm({ side = 1 }) {
  return (
    <group position={[side * 2.35, -1.15, 0.85]} rotation={[0.25, 0, side * 0.35]}>
      <mesh scale={[0.42, 0.42, 1.3]}>
        <cylinderGeometry args={[0.34, 0.28, 2.2, 10]} />
        <ArmorMaterial color="#d9e4ff" />
      </mesh>

      <mesh position={[0, 0, 1.35]} scale={[0.78, 0.78, 0.78]}>
        <sphereGeometry args={[0.45, 20, 20]} />
        <ArmorMaterial color="#aebfe9" />
      </mesh>

      {[-1, 0, 1].map((i) => (
        <mesh
          key={i}
          position={[i * 0.22, 0, 1.82]}
          rotation={[0, i * 0.28, 0]}
          scale={[0.12, 0.12, 0.55]}
        >
          <coneGeometry args={[1, 1.6, 8]} />
          <EnergyMaterial color="#47d4ff" opacity={0.82} />
        </mesh>
      ))}
    </group>
  )
}

function Leg({ side = 1 }) {
  return (
    <group position={[side * 1.15, -1.75, 1.7]} rotation={[0.2, 0, side * 0.1]}>
      <mesh scale={[0.34, 0.34, 1.15]}>
        <cylinderGeometry args={[0.28, 0.24, 1.8, 10]} />
        <ArmorMaterial color="#dbe7ff" />
      </mesh>
      <mesh position={[0, 0, 0.95]} scale={[0.42, 0.18, 0.68]}>
        <boxGeometry args={[1, 1, 1]} />
        <ArmorMaterial color="#b9c8f0" />
      </mesh>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[i * 0.18, -0.06, 1.35]} rotation={[Math.PI / 2, 0, i * 0.15]}>
          <coneGeometry args={[0.08, 0.52, 8]} />
          <EnergyMaterial color="#66dcff" opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function BackLauncher({ side = 1, index = 0 }) {
  return (
    <group
      position={[side * (3.8 + index * 1.45), 2.2 + index * 0.35, -1.9 - index * 0.3]}
      rotation={[0, 0, side * -0.08]}
    >
      <mesh scale={[1.05, 3.4, 1.15]}>
        <boxGeometry args={[1, 1, 1]} />
        <ArmorMaterial color="#5268b3" />
      </mesh>
      <mesh position={[0, 0.3, 0.08]} scale={[0.62, 2.4, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <EnergyMaterial color="#8b76ff" opacity={0.55} />
      </mesh>
      <mesh position={[0, 2.1, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.25, 0.8, 6]} />
        <EnergyMaterial color="#7af0ff" opacity={0.92} />
      </mesh>
    </group>
  )
}

export default function Faifnir({ scale = 1, visible = true }) {
  const root = useRef()
  const tail = useRef()
  const tailSegments = useMemo(() => Array.from({ length: 9 }, (_, i) => i), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.35) * 0.08
      root.current.rotation.x = Math.sin(t * 0.5) * 0.03
      root.current.position.y = Math.sin(t * 0.9) * 0.18
    }

    if (tail.current) {
      tail.current.rotation.y = Math.sin(t * 1.2) * 0.18
      tail.current.rotation.x = Math.cos(t * 0.8) * 0.05
    }
  })

  return (
    <group ref={root} scale={scale} visible={visible}>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[1.28, 32, 32]} />
        <ArmorMaterial color="#dce7ff" />
      </mesh>

      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshStandardMaterial
          color="#fff3a5"
          emissive="#ffe56b"
          emissiveIntensity={1.8}
          metalness={0.08}
          roughness={0.12}
        />
      </mesh>

      <group position={[0, 1.25, -1.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.1, 1.3, 1.75]}>
          <coneGeometry args={[0.72, 1.65, 8]} />
          <ArmorMaterial color="#dce7ff" />
        </mesh>

        <mesh position={[0, 0.08, -0.1]} rotation={[Math.PI / 2, 0, 0]} scale={[0.95, 1.15, 1.35]}>
          <coneGeometry args={[0.58, 1.15, 8]} />
          <EnergyMaterial color="#4bd7ff" opacity={0.68} />
        </mesh>

        <mesh position={[0, 0.85, 0.1]} rotation={[0.35, 0, 0]}>
          <coneGeometry args={[0.34, 1.3, 6]} />
          <EnergyMaterial color="#73e4ff" opacity={0.78} />
        </mesh>

        <mesh position={[0.95, 0.55, -0.15]} rotation={[0.08, 0.18, -0.55]}>
          <boxGeometry args={[1.95, 0.16, 0.65]} />
          <ArmorMaterial color="#c8d7fb" />
        </mesh>

        <mesh position={[-0.95, 0.55, -0.15]} rotation={[0.08, -0.18, 0.55]}>
          <boxGeometry args={[1.95, 0.16, 0.65]} />
          <ArmorMaterial color="#c8d7fb" />
        </mesh>
      </group>

      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[0, 0.3 - i * 0.08, 1.2 + i * 0.8]}>
          <mesh scale={[0.72 - i * 0.08, 0.5 - i * 0.04, 0.9]}>
            <boxGeometry args={[1, 1, 1]} />
            <ArmorMaterial color="#dbe7ff" />
          </mesh>
          <mesh position={[0, 0.18, 0]} scale={[0.28, 0.22, 0.56]}>
            <boxGeometry args={[1, 1, 1]} />
            <EnergyMaterial color="#4fd9ff" opacity={0.58} />
          </mesh>
        </group>
      ))}

      <group position={[0, 0.7, 0.2]}>
        {[0, 1, 2, 3].map((i) => (
          <WingPanel key={`l-${i}`} side={-1} index={i} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <WingPanel key={`r-${i}`} side={1} index={i} />
        ))}
      </group>

      {[0, 1].map((i) => (
        <BackLauncher key={`bl-${i}`} side={-1} index={i} />
      ))}
      {[0, 1].map((i) => (
        <BackLauncher key={`br-${i}`} side={1} index={i} />
      ))}

      <ClawArm side={-1} />
      <ClawArm side={1} />

      <Leg side={-1} />
      <Leg side={1} />

      <group ref={tail}>
        {tailSegments.map((i) => (
          <TailSegment key={i} index={i} />
        ))}

        <group position={[0, -0.7, 11.9]}>
          <mesh rotation={[0, 0, Math.PI / 2]} scale={[0.18, 0.18, 1.1]}>
            <cylinderGeometry args={[0.2, 0.2, 2.0, 10]} />
            <EnergyMaterial color="#ffe56b" opacity={0.95} />
          </mesh>
          <mesh position={[0.72, 0, 0]} rotation={[0, 0, -0.6]}>
            <coneGeometry args={[0.16, 0.85, 6]} />
            <ArmorMaterial color="#dce7ff" />
          </mesh>
          <mesh position={[-0.72, 0, 0]} rotation={[0, 0, 0.6]}>
            <coneGeometry args={[0.16, 0.85, 6]} />
            <ArmorMaterial color="#dce7ff" />
          </mesh>
        </group>
      </group>
    </group>
  )
}