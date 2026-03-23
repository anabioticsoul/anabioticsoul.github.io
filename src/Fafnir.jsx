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

function EnergyMaterial({ color = '#55d8ff', opacity = 0.65, boost = 0 }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={1.2 + boost * 2.2}
      metalness={0.15}
      roughness={0.08}
      transparent
      opacity={Math.min(1, opacity + boost * 0.18)}
    />
  )
}

function ThrusterPlume({ side = 0, boost = 0, pulse = 0 }) {
  const plumeLength = 2.6 + boost * 6.5 + pulse * 0.6
  const plumeWidth = 0.3 + boost * 0.28
  return (
    <group position={[side * 0.9, -0.1, 3.7 + plumeLength * 0.45]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[plumeWidth, plumeWidth, plumeLength]}>
        <coneGeometry args={[1, 1, 10]} />
        <meshStandardMaterial
          color="#9ceaff"
          emissive="#67ddff"
          emissiveIntensity={1.6 + boost * 3.8}
          transparent
          opacity={0.16 + boost * 0.36}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[plumeWidth * 0.58, plumeWidth * 0.58, plumeLength * 0.82]}>
        <coneGeometry args={[1, 1, 10]} />
        <meshStandardMaterial
          color="#fff4b2"
          emissive="#ffe97f"
          emissiveIntensity={2.2 + boost * 4.5}
          transparent
          opacity={0.22 + boost * 0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function WingPanel({ side = 1, index = 0, boost = 0 }) {
  const x = side * (4.8 + index * 1.55)
  const y = 0.3 + index * 0.18
  const z = -0.6 - index * 0.6
  const rotZ = side * (-0.35 - index * 0.05)

  return (
    <group position={[x, y, z]} rotation={[0.05, 0.1 * -side, rotZ]}>
      <mesh>
        <boxGeometry args={[3.6, 0.22, 1.1]} />
        <ArmorMaterial color="#334b92" emissive="#284aa8" emissiveIntensity={0.18 + boost * 0.48} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.1, 0.04, 0.72]} />
        <EnergyMaterial color="#56d6ff" opacity={0.72} boost={boost} />
      </mesh>
      <mesh position={[-1.55 * side, 0, 0]} rotation={[0, 0, side * 0.16]}>
        <boxGeometry args={[0.75, 0.14, 0.2]} />
        <ArmorMaterial color="#cfdcff" emissive="#8ab8ff" emissiveIntensity={boost * 0.18} />
      </mesh>
    </group>
  )
}

function TailSegment({ index = 0, boost = 0 }) {
  const scale = Math.max(0.75, 1.15 - index * 0.06)
  return (
    <group position={[0, -0.35 - index * 0.06, 3.1 + index * 0.95]}>
      <mesh scale={[0.62 * scale, 0.48 * scale, 1.05 * scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <ArmorMaterial color="#d9e4ff" emissive="#6dafff" emissiveIntensity={boost * 0.08} />
      </mesh>
      <mesh position={[0, 0.1, -0.05]} scale={[0.42 * scale, 0.22 * scale, 0.9 * scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <EnergyMaterial color="#47d4ff" opacity={0.55} boost={boost} />
      </mesh>
      <mesh position={[0, -0.05, 0.62]} scale={[0.18 * scale, 0.18 * scale, 0.55 * scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <ArmorMaterial color="#aebfe9" emissive="#9ec7ff" emissiveIntensity={boost * 0.08} />
      </mesh>
    </group>
  )
}

function ClawArm({ side = 1, boost = 0 }) {
  return (
    <group position={[side * 2.35, -1.15, 0.85]} rotation={[0.25, 0, side * 0.35]}>
      <mesh scale={[0.42, 0.42, 1.3]}>
        <cylinderGeometry args={[0.34, 0.28, 2.2, 10]} />
        <ArmorMaterial color="#d9e4ff" emissive="#74b1ff" emissiveIntensity={boost * 0.1} />
      </mesh>

      <mesh position={[0, 0, 1.35]} scale={[0.78, 0.78, 0.78]}>
        <sphereGeometry args={[0.45, 20, 20]} />
        <ArmorMaterial color="#aebfe9" emissive="#8fd9ff" emissiveIntensity={boost * 0.12} />
      </mesh>

      {[-1, 0, 1].map((i) => (
        <mesh
          key={i}
          position={[i * 0.22, 0, 1.82]}
          rotation={[0, i * 0.28, 0]}
          scale={[0.12, 0.12, 0.55]}
        >
          <coneGeometry args={[1, 1.6, 8]} />
          <EnergyMaterial color="#47d4ff" opacity={0.82} boost={boost} />
        </mesh>
      ))}
    </group>
  )
}

function Leg({ side = 1, boost = 0 }) {
  return (
    <group position={[side * 1.15, -1.75, 1.7]} rotation={[0.2, 0, side * 0.1]}>
      <mesh scale={[0.34, 0.34, 1.15]}>
        <cylinderGeometry args={[0.28, 0.24, 1.8, 10]} />
        <ArmorMaterial color="#dbe7ff" emissive="#83bfff" emissiveIntensity={boost * 0.08} />
      </mesh>
      <mesh position={[0, 0, 0.95]} scale={[0.42, 0.18, 0.68]}>
        <boxGeometry args={[1, 1, 1]} />
        <ArmorMaterial color="#b9c8f0" emissive="#95d8ff" emissiveIntensity={boost * 0.08} />
      </mesh>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[i * 0.18, -0.06, 1.35]} rotation={[Math.PI / 2, 0, i * 0.15]}>
          <coneGeometry args={[0.08, 0.52, 8]} />
          <EnergyMaterial color="#66dcff" opacity={0.8} boost={boost} />
        </mesh>
      ))}
    </group>
  )
}

function BackLauncher({ side = 1, index = 0, boost = 0 }) {
  return (
    <group
      position={[side * (3.8 + index * 1.45), 2.2 + index * 0.35, -1.9 - index * 0.3]}
      rotation={[0, 0, side * -0.08]}
    >
      <mesh scale={[1.05, 3.4, 1.15]}>
        <boxGeometry args={[1, 1, 1]} />
        <ArmorMaterial color="#5268b3" emissive="#6d84df" emissiveIntensity={boost * 0.22} />
      </mesh>
      <mesh position={[0, 0.3, 0.08]} scale={[0.62, 2.4, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <EnergyMaterial color="#8b76ff" opacity={0.55} boost={boost} />
      </mesh>
      <mesh position={[0, 2.1, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.25, 0.8, 6]} />
        <EnergyMaterial color="#7af0ff" opacity={0.92} boost={boost} />
      </mesh>
    </group>
  )
}

export default function Faifnir({ scale = 1, visible = true, boostLevel = 0 }) {
  const root = useRef()
  const tail = useRef()
  const tailSegments = useMemo(() => Array.from({ length: 9 }, (_, i) => i), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pulse = 0.5 + Math.sin(t * (2.2 + boostLevel * 8)) * 0.5

    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.35) * (0.08 + boostLevel * 0.04)
      root.current.rotation.x = Math.sin(t * 0.5) * 0.03 - boostLevel * 0.08
      root.current.position.y = Math.sin(t * (0.9 + boostLevel * 0.8)) * (0.18 + boostLevel * 0.12)
    }

    if (tail.current) {
      tail.current.rotation.y = Math.sin(t * (1.2 + boostLevel * 1.8)) * (0.18 + boostLevel * 0.09)
      tail.current.rotation.x = Math.cos(t * (0.8 + boostLevel * 1.5)) * (0.05 + boostLevel * 0.03)
    }

    if (root.current) {
      root.current.children.forEach((child) => {
        if (child.userData?.boostEmitter) {
          child.scale.z = child.userData.baseScaleZ * (1 + boostLevel * 1.8 + pulse * 0.12)
        }
      })
    }
  })

  const pulse = 0.5

  return (
    <group ref={root} scale={scale} visible={visible}>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[1.28, 32, 32]} />
        <ArmorMaterial color="#dce7ff" emissive="#78b7ff" emissiveIntensity={boostLevel * 0.16} />
      </mesh>

      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshStandardMaterial
          color="#fff3a5"
          emissive="#ffe56b"
          emissiveIntensity={1.8 + boostLevel * 2.8}
          metalness={0.08}
          roughness={0.12}
        />
      </mesh>

      <group position={[0, 1.25, -1.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.1, 1.3, 1.75]}>
          <coneGeometry args={[0.72, 1.65, 8]} />
          <ArmorMaterial color="#dce7ff" emissive="#8ab8ff" emissiveIntensity={boostLevel * 0.14} />
        </mesh>

        <mesh position={[0, 0.08, -0.1]} rotation={[Math.PI / 2, 0, 0]} scale={[0.95, 1.15, 1.35]}>
          <coneGeometry args={[0.58, 1.15, 8]} />
          <EnergyMaterial color="#4bd7ff" opacity={0.68} boost={boostLevel} />
        </mesh>

        <mesh position={[0, 0.85, 0.1]} rotation={[0.35, 0, 0]}>
          <coneGeometry args={[0.34, 1.3, 6]} />
          <EnergyMaterial color="#73e4ff" opacity={0.78} boost={boostLevel} />
        </mesh>

        <mesh position={[0.95, 0.55, -0.15]} rotation={[0.08, 0.18, -0.55]}>
          <boxGeometry args={[1.95, 0.16, 0.65]} />
          <ArmorMaterial color="#c8d7fb" emissive="#7eb4ff" emissiveIntensity={boostLevel * 0.1} />
        </mesh>

        <mesh position={[-0.95, 0.55, -0.15]} rotation={[0.08, -0.18, 0.55]}>
          <boxGeometry args={[1.95, 0.16, 0.65]} />
          <ArmorMaterial color="#c8d7fb" emissive="#7eb4ff" emissiveIntensity={boostLevel * 0.1} />
        </mesh>
      </group>

      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[0, 0.3 - i * 0.08, 1.2 + i * 0.8]}>
          <mesh scale={[0.72 - i * 0.08, 0.5 - i * 0.04, 0.9]}>
            <boxGeometry args={[1, 1, 1]} />
            <ArmorMaterial color="#dbe7ff" emissive="#8db7ff" emissiveIntensity={boostLevel * 0.08} />
          </mesh>
          <mesh position={[0, 0.18, 0]} scale={[0.28, 0.22, 0.56]}>
            <boxGeometry args={[1, 1, 1]} />
            <EnergyMaterial color="#4fd9ff" opacity={0.58} boost={boostLevel} />
          </mesh>
        </group>
      ))}

      <group position={[0, 0.7, 0.2]}>
        {[0, 1, 2, 3].map((i) => (
          <WingPanel key={`l-${i}`} side={-1} index={i} boost={boostLevel} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <WingPanel key={`r-${i}`} side={1} index={i} boost={boostLevel} />
        ))}
      </group>

      {[0, 1].map((i) => (
        <BackLauncher key={`bl-${i}`} side={-1} index={i} boost={boostLevel} />
      ))}
      {[0, 1].map((i) => (
        <BackLauncher key={`br-${i}`} side={1} index={i} boost={boostLevel} />
      ))}

      <ClawArm side={-1} boost={boostLevel} />
      <ClawArm side={1} boost={boostLevel} />

      <Leg side={-1} boost={boostLevel} />
      <Leg side={1} boost={boostLevel} />

      <group ref={tail}>
        {tailSegments.map((i) => (
          <TailSegment key={i} index={i} boost={boostLevel} />
        ))}

        <group position={[0, -0.7, 11.9]}>
          <mesh rotation={[0, 0, Math.PI / 2]} scale={[0.18, 0.18, 1.1]}>
            <cylinderGeometry args={[0.2, 0.2, 2.0, 10]} />
            <EnergyMaterial color="#ffe56b" opacity={0.95} boost={boostLevel} />
          </mesh>
          <mesh position={[0.72, 0, 0]} rotation={[0, 0, -0.6]}>
            <coneGeometry args={[0.16, 0.85, 6]} />
            <ArmorMaterial color="#dce7ff" emissive="#a9d4ff" emissiveIntensity={boostLevel * 0.12} />
          </mesh>
          <mesh position={[-0.72, 0, 0]} rotation={[0, 0, 0.6]}>
            <coneGeometry args={[0.16, 0.85, 6]} />
            <ArmorMaterial color="#dce7ff" emissive="#a9d4ff" emissiveIntensity={boostLevel * 0.12} />
          </mesh>
        </group>
      </group>

      <group userData={{ boostEmitter: true, baseScaleZ: 1 }}>
        <ThrusterPlume side={-1} boost={boostLevel} pulse={pulse} />
        <ThrusterPlume side={1} boost={boostLevel} pulse={pulse} />
      </group>
    </group>
  )
}
