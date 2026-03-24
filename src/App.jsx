import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Stars, Text, Line } from '@react-three/drei'
import { MdEmail } from 'react-icons/md'
import { FaGithub, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import * as THREE from 'three'
import About from './About'
import Project from './Projects'
import Faifnir from './Fafnir'
import SpaceBackdrop from './SpaceBackdrop'
import currentMarkerUrl from '../public/map-marker.svg'

const SECTION_DEFS = [
  {
    id: 'about',
    title: 'ABOUT',
    subtitle: 'Identity and Research Focus',
    pos: [-18, 5, -55],
    eyebrow: 'Identity',
    body:
      'I work on configuration security and software security, with a focus on understanding how real-world software misconfigurations arise, how they can be diagnosed, and how configuration-related risks can be reduced in practice.',
    cta: [
      { label: 'GitHub', href: 'https://github.com/anabioticsoul' },
    ],
    type: 'planet',
    color: '#6ea8ff',
    collisionRadius: 3.6,
  },
  {
    id: 'projects',
    title: 'PROJECTS',
    subtitle: 'Repos of Research and Prototypes',
    pos: [18, -2, -92],
    eyebrow: 'Repos',
    body:
      '',
    cta: [
      { label: 'misconfiguration_datasets', href: 'https://github.com/anabioticsoul/misconfiguration_datasets' },
      { label: 'BJTU-thesis-template', href: 'https://github.com/anabioticsoul/BJTU-thesis-template' },
      { label: 'CRSExtractor', href: 'https://github.com/anabioticsoul/CRSExtractor' },
    ],
    type: 'ringed',
    color: '#9f8cff',
    collisionRadius: 5.2,
  },
  {
    id: 'publications',
    title: 'PUBLICATIONS',
    subtitle: 'Papers',
    pos: [-14, 8, -132],
    eyebrow: 'Research',
    body:
      '',
    cta: [
      { label: 'Rethinking software misconfigurations in the real world: an empirical study and literature analysis', href: 'https://arxiv.org/abs/2412.11121' },
      { label: 'CRSExtractor: Automated configuration option read sites extraction towards IoT cloud infrastructure', href: 'https://www.cell.com/heliyon/fulltext/S2405-8440(23)02560-4' },
    ],
    type: 'binary',
    color: '#85d7ff',
    collisionRadius: 4,
  },
  {
    id: 'contact',
    title: 'CONTACT',
    subtitle: 'Social links',
    pos: [15, 10, -172],
    eyebrow: 'Connect',
    body:
      'Feel free to reach out for research collaboration, datasets, or discussion on configuration security and software misconfigurations.',
    cta: [
      { label: 'Email', href: 'mailto:anabioticsoul@gmail.com' },
      { label: 'X'},
      { label: 'Instagram'},
    ],
    type: 'station',
    color: '#ffd36e',
    collisionRadius: 3.2,
  },
]

function lerp(a, b, t) {
  return a + (b - a) * t
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

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

function SpaceEnvironment() {
  return (
    <>
      <color attach="background" args={['#02040c']} />
      <fog attach="fog" args={['#02040c', 40, 260]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[8, 10, 6]} intensity={1.1} color="#9cc8ff" />
      <pointLight position={[-24, 10, -20]} intensity={20} distance={120} color="#356bff" />
      <pointLight position={[24, -8, 20]} intensity={12} distance={100} color="#7e53ff" />
      <Stars radius={280} depth={180} count={9000} factor={4.5} saturation={0} fade speed={0.45} />
      <Sparkles count={220} scale={[180, 100, 220]} size={2.2} speed={0.25} color="#a6c8ff" />
    </>
  )
}

function StarLane({ speedFactor = 0, boostLevel = 0 }) {
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
      {points.map((p, i) => {
        const laneScale = 1 + boostLevel * 1.25
        const opacity = 0.18 + boostLevel * 0.42 + speedFactor * 0.08
        return (
          <mesh key={i} position={p} scale={[1, 1, laneScale]}>
            <icosahedronGeometry args={[i % 9 === 0 ? 1.2 : 0.24, 0]} />
            <meshStandardMaterial
              color={i % 9 === 0 ? '#2d4f8f' : '#9dbfff'}
              emissive={i % 9 === 0 ? '#305dc0' : '#7da9ff'}
              emissiveIntensity={i % 9 === 0 ? 0.85 + boostLevel * 0.65 : 0.3 + boostLevel * 0.45}
              roughness={0.8}
              metalness={0.08}
              transparent
              opacity={Math.min(0.95, opacity)}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function NebulaRings({ boostLevel = 0 }) {
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
          <torusGeometry args={[ring.scale, 0.28 + boostLevel * 0.05, 16, 120]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.33 + boostLevel * 0.08} />
        </mesh>
      ))}
    </group>
  )
}

function WarpLines({ active = false, amount = 0 }) {
  const ref = useRef()
  const data = useMemo(() => {
    return Array.from({ length: 34 }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 6,
      z: -6 - Math.random() * 18,
      len: 1.6 + Math.random() * 4.6,
    }))
  }, [])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.visible = active || amount > 0.02
    ref.current.children.forEach((child, index) => {
      child.position.z += delta * (18 + amount * 95)
      if (child.position.z > 3) {
        child.position.z = -24 - Math.random() * 12
      }
      child.material.opacity = 0.06 + amount * (0.28 + (index % 6) * 0.02)
      child.scale.z = data[index].len * (1 + amount * 2.4)
    })
  })

  return (
    <group ref={ref} visible={false}>
      {data.map((item, index) => (
        <mesh key={index} position={[item.x, item.y, item.z]}>
          <boxGeometry args={[0.03, 0.03, item.len]} />
          <meshBasicMaterial color="#b6ddff" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  )
}

function PlanetMarker({ active, color }) {
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

function BinaryMarker({ active, color }) {
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

function CelestialMarker({ item, active }) {
  if (item.id === 'about') {
    return <About active={active} />
  }

  if (item.id === 'projects') {
    return <Project active={active} />
  }

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


function SectionMarkers({ activeSection, reveal, mode }) {
  if (mode === 'map') return null

  const revealScale = Math.max(0.0001, reveal)

  return (
    <group scale={[revealScale, revealScale, revealScale]}>
      {SECTION_DEFS.map((item) => {
        const isActive = activeSection?.id === item.id
        return (
          <group key={item.id} position={item.pos}>
            <CelestialMarker item={item} active={isActive} />
            {/* 文字颜色/大小 */}
            <Text
              position={[0, 5.2, 0]}
              color="#ffffff"
              fontSize={1.45}
              letterSpacing={0.12}
              anchorX="center"
              anchorY="middle"
              renderOrder={30}
              outlineWidth="8%"
              outlineColor="#ffffff"
            >
              {item.title}
              <meshBasicMaterial
                depthTest={false}
                depthWrite={false}
                toneMapped={false}
                fog={false}
                transparent={false}
                opacity={1}
              />
            </Text>
            <Text
              position={[0, 3.7, 0]}
              color="#ffffff"
              fontSize={0.6}
              maxWidth={14}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              renderOrder={30}
              outlineWidth="6%"
              outlineColor="#ffffff"
            >
              {item.subtitle}
              <meshBasicMaterial
                depthTest={false}
                depthWrite={false}
                toneMapped={false}
                fog={false}
                transparent={false}
                opacity={1}
              />
            </Text>
          </group>
        )
      })}
    </group>
  )
}

function MapLabels({ sections, mode, activeSection }) {
  const { camera } = useThree()
  const refs = useRef({})
  const tempLabelPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (mode !== 'map') return
    for (const section of sections) {
      const ref = refs.current[section.id]
      if (!ref) continue
      ref.quaternion.copy(camera.quaternion)
      ref.getWorldPosition(tempLabelPos)
      const dist = camera.position.distanceTo(tempLabelPos)
      const scale = clamp(dist * 0.036, 4.4, 11.8)
      ref.scale.setScalar(scale)
    }
  })

  if (mode !== 'map') return null

  return (
    <group>
      {sections.map((section) => {
        const active = activeSection?.id === section.id

        return (
          <group
            key={section.id}
            ref={(node) => {
              refs.current[section.id] = node
            }}
            position={[section.pos[0], section.pos[1] + 10.4, section.pos[2]]}
          >
            <Text
              fontSize={active ? 1.22 : 1.04}
              maxWidth={22}
              anchorX="center"
              anchorY="middle"
              color={active ? '#ffffff' : '#dce8ff'}
              outlineWidth={0.16}
              outlineColor="#07101f"
              renderOrder={30}
            >
              {section.title}
              <meshBasicMaterial depthTest={false} depthWrite={false} toneMapped={false} fog={false} transparent={false} opacity={1} />
            </Text>
          </group>
        )
      })}
    </group>
  )
}

function CurrentPositionMarker({ shipRef, mode }) {
  const { camera } = useThree()
  const markerRef = useRef()
  const ringRef = useRef()
  const texture = useMemo(() => new THREE.TextureLoader().load(currentMarkerUrl), [])

  useEffect(() => {
    if (!texture) return
    if ('colorSpace' in texture) texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
  }, [texture])

  useFrame((state) => {
    if (!markerRef.current || !ringRef.current || !shipRef.current) return

    const visible = mode === 'map'
    markerRef.current.visible = visible
    ringRef.current.visible = visible
    if (!visible) return

    const shipPos = shipRef.current.position
    const camHeight = Math.max(80, camera.position.y)
    const size = clamp(camHeight * 0.095, 20, 42)

    markerRef.current.position.set(shipPos.x, 22, shipPos.z)
    ringRef.current.position.set(shipPos.x, 1.2, shipPos.z)

    markerRef.current.lookAt(camera.position)

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.6) * 0.05
    markerRef.current.scale.set(size * pulse, size * pulse, 1)

    const ringScale = clamp(size * 0.18, 4.2, 7.2) * (1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.08)
    ringRef.current.scale.set(ringScale, ringScale, ringScale)
    if (ringRef.current.material) {
      ringRef.current.material.opacity = 0.2 + (Math.sin(state.clock.elapsedTime * 3.2) + 1) * 0.06
    }
  })

  return (
    <group>
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        frustumCulled={false}
        renderOrder={58}
      >
        <ringGeometry args={[1.6, 2.3, 48]} />
        <meshBasicMaterial
          color="#f3f7ff"
          transparent
          opacity={0.5}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={markerRef} visible={false} frustumCulled={false} renderOrder={60}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          color="#ffffff"
          transparent
          alphaTest={0.02}
          opacity={1}
          side={THREE.DoubleSide}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function SceneController({
  setHud,
  activeSection,
  setActiveSection,
  phase,
  mode,
  setMode,
  reveal,
  resetTick,
  boostLevel,
  setBoostLevel,
  onShipMoving,
}) {
  const ship = useRef()
  const keys = useKeys()
  const { camera, gl } = useThree()

  const velocity = useRef(new THREE.Vector3(0, 0, -8))
  const tempForward = useMemo(() => new THREE.Vector3(), [])
  const tempUp = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const tempCamPos = useMemo(() => new THREE.Vector3(), [])
  const tempCamLook = useMemo(() => new THREE.Vector3(), [])
  const tempLookA = useMemo(() => new THREE.Vector3(), [])
  const tempLookB = useMemo(() => new THREE.Vector3(), [])
  const tempLookMix = useMemo(() => new THREE.Vector3(), [])
  const freeOffset = useMemo(() => new THREE.Vector3(), [])
  const freeRight = useMemo(() => new THREE.Vector3(), [])
  const collisionDelta = useMemo(() => new THREE.Vector3(), [])
  const collisionNormal = useMemo(() => new THREE.Vector3(), [])

  const sections = useMemo(
    () =>
      SECTION_DEFS.map((section) => ({
        ...section,
        position: new THREE.Vector3(...section.pos),
      })),
    []
  )

  const startShipPos = useMemo(() => new THREE.Vector3(0, -1, 12), [])
  const startCamPos = useMemo(() => new THREE.Vector3(0, 3, 32), [])
  const shipCollisionRadius = 2.4

  const resetState = useRef({
    active: false,
    t: 0,
    duration: 1.25,
    fromShipPos: new THREE.Vector3(),
    fromShipQuat: new THREE.Quaternion(),
    fromCamPos: new THREE.Vector3(),
    fromLookAt: new THREE.Vector3(),
  })

  const cameraControl = useRef({
    mode: 'follow',
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    yaw: 0,
    pitch: 0.08,
    distance: 12.7,
    targetYaw: 0,
    targetPitch: 0.08,
    targetDistance: 12.7,
  })

  const mapZoom = useRef({
    zoom: 220,
    targetZoom: 220,
  })

  useEffect(() => {
    camera.fov = 52
    camera.updateProjectionMatrix()
  }, [camera])

  useEffect(() => {
    const el = gl.domElement
    if (!el) return

    const onPointerDown = (e) => {
      if (phase !== 'play' || mode !== 'flight' || resetState.current.active) return
      cameraControl.current.dragging = true
      cameraControl.current.pointerId = e.pointerId
      cameraControl.current.lastX = e.clientX
      cameraControl.current.lastY = e.clientY
      cameraControl.current.mode = 'free'
      if (el.setPointerCapture) {
        try {
          el.setPointerCapture(e.pointerId)
        } catch {}
      }
    }

    const onPointerMove = (e) => {
      const ctrl = cameraControl.current
      if (!ctrl.dragging) return
      if (ctrl.pointerId !== null && e.pointerId !== ctrl.pointerId) return

      const dx = e.clientX - ctrl.lastX
      const dy = e.clientY - ctrl.lastY
      ctrl.lastX = e.clientX
      ctrl.lastY = e.clientY

      ctrl.targetYaw -= dx * 0.005
      ctrl.targetPitch = clamp(ctrl.targetPitch - dy * 0.0035, -0.45, 0.6)
    }

    const endDrag = (e) => {
      const ctrl = cameraControl.current
      if (!ctrl.dragging) return
      if (e.pointerId !== undefined && ctrl.pointerId !== null && e.pointerId !== ctrl.pointerId) return
      ctrl.dragging = false
      if (e.pointerId !== undefined && el.releasePointerCapture) {
        try {
          el.releasePointerCapture(e.pointerId)
        } catch {}
      }
      ctrl.pointerId = null
    }

    const onWheel = (e) => {
      if (phase !== 'play' || resetState.current.active) return
      e.preventDefault()

      if (mode === 'map') {
        const map = mapZoom.current
        map.targetZoom = clamp(map.targetZoom + e.deltaY * 0.16, 55, 420)
        return
      }

      if (mode !== 'flight') return
      const ctrl = cameraControl.current
      ctrl.mode = 'free'
      ctrl.targetDistance = clamp(ctrl.targetDistance + e.deltaY * 0.008, 6, 28)
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('wheel', onWheel)
    }
  }, [gl, mode, phase])

  useEffect(() => {
    if (!ship.current) return
    if (phase !== 'play') return

    resetState.current.active = true
    resetState.current.t = 0
    resetState.current.duration = 1.25
    resetState.current.fromShipPos.copy(ship.current.position)
    resetState.current.fromShipQuat.copy(ship.current.quaternion)
    resetState.current.fromCamPos.copy(camera.position)

    resetState.current.fromLookAt.copy(ship.current.position)

    velocity.current.set(0, 0, 0)
    setBoostLevel(0)
    setActiveSection(null)
    setMode('flight')

    cameraControl.current.mode = 'follow'
    cameraControl.current.dragging = false
    cameraControl.current.pointerId = null
    cameraControl.current.yaw = 0
    cameraControl.current.pitch = 0.08
    cameraControl.current.distance = 12.7
    cameraControl.current.targetYaw = 0
    cameraControl.current.targetPitch = 0.08
    cameraControl.current.targetDistance = 12.7
    mapZoom.current.zoom = 220
    mapZoom.current.targetZoom = 220
  }, [resetTick, camera, phase, setActiveSection, setBoostLevel, setMode])

  useFrame((state, delta) => {
    if (!ship.current) return

    if (phase === 'loading') {
      camera.position.lerp(new THREE.Vector3(0, 3, 32), 0.04)
      camera.lookAt(0, 0, -10)
      ship.current.position.lerp(new THREE.Vector3(0, -1, 12), 0.08)
      setBoostLevel((prev) => lerp(prev, 0, 0.15))
      return
    }

    if (phase === 'intro') {
      const introTargetPos = new THREE.Vector3(0, 12, 36 - reveal * 22)
      camera.position.lerp(introTargetPos, 0.035)
      camera.lookAt(0, 0, -80)
      ship.current.position.lerp(new THREE.Vector3(0, -1.6, 12 - reveal * 4), 0.05)
      ship.current.rotation.x = lerp(ship.current.rotation.x, 0.04, 0.08)
      ship.current.rotation.y = lerp(ship.current.rotation.y, Math.PI, 0.08)
      setBoostLevel((prev) => lerp(prev, 0, 0.15))
      cameraControl.current.mode = 'follow'
      return
    }

    if (resetState.current.active) {
      resetState.current.t += delta / resetState.current.duration
      const t = Math.min(resetState.current.t, 1)
      const k = easeOutCubic(t)

      ship.current.position.lerpVectors(resetState.current.fromShipPos, startShipPos, k)

      const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, Math.PI, 0))
      ship.current.quaternion.slerpQuaternions(resetState.current.fromShipQuat, targetQuat, k)

      camera.position.lerpVectors(resetState.current.fromCamPos, startCamPos, k)

      tempLookA.copy(resetState.current.fromLookAt)
      tempLookB.copy(ship.current.position)
      tempLookMix.lerpVectors(tempLookA, tempLookB, k)
      camera.lookAt(tempLookMix)
      setBoostLevel((prev) => lerp(prev, 0, 0.18))

      setHud({
        speed: '0.0',
        boost: false,
        boostLevel: 0,
        position: `${ship.current.position.x.toFixed(1)} / ${ship.current.position.y.toFixed(1)} / ${ship.current.position.z.toFixed(1)}`,
        sector: 'RESET',
        sectorHint: 'Returning to the starting corridor. Press W to continue flight.',
      })

      if (t >= 1) {
        resetState.current.active = false
        ship.current.position.copy(startShipPos)
        ship.current.rotation.set(0.08, Math.PI, 0)
        camera.position.copy(startCamPos)
        camera.lookAt(ship.current.position)
        velocity.current.set(0, 0, -8)
      }
      return
    }

    if (mode === 'map') {
      ship.current.rotation.x = lerp(ship.current.rotation.x, 0.08, 0.06)
      ship.current.rotation.y = lerp(ship.current.rotation.y, Math.PI, 0.06)

      const map = mapZoom.current
      map.zoom = lerp(map.zoom, map.targetZoom, 0.12)

      const shipPos = ship.current.position
      const mapPos = new THREE.Vector3(shipPos.x, map.zoom, shipPos.z)
      camera.position.lerp(mapPos, 0.08)
      camera.lookAt(shipPos.x, 0, shipPos.z)
      setBoostLevel((prev) => lerp(prev, 0, 0.12))
      cameraControl.current.mode = 'follow'

      setHud((prev) => ({
        ...prev,
        boost: false,
        boostLevel: 0,
        sector: activeSection ? activeSection.title : 'MAP',
        sectorHint: activeSection
          ? activeSection.body
          : 'Map mode enabled. Press M to return to flight. Use the mouse wheel to zoom the map. Press R to reset ship position.',
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
    const boosting = Boolean(boostNow && accelerating)

    const hasManualFlightInput =
      accelerating || braking || left || right || up || down || keys.ShiftLeft || keys.ShiftRight

    if (hasManualFlightInput) {
      cameraControl.current.mode = 'follow'
      cameraControl.current.dragging = false
      cameraControl.current.pointerId = null
    }

    // 检测飞船是否被用户实际控制；仅在明确操作飞船时隐藏 H 面板
    const isMoving = hasManualFlightInput
    if (onShipMoving) {
      onShipMoving(isMoving)
    }

    const yawSpeed = boostNow ? 1.45 : 1.2
    const pitchSpeed = boostNow ? 0.95 : 0.8

    if (left) ship.current.rotation.y += yawSpeed * delta
    if (right) ship.current.rotation.y -= yawSpeed * delta
    if (up) ship.current.rotation.x = clamp(ship.current.rotation.x + pitchSpeed * delta, -0.55, 0.55)
    if (down) ship.current.rotation.x = clamp(ship.current.rotation.x - pitchSpeed * delta, -0.55, 0.55)

    const targetBoostLevel = boostNow ? (accelerating ? 1 : 0.55) : 0
    setBoostLevel((prev) => lerp(prev, targetBoostLevel, boostNow ? 0.14 : 0.1))

    tempForward.set(0, 0, 1).applyQuaternion(ship.current.quaternion).normalize()

    const thrust = boostNow ? 23 : 10
    const brakeForce = boostNow ? 10.5 : 8

    if (accelerating) velocity.current.addScaledVector(tempForward, thrust * delta)
    if (braking) velocity.current.addScaledVector(tempForward, -brakeForce * delta)

    velocity.current.multiplyScalar(Math.pow(boostNow ? 0.991 : 0.988, delta * 60))
    velocity.current.clampLength(2, boostNow ? 31 : 15)

    ship.current.position.addScaledVector(velocity.current, delta)
    ship.current.position.x = clamp(ship.current.position.x, -32, 32)
    ship.current.position.y = clamp(ship.current.position.y, -18, 18)

    for (const section of sections) {
      collisionDelta.copy(ship.current.position).sub(section.position)
      let distance = collisionDelta.length()
      const minDistance = shipCollisionRadius + (section.collisionRadius || 7)

      if (distance < minDistance) {
        if (distance < 0.0001) {
          collisionDelta.set(0, 0, 1)
          distance = 1
        }

        collisionNormal.copy(collisionDelta).divideScalar(distance)
        ship.current.position.copy(section.position).addScaledVector(collisionNormal, minDistance)

        const outwardSpeed = velocity.current.dot(collisionNormal)
        if (outwardSpeed < 0) {
          velocity.current.addScaledVector(collisionNormal, -outwardSpeed)
          velocity.current.multiplyScalar(0.9)
        }
      }
    }

    const ctrl = cameraControl.current
    ctrl.yaw = lerp(ctrl.yaw, ctrl.targetYaw, 0.14)
    ctrl.pitch = lerp(ctrl.pitch, ctrl.targetPitch, 0.14)
    ctrl.distance = lerp(ctrl.distance, ctrl.targetDistance, 0.16)

    const cameraDistance = boostNow ? -14.5 : -12
    const cameraHeight = boostNow ? 4.9 : 4.2

    if (ctrl.mode === 'free') {
      freeRight.crossVectors(tempForward, tempUp).normalize()

      freeOffset
        .copy(tempForward)
        .multiplyScalar(-Math.cos(ctrl.yaw) * ctrl.distance)
        .addScaledVector(freeRight, Math.sin(ctrl.yaw) * ctrl.distance)
        .addScaledVector(tempUp, cameraHeight + Math.sin(ctrl.pitch) * ctrl.distance)

      tempCamPos.copy(ship.current.position).add(freeOffset)
      camera.position.lerp(tempCamPos, 1 - Math.pow(0.0025, delta))
      tempCamLook.copy(ship.current.position)
      camera.lookAt(tempCamLook)
    } else {
      tempCamPos
        .copy(ship.current.position)
        .add(tempForward.clone().multiplyScalar(cameraDistance))
        .add(tempUp.clone().multiplyScalar(cameraHeight))

      camera.position.lerp(tempCamPos, 1 - Math.pow(boostNow ? 0.0016 : 0.0025, delta))
      tempCamLook.copy(ship.current.position)
      camera.lookAt(tempCamLook)

      ctrl.targetYaw = lerp(ctrl.targetYaw, 0, 0.18)
      ctrl.targetPitch = lerp(ctrl.targetPitch, 0.08, 0.18)
      ctrl.targetDistance = lerp(ctrl.targetDistance, boostNow ? 15.2 : 12.7, 0.18)
    }

    let nearestSection = null
    let nearestDistance = Infinity

    for (const section of sections) {
      const distance = ship.current.position.distanceTo(section.position)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestSection = section
      }
    }

    const currentSection = nearestDistance < 24 ? nearestSection : null

    if (currentSection?.id !== activeSection?.id || (!currentSection && activeSection)) {
      setActiveSection(currentSection)
    }

    setHud({
      speed: velocity.current.length().toFixed(1),
      boost: boosting,
      boostLevel: targetBoostLevel,
      position: `${ship.current.position.x.toFixed(1)} / ${ship.current.position.y.toFixed(1)} / ${ship.current.position.z.toFixed(1)}`,
      sector: currentSection ? currentSection.title : 'TRANSIT',
      sectorHint: currentSection
        ? currentSection.body
        : boosting
          ? 'Boost engaged. Hold Shift + W to surge through the corridor.'
          : 'Navigate toward a celestial body to open a portfolio sector.',
    })
  })

  return (
    <group>
      <group ref={ship} position={[0, -1, 12]} rotation={[0.08, Math.PI, 0]}>
        <Faifnir scale={0.2} visible={phase !== 'loading'} boostLevel={boostLevel} />
        <WarpLines active={phase === 'play' && mode === 'flight'} amount={boostLevel} />
      </group>

      <StarLane speedFactor={Math.min(1, velocity.current.length() / 26)} boostLevel={boostLevel} />
      <NebulaRings boostLevel={boostLevel} />
      <SectionMarkers activeSection={activeSection} reveal={reveal} mode={mode} />

      {mode === 'map' &&
        SECTION_DEFS.map((item) => (
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

      <MapLabels sections={SECTION_DEFS} mode={mode} activeSection={activeSection} />
      <CurrentPositionMarker shipRef={ship} mode={mode} />
    </group>
  )
}


function ContactIcon({ label }) {
  if (label === 'Email') {
    return <MdEmail size={18} aria-hidden="true" />
  }

  if (label === 'GitHub') {
    return <FaGithub size={16} aria-hidden="true" />
  }

  if (label === 'X') {
    return <FaXTwitter size={16} aria-hidden="true" />
  }

  if (label === 'Instagram') {
    return <FaInstagram size={16} aria-hidden="true" />
  }

  return label
}

function SectorPanel({ activeSection, mode }) {
  if (mode === 'map' && !activeSection) {
    return (
      <div className="panel panel-main right-mid">
        <div className="tagline">Star Map</div>
        <div className="title-md">Sector Overview</div>
        <p className="body-copy">
          Press <strong>M</strong> again to return to flight mode. Press <strong>R</strong> to
          reset the ship to the starting corridor.
        </p>
      </div>
    )
  }

  if (!activeSection) return null

  return (
    <div className="panel panel-main right-mid" style={{ pointerEvents: 'auto' }}>
      <div className="tagline">{activeSection.eyebrow}</div>
      <div className="title-md">{activeSection.title}</div>
      <p className="body-copy" style={{ whiteSpace: 'pre-line' }}>{activeSection.body}</p>
      <div className="pills" style={{ pointerEvents: 'auto' }}>
        {activeSection.cta.map((item) => {
          const label = typeof item === 'string' ? item : item.label
          const href = typeof item === 'string' ? '#' : item.href
          const external = href && !href.startsWith('mailto:')
          return (
            <a
              key={label}
              className="pill"
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto', cursor: 'pointer', textDecoration: 'none' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <ContactIcon label={label} />
              </span>
            </a>
          )
        })}
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

function ControlsPanel({ show }) {
  if (!show) return null
  return (
    <div className="panel panel-main top-left" style={{ position: 'absolute', top: 104, left: 24, maxWidth: 280, zIndex: 13 }}>
      <div className="tagline">Controls (Press H to hide)</div>
      <div className="body-copy" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
        <strong>W</strong> / ↑ thrust · <strong>S</strong> / ↓ brake · <strong>A,D</strong> turn · <strong>Space</strong> / <strong>Ctrl</strong> pitch · <strong>Shift</strong> boost · <strong>M</strong> map · <strong>R</strong> reset
      </div>
    </div>
  )
}

function HUD({ hud, activeSection, mode, phase, boostLevel, hasInteracted, showControls, isShipMoving }) {
  return (
    <div className={`overlay ${boostLevel > 0.08 ? 'overlay-boost' : ''}`}>
      <div className="vignette" />
      <div className="speed-lines" style={{ opacity: Math.min(1, boostLevel) }} />

      <div className="panel panel-compact top-left">
        <div className="tagline">DRYTRON SATELLAR</div>
        <div className="title-sm">ELUNERAS</div>
      </div>

      <ControlsPanel show={showControls && !isShipMoving} />

      <div className="panel panel-compact top-right">
        <div className="tagline">{mode === 'map' ? 'Mode' : 'Velocity'}</div>
        <div className="kv">{mode === 'map' ? 'MAP' : hud.speed}</div>
        <div className="muted">{mode === 'map' ? 'press M to exit' : 'units / sec'}</div>
      </div>

      {!activeSection && (
        <div
          className="panel panel-main"
          style={{
            position: 'absolute',
            left: 24,
            bottom: 24,
            width: 'min(300px, calc(100vw - 420px))',
            padding: '14px 16px',
            zIndex: 12,
          }}
        >
          <div className="tagline">Current Sector</div>
          <div className="title-sm" style={{ fontSize: '1rem', marginBottom: 6 }}>
            {phase !== 'play' ? 'INTRO' : hud.sector}
          </div>
          <p className="body-copy" style={{ fontSize: '0.88rem', lineHeight: 1.45, margin: 0 }}>
            {phase !== 'play'
              ? 'Stand by while the world loads and the navigation map unfolds.'
              : hud.sectorHint}
          </p>
        </div>
      )}

      <SectorPanel activeSection={activeSection} mode={mode} />

      <div
        className="panel panel-main bottom-right"
        style={{
          position: 'absolute',
          right: 24,
          bottom: 24,
          padding: '10px 14px',
          fontSize: '0.85rem',
          zIndex: 12,
        }}
      >
        <div className="grid-stats">
          <div className="label" style={{ fontSize: '0.7rem' }}>Boost</div>
          <div>{hud.boost ? 'Active' : boostLevel > 0.1 ? 'Charging' : 'Standby'}</div>
          <div className="label" style={{ fontSize: '0.7rem' }}>Position</div>
          <div style={{ fontSize: '0.8rem' }}>{hud.position}</div>
        </div>
      </div>

      {!hasInteracted && (
        <div className="panel panel-main bottom-left">
          <div className="tagline">Concept</div>
          <p className="body-copy">
            Draconis was not built merely to cross space, but to remember it. To pilot Draconis was to enter a pact with the unknown. Every sector it approached became part of its story, every turn through the void another chapter in a journey without final destination. In the endless expanse of space, Draconis was both wanderer and guardian.
          </p>
        </div>
      )}

      {phase === 'play' && (
        <div className={`crosshair ${boostLevel > 0.2 ? 'crosshair-boost' : ''}`}>
          <div className="crosshair-ring" style={{ opacity: 0.18 + boostLevel * 0.52 }} />
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState(null)
  const [hud, setHud] = useState({
    speed: '8.0',
    boost: false,
    boostLevel: 0,
    position: '0.0 / 0.0 / 12.0',
    sector: 'TRANSIT',
    sectorHint: 'Navigate toward a celestial body to open a portfolio sector.',
  })

  const [phase, setPhase] = useState('loading')
  const [mode, setMode] = useState('flight')
  const [reveal, setReveal] = useState(0)
  const [resetTick, setResetTick] = useState(0)
  const [boostLevel, setBoostLevel] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isShipMoving, setIsShipMoving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('intro'), 300)
    const t2 = setTimeout(() => setPhase('play'), 1800)

    const skipToPlay = () => {
      setHasInteracted(true)
      setPhase('play')
    }
    window.addEventListener('pointerdown', skipToPlay)
    window.addEventListener('keydown', skipToPlay)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('pointerdown', skipToPlay)
      window.removeEventListener('keydown', skipToPlay)
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
      if (e.repeat) return
      setHasInteracted(true)

      if (phase !== 'play') return

      if (e.code === 'KeyH') {
        setShowControls((prev) => !prev)
        return
      }

      if (e.code === 'KeyM') {
        setMode((prev) => (prev === 'flight' ? 'map' : 'flight'))
      }

      if (e.code === 'KeyR') {
        setMode('flight')
        setResetTick((v) => v + 1)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  return (
    <div className="app">
      <div className="canvas-wrap">
        <Canvas camera={{ position: [0, 3, 32], fov: 52 }} gl={{ antialias: true }}>
          <SpaceEnvironment />
          <SpaceBackdrop position={[0, 8, -150]} scale={22} rotation={[0, 0, 0]} />
          <SceneController
            setHud={setHud}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            phase={phase}
            mode={mode}
            setMode={setMode}
            reveal={reveal}
            resetTick={resetTick}
            boostLevel={boostLevel}
            setBoostLevel={setBoostLevel}
            onShipMoving={setIsShipMoving}
          />
        </Canvas>
      </div>

      <HUD hud={hud} activeSection={activeSection} mode={mode} phase={phase} boostLevel={boostLevel} hasInteracted={hasInteracted} showControls={showControls} isShipMoving={isShipMoving} />
      <IntroOverlay phase={phase} reveal={reveal} />
    </div>
  )
}
