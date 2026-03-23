import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Stars, Text, Trail, Html, Line } from '@react-three/drei'
import * as THREE from 'three'

const SECTION_DEFS = [
  {
    id: 'about',
    title: 'ABOUT',
    subtitle: 'Identity / Research / Story',
    pos: [-18, 5, -55],
    eyebrow: 'Identity',
    body:
      'Introduce yourself here with a concise mission statement, your research direction, design philosophy, or the story behind the site.',
    cta: ['Profile', 'Timeline', 'CV'],
    type: 'planet',
    color: '#6ea8ff',
  },
  {
    id: 'projects',
    title: 'PROJECTS',
    subtitle: 'Selected works and prototypes',
    pos: [18, -2, -92],
    eyebrow: 'Selected Works',
    body:
      'Use this sector to present flagship projects, each with a short summary, links, and a small visual card system.',
    cta: ['Featured', 'Archive', 'Source'],
    type: 'ringed',
    color: '#9f8cff',
  },
  {
    id: 'publications',
    title: 'PUBLICATIONS',
    subtitle: 'Papers, datasets, talks',
    pos: [-14, 8, -132],
    eyebrow: 'Research Output',
    body:
      'List papers, datasets, talks, replication packages, and awards. This sector works especially well for an academic homepage.',
    cta: ['Papers', 'Datasets', 'Talks'],
    type: 'binary',
    color: '#85d7ff',
  },
  {
    id: 'contact',
    title: 'CONTACT',
    subtitle: 'Mail / GitHub / Social links',
    pos: [15, 10, -172],
    eyebrow: 'Connect',
    body:
      'Place your email, GitHub, social accounts, CV link, and a short invitation for collaboration here.',
    cta: ['Email', 'GitHub', 'Links'],
    type: 'station',
    color: '#ffd36e',
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
      <fog attach="fog" args={['#02040c', 40, 260]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 10, 6]} intensity={1.1} color="#9cc8ff" />
      <pointLight position={[-24, 10, -20]} intensity={20} distance={120} color="#356bff" />
      <pointLight position={[24, -8, 20]} intensity={12} distance={100} color="#7e53ff" />
      <Stars radius={280} depth={180} count={9000} factor={4.5} saturation={0} fade speed={0.45} />
      <Sparkles count={220} scale={[180, 100, 220]} size={2.2} speed={0.25} color="#a6c8ff" />
    </>
  )
}

function StarLane() {
  const points = useMemo(() => {
    const arr = []
    for (let i = 0; i < 120; i++) {
      arr.push([
        (Math.random() - 0.5) * 110,
        (Math.random() - 0.5) * 42,
        -i * 10 - Math.random() * 12,
      ])
    }
    return arr
  }, [])

  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <icosahedronGeometry args={[i % 9 === 0 ? 1.2 : 0.24, 0]} />
          <meshStandardMaterial
            color={i % 9 === 0 ? '#2d4f8f' : '#9dbfff'}
            emissive={i % 9 === 0 ? '#305dc0' : '#7da9ff'}
            emissiveIntensity={i % 9 === 0 ? 0.85 : 0.3}
            roughness={0.8}
            metalness={0.08}
          />
        </mesh>
      ))}
    </group>
  )
}

function NebulaRings() {
  const rings = useMemo(
    () => [
      { pos: [0, -10, -48], scale: 18, color: '#2445a8' },
      { pos: [20, 14, -100], scale: 24, color: '#4a2a9a' },
      { pos: [-20, 8, -150], scale: 22, color: '#1d6cb0' },
    ],
    []
  )

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.pos} rotation={[-Math.PI / 2.8, 0, 0]}>
          <torusGeometry args={[ring.scale, 0.28, 16, 120]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.33} />
        </mesh>
      ))}
    </group>
  )
}

function PlanetMarker({ active, color }) {
  const ref = useRef()
  useFrame((state, delta) => {
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
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.65 : 0.28} roughness={0.9} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[2.1, 48, 48]} />
        <meshBasicMaterial color="#d8e8ff" transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

function RingedPlanetMarker({ active, color }) {
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
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.72 : 0.32} roughness={0.82} />
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

function BinaryMarker({ active, color }) {
  const a = useRef()
  const b = useRef()
  const group = useRef()

  useFrame((state, delta) => {
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
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.92 : 0.5} />
      </mesh>
      <mesh ref={b}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial color="#d5f2ff" emissive="#d5f2ff" emissiveIntensity={active ? 0.95 : 0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.55, 0.05, 8, 100]} />
        <meshBasicMaterial color="#7ed8ff" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function StationMarker({ active, color }) {
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
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.8 : 0.35} />
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

function CelestialMarker({ item, active }) {
  switch (item.type) {
    case 'planet':
      return <PlanetMarker active={active} color={item.color} />
    case 'ringed':
      return <RingedPlanetMarker active={active} color={item.color} />
    case 'binary':
      return <BinaryMarker active={active} color={item.color} />
    case 'station':
      return <StationMarker active={active} color={item.color} />
    default:
      return <PlanetMarker active={active} color={item.color} />
  }
}

function SectionMarkers({ activeSection, reveal }) {
  const revealScale = Math.max(0.0001, reveal)
  return (
    <group scale={[revealScale, revealScale, revealScale]}>
      {SECTION_DEFS.map((item) => {
        const isActive = activeSection?.id === item.id
        return (
          <group key={item.id} position={item.pos}>
            <CelestialMarker item={item} active={isActive} />
            <Text
              position={[0, 5.2, 0]}
              color={isActive ? '#ffffff' : '#dbe7ff'}
              fontSize={1.15}
              letterSpacing={0.12}
              anchorX="center"
              anchorY="middle"
            >
              {item.title}
            </Text>
            <Text
              position={[0, 3.7, 0]}
              color="#94a8d8"
              fontSize={0.42}
              maxWidth={14}
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
    ref.current.scale.y = lerp(ref.current.scale.y, boost ? 2.7 : 1.45, 6 * delta)
    ref.current.material.opacity = lerp(ref.current.material.opacity, boost ? 0.95 : 0.68, 6 * delta)
  })

  return (
    <mesh ref={ref} position={[0, 0, 1.45]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.18, 1.7, 24, 1, true]} />
      <meshBasicMaterial color="#78a8ff" transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  )
}

function ShipModel({ boost, banking, visible = true }) {
  return (
    <group visible={visible} rotation={[0, 0, banking * 0.9]}>
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

function MapLabels({ sections, mode, activeSection }) {
  if (mode !== 'map') return null

  return (
    <group>
      {sections.map((section) => {
        const active = activeSection?.id === section.id
        return (
          <group key={section.id} position={[section.pos[0], section.pos[1] + 7, section.pos[2]]}>
            <Html center distanceFactor={12} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  color: active ? '#fff' : '#cddcff',
                  fontSize: '12px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  padding: '8px 12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '999px',
                  background: 'rgba(5,10,22,0.68)',
                  backdropFilter: 'blur(10px)',
                  whiteSpace: 'nowrap',
                }}
              >
                {section.title}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function SceneController({
  setHud,
  activeSection,
  setActiveSection,
  phase,
  mode,
  reveal,
}) {
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

  useFrame((state, delta) => {
    if (!ship.current) return

    const t = state.clock.elapsedTime

    if (phase === 'loading') {
      camera.position.lerp(new THREE.Vector3(0, 3, 32), 0.04)
      camera.lookAt(0, 0, -10)
      ship.current.position.lerp(new THREE.Vector3(0, 0, 12), 0.08)
      return
    }

    if (phase === 'intro') {
      const introTargetPos = new THREE.Vector3(0, 12, 36 - reveal * 22)
      camera.position.lerp(introTargetPos, 0.035)
      camera.lookAt(0, 0, -80)
      ship.current.position.lerp(new THREE.Vector3(0, -1.2, 13 - reveal * 4), 0.05)
      ship.current.rotation.z = lerp(ship.current.rotation.z, 0, 0.08)
      ship.current.rotation.x = lerp(ship.current.rotation.x, 0.04, 0.08)
      return
    }

    if (mode === 'map') {
      ship.current.rotation.z = lerp(ship.current.rotation.z, 0, 0.06)
      ship.current.rotation.x = lerp(ship.current.rotation.x, 0.08, 0.06)
      ship.current.rotation.y = lerp(ship.current.rotation.y, -0.08, 0.06)

      const mapPos = new THREE.Vector3(0, 86, -108)
      camera.position.lerp(mapPos, 0.06)
      camera.lookAt(0, 0, -108)

      setHud((prev) => ({
        ...prev,
        sector: activeSection ? activeSection.title : 'MAP',
        sectorHint: activeSection
          ? activeSection.body
          : 'Map mode enabled. Press M to return to flight.',
      }))
      return
    }

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
    ship.current.position.x = clamp(ship.current.position.x, -30, 30)
    ship.current.position.y = clamp(ship.current.position.y, -18, 18)

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

    const currentSection = nearestDistance < 13 ? nearestSection : null

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
        : 'Navigate toward a celestial body to open a portfolio sector.',
    })
  })

  return (
    <group>
      <group ref={ship} position={[0, 0, 12]}>
        <ShipModel boost={boost} banking={banking} visible={phase !== 'loading'} />
      </group>

      <StarLane />
      <NebulaRings />

      <SectionMarkers activeSection={activeSection} reveal={reveal} />

      {mode === 'map' && (
        <>
          {SECTION_DEFS.map((item) => (
            <Line
              key={item.id}
              points={[
                [0, 0, -108],
                item.pos,
              ]}
              color={activeSection?.id === item.id ? '#dce9ff' : '#6f8dcd'}
              lineWidth={1}
              transparent
              opacity={0.4}
            />
          ))}
        </>
      )}

      <MapLabels sections={SECTION_DEFS} mode={mode} activeSection={activeSection} />
    </group>
  )
}

function SectorPanel({ activeSection, mode }) {
  if (mode === 'map' && !activeSection) {
    return (
      <div className="panel panel-main right-mid">
        <div className="tagline">Star Map</div>
        <div className="title-md">Sector Overview</div>
        <p className="body-copy">
          Press <strong>M</strong> again to return to flight mode. You can use this mode to understand the structure of the site before navigating.
        </p>
      </div>
    )
  }

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

function IntroOverlay({ phase, reveal }) {
  if (phase === 'play') return null

  const loading = phase === 'loading'
  const introPercent = Math.round(reveal * 100)

  return (
    <div className="overlay" style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2,4,12,0.98), rgba(2,4,12,0.76))',
          opacity: loading ? 1 : Math.max(0, 0.9 - reveal * 1.1),
          transition: 'opacity 300ms ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          opacity: loading ? 1 : Math.max(0, 1 - reveal * 0.9),
        }}
      >
        <div>
          <div className="tagline">{loading ? 'Initializing' : 'Expanding Star Map'}</div>
          <div className="title-lg">{loading ? 'Deep Space Systems' : `World Build ${introPercent}%`}</div>
          <div className="body-copy" style={{ maxWidth: 560, marginInline: 'auto' }}>
            {loading
              ? 'Loading flight systems, sector signatures, and celestial landmarks.'
              : 'Camera is descending into the navigable universe. Control will be transferred after the map expansion completes.'}
          </div>
        </div>
      </div>
    </div>
  )
}

function HUD({ hud, activeSection, mode, phase }) {
  return (
    <div className="overlay">
      <div className="vignette" />

      <div className="panel panel-compact top-left">
        <div className="tagline">Orbital Flight</div>
        <div className="title-sm">STARLINE-01</div>
      </div>

      <div className="panel panel-compact top-right">
        <div className="tagline">{mode === 'map' ? 'Mode' : 'Velocity'}</div>
        <div className="kv">{mode === 'map' ? 'MAP' : hud.speed}</div>
        <div className="muted">{mode === 'map' ? 'press M to exit' : 'units / sec'}</div>
      </div>

      <div className="panel panel-main left-mid">
        <div className="tagline">Current Sector</div>
        <div className="title-sm">{phase !== 'play' ? 'INTRO' : hud.sector}</div>
        <p className="body-copy">
          {phase !== 'play'
            ? 'Stand by while the world loads and the navigation map unfolds.'
            : hud.sectorHint}
        </p>
      </div>

      <SectorPanel activeSection={activeSection} mode={mode} />

      <div className="panel panel-main bottom-center">
        <div className="controls-wrap">
          <div>
            <div className="tagline">Controls</div>
            <div className="controls-text">
              W / ↑ thrust · S / ↓ brake · A,D turn · Space / Ctrl pitch · Shift boost · M map
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
          Each module is represented by a different celestial body, and map mode can be toggled with M.
        </p>
      </div>

      {phase === 'play' && <div className="crosshair" />}
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState(null)
  const [hud, setHud] = useState({
    speed: '8.0',
    boost: false,
    position: '0.0 / 0.0 / 12.0',
    sector: 'TRANSIT',
    sectorHint: 'Navigate toward a celestial body to open a portfolio sector.',
  })

  const [phase, setPhase] = useState('loading') // loading | intro | play
  const [mode, setMode] = useState('flight') // flight | map
  const [reveal, setReveal] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('intro'), 1200)
    const t2 = setTimeout(() => setPhase('play'), 5200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      setReveal((prev) => {
        const target = phase === 'intro' || phase === 'play' ? 1 : 0
        const next = lerp(prev, target, phase === 'intro' ? 0.035 : 0.08)
        return Math.abs(next - target) < 0.002 ? target : next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'KeyM' && phase === 'play') {
        setMode((prev) => (prev === 'flight' ? 'map' : 'flight'))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  return (
    <div className="app">
      <div className="canvas-wrap">
        <Canvas camera={{ position: [0, 3, 32], fov: 52 }} gl={{ antialias: true }}>
          <SpaceBackdrop />
          <SceneController
            setHud={setHud}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            phase={phase}
            mode={mode}
            reveal={reveal}
          />
        </Canvas>
      </div>

      <HUD hud={hud} activeSection={activeSection} mode={mode} phase={phase} />
      <IntroOverlay phase={phase} reveal={reveal} />
    </div>
  )
}