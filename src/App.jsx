import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Stars, Text, Trail } from '@react-three/drei'
import * as THREE from 'three'

const SECTION_DEFS = [
  {
    id: 'about',
    title: 'ABOUT',
    subtitle: 'Identity / Research / Story',
    pos: [-10, 4, -46],
    eyebrow: 'Identity',
    body:
      'Introduce yourself here with a concise mission statement, your research direction, design philosophy, or the story behind the site.',
    cta: ['Profile', 'Timeline', 'CV'],
  },
  {
    id: 'projects',
    title: 'PROJECTS',
    subtitle: 'Selected works and prototypes',
    pos: [14, -1, -80],
    eyebrow: 'Selected Works',
    body:
      'Use this sector to present flagship projects, each with a short summary, links, and a small visual card system.',
    cta: ['Featured', 'Archive', 'Source'],
  },
  {
    id: 'publications',
    title: 'PUBLICATIONS',
    subtitle: 'Papers, datasets, talks',
    pos: [-16, 6, -118],
    eyebrow: 'Research Output',
    body:
      'List papers, datasets, talks, replication packages, and awards. This sector works especially well for an academic homepage.',
    cta: ['Papers', 'Datasets', 'Talks'],
  },
  {
    id: 'contact',
    title: 'CONTACT',
    subtitle: 'Mail / GitHub / Social links',
    pos: [12, 7, -152],
    eyebrow: 'Connect',
    body:
      'Place your email, GitHub, social accounts, CV link, and a short invitation for collaboration here.',
    cta: ['Email', 'GitHub', 'Links'],
  },
]

function useKeys() {
  const [keys, setKeys] = useState({})

  useEffect(() => {
    const down = (e) => setKeys((prev) => ({ ...prev, [e.code]: true }))
    const up = (e) => setKeys((prev) => ({ ...prev, [e.code]: false }))

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return keys
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function SpaceBackdrop() {
  return (
    <>
      <color attach="background" args={['#02040c']} />
      <fog attach="fog" args={['#02040c', 35, 180]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 10, 6]} intensity={1.2} color="#9cc8ff" />
      <pointLight position={[-20, 8, -20]} intensity={16} distance={80} color="#497dff" />
      <pointLight position={[24, -6, 8]} intensity={10} distance={70} color="#9e6bff" />
      <Stars radius={220} depth={120} count={6500} factor={4.2} saturation={0} fade speed={0.5} />
      <Sparkles count={160} scale={[140, 80, 140]} size={2.4} speed={0.2} color="#9dbfff" />
    </>
  )
}

function StarLane() {
  const points = useMemo(() => {
    const arr = []
    for (let i = 0; i < 90; i++) {
      arr.push([
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 30,
        -i * 10 - Math.random() * 10,
      ])
    }
    return arr
  }, [])

  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <icosahedronGeometry args={[i % 7 === 0 ? 1.1 : 0.28, 0]} />
          <meshStandardMaterial
            color={i % 7 === 0 ? '#2d4f8f' : '#9dbfff'}
            emissive={i % 7 === 0 ? '#305dc0' : '#7da9ff'}
            emissiveIntensity={i % 7 === 0 ? 0.7 : 0.35}
            roughness={0.75}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function NebulaRings() {
  const rings = useMemo(
    () => [
      { pos: [0, -8, -40], scale: 18, color: '#2445a8' },
      { pos: [16, 12, -90], scale: 24, color: '#4a2a9a' },
      { pos: [-18, 6, -130], scale: 22, color: '#1d6cb0' },
    ],
    []
  )

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.pos} rotation={[-Math.PI / 2.8, 0, 0]}>
          <torusGeometry args={[ring.scale, 0.3, 16, 120]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function SectionMarkers({ activeSection }) {
  return (
    <group>
      {SECTION_DEFS.map((item) => {
        const isActive = activeSection?.id === item.id
        return (
          <group key={item.id} position={item.pos}>
            <mesh>
              <octahedronGeometry args={[isActive ? 2.5 : 1.8, 0]} />
              <meshStandardMaterial
                color={isActive ? '#dbe7ff' : '#8fb2ff'}
                emissive={isActive ? '#7aa8ff' : '#618eff'}
                emissiveIntensity={isActive ? 1 : 0.6}
              />
            </mesh>
            <Text
              position={[0, 3.5, 0]}
              color={isActive ? '#ffffff' : '#dbe7ff'}
              fontSize={1.2}
              letterSpacing={0.12}
              anchorX="center"
              anchorY="middle"
            >
              {item.title}
            </Text>
            <Text
              position={[0, 2, 0]}
              color="#94a8d8"
              fontSize={0.45}
              maxWidth={12}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
            >
              {item.subtitle}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

function EngineGlow({ boost }) {
  const ref = useRef()

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.scale.y = lerp(ref.current.scale.y, boost ? 2.6 : 1.4, 6 * delta)
    ref.current.material.opacity = lerp(ref.current.material.opacity, boost ? 0.95 : 0.68, 6 * delta)
  })

  return (
    <mesh ref={ref} position={[0, 0, 1.45]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.18, 1.6, 24, 1, true]} />
      <meshBasicMaterial color="#78a8ff" transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  )
}

function ShipModel({ boost, banking }) {
  return (
    <group rotation={[0, 0, banking * 0.9]}>
      <Trail width={0.85} length={7} color="#7cb1ff" attenuation={(t) => t * t}>
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.34, 2.4, 24]} />
            <meshStandardMaterial color="#dbe7ff" metalness={0.65} roughness={0.2} />
          </mesh>

          <mesh position={[0, 0.14, 0.18]}>
            <sphereGeometry args={[0.34, 24, 24]} />
            <meshStandardMaterial
              color="#0f1730"
              emissive="#315eb8"
              emissiveIntensity={0.45}
              metalness={0.6}
              roughness={0.18}
            />
          </mesh>

          <mesh position={[0.8, -0.08, 0.15]} rotation={[0.2, 0.12, -0.28]}>
            <boxGeometry args={[1.35, 0.08, 0.54]} />
            <meshStandardMaterial color="#a7bbef" metalness={0.4} roughness={0.42} />
          </mesh>

          <mesh position={[-0.8, -0.08, 0.15]} rotation={[0.2, -0.12, 0.28]}>
            <boxGeometry args={[1.35, 0.08, 0.54]} />
            <meshStandardMaterial color="#a7bbef" metalness={0.4} roughness={0.42} />
          </mesh>

          <mesh position={[0, -0.28, 0.7]}>
            <boxGeometry args={[0.28, 0.28, 1.4]} />
            <meshStandardMaterial color="#ced9f9" metalness={0.45} roughness={0.3} />
          </mesh>

          <EngineGlow boost={boost} />
        </group>
      </Trail>
    </group>
  )
}

function FlightScene({ setHud, activeSection, setActiveSection }) {
  const ship = useRef()
  const keys = useKeys()
  const { camera } = useThree()

  const velocity = useRef(new THREE.Vector3(0, 0, -8))
  const tempForward = useMemo(() => new THREE.Vector3(), [])
  const tempUp = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const tempCamPos = useMemo(() => new THREE.Vector3(), [])
  const tempCamLook = useMemo(() => new THREE.Vector3(), [])
  const [boost, setBoost] = useState(false)
  const [banking, setBanking] = useState(0)

  const sections = useMemo(
    () =>
      SECTION_DEFS.map((section) => ({
        ...section,
        position: new THREE.Vector3(...section.pos),
      })),
    []
  )

  useEffect(() => {
    camera.fov = 52
    camera.updateProjectionMatrix()
  }, [camera])

  useFrame((_, delta) => {
    if (!ship.current) return

    const accelerating = keys.KeyW || keys.ArrowUp
    const braking = keys.KeyS || keys.ArrowDown
    const left = keys.KeyA || keys.ArrowLeft
    const right = keys.KeyD || keys.ArrowRight
    const up = keys.Space
    const down = keys.ControlLeft || keys.ControlRight
    const boostNow = keys.ShiftLeft || keys.ShiftRight

    setBoost(Boolean(boostNow))

    const yawSpeed = 1.65
    const pitchSpeed = 1.05
    const rollTarget = left ? 0.65 : right ? -0.65 : 0

    if (left) ship.current.rotation.y += yawSpeed * delta
    if (right) ship.current.rotation.y -= yawSpeed * delta
    if (up) ship.current.rotation.x = clamp(ship.current.rotation.x + pitchSpeed * delta, -0.8, 0.8)
    if (down) ship.current.rotation.x = clamp(ship.current.rotation.x - pitchSpeed * delta, -0.8, 0.8)

    ship.current.rotation.z = lerp(ship.current.rotation.z, rollTarget, 3.5 * delta)
    setBanking((prev) => lerp(prev, rollTarget, 4 * delta))

    tempForward.set(0, 0, -1).applyQuaternion(ship.current.quaternion).normalize()

    const thrust = boostNow ? 22 : 12
    if (accelerating) velocity.current.addScaledVector(tempForward, thrust * delta)
    if (braking) velocity.current.addScaledVector(tempForward, -10 * delta)

    velocity.current.multiplyScalar(Math.pow(0.986, delta * 60))
    velocity.current.clampLength(4, boostNow ? 34 : 22)

    ship.current.position.addScaledVector(velocity.current, delta)
    ship.current.position.x = clamp(ship.current.position.x, -26, 26)
    ship.current.position.y = clamp(ship.current.position.y, -16, 16)

    tempCamPos
      .copy(ship.current.position)
      .add(tempForward.clone().multiplyScalar(-7.2))
      .add(tempUp.clone().multiplyScalar(2.2))

    camera.position.lerp(tempCamPos, 1 - Math.pow(0.0025, delta))

    tempCamLook.copy(ship.current.position).add(tempForward.clone().multiplyScalar(14))
    camera.lookAt(tempCamLook)

    let nearestSection = null
    let nearestDistance = Infinity

    for (const section of sections) {
      const distance = ship.current.position.distanceTo(section.position)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestSection = section
      }
    }

    const currentSection = nearestDistance < 12 ? nearestSection : null

    if (currentSection?.id !== activeSection?.id || (!currentSection && activeSection)) {
      setActiveSection(currentSection)
    }

    setHud({
      speed: velocity.current.length().toFixed(1),
      boost: Boolean(boostNow),
      position: `${ship.current.position.x.toFixed(1)} / ${ship.current.position.y.toFixed(1)} / ${ship.current.position.z.toFixed(1)}`,
      sector: currentSection ? currentSection.title : 'TRANSIT',
      sectorHint: currentSection
        ? currentSection.body
        : 'Navigate toward a beacon to open a portfolio sector.',
    })
  })

  return (
    <group>
      <group ref={ship} position={[0, 0, 10]}>
        <ShipModel boost={boost} banking={banking} />
      </group>
      <StarLane />
      <NebulaRings />
      <SectionMarkers activeSection={activeSection} />
    </group>
  )
}

function SectorPanel({ activeSection }) {
  if (!activeSection) return null

  return (
    <div className="panel panel-main right-mid">
      <div className="tagline">{activeSection.eyebrow}</div>
      <div className="title-md">{activeSection.title}</div>
      <p className="body-copy">{activeSection.body}</p>
      <div className="pills">
        {activeSection.cta.map((label) => (
          <span key={label} className="pill">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function HUD({ hud, activeSection }) {
  return (
    <div className="overlay">
      <div className="vignette" />

      <div className="panel panel-compact top-left">
        <div className="tagline">Orbital Flight</div>
        <div className="title-sm">STARLINE-01</div>
      </div>

      <div className="panel panel-compact top-right">
        <div className="tagline">Velocity</div>
        <div className="kv">{hud.speed}</div>
        <div className="muted">units / sec</div>
      </div>

      <div className="panel panel-main left-mid">
        <div className="tagline">Current Sector</div>
        <div className="title-sm">{hud.sector}</div>
        <p className="body-copy">{hud.sectorHint}</p>
      </div>

      <SectorPanel activeSection={activeSection} />

      <div className="panel panel-main bottom-center">
        <div className="controls-wrap">
          <div>
            <div className="tagline">Controls</div>
            <div className="controls-text">
              W / ↑ thrust · S / ↓ brake · A,D turn · Space / Ctrl pitch · Shift boost
            </div>
          </div>

          <div className="grid-stats">
            <div className="label">Boost</div>
            <div>{hud.boost ? 'Active' : 'Standby'}</div>
            <div className="label">Position</div>
            <div>{hud.position}</div>
          </div>
        </div>
      </div>

      <div className="panel panel-main bottom-left">
        <div className="tagline">Concept</div>
        <p className="body-copy">
          A Bruno-Simon-inspired 3D portfolio direction, reimagined as a spaceship navigation experience in deep space.
          Fly close to the beacons to reveal content sectors, then replace the placeholder text with your real portfolio content.
        </p>
      </div>

      <div className="crosshair" />
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState(null)
  const [hud, setHud] = useState({
    speed: '8.0',
    boost: false,
    position: '0.0 / 0.0 / 10.0',
    sector: 'TRANSIT',
    sectorHint: 'Navigate toward a beacon to open a portfolio sector.',
  })

  return (
    <div className="app">
      <div className="canvas-wrap">
        <Canvas camera={{ position: [0, 2, 18], fov: 52 }} gl={{ antialias: true }}>
          <SpaceBackdrop />
          <FlightScene setHud={setHud} activeSection={activeSection} setActiveSection={setActiveSection} />
        </Canvas>
      </div>

      <HUD hud={hud} activeSection={activeSection} />
    </div>
  )
}