import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Line } from '@react-three/drei'
import * as THREE from 'three'
import CelestialMarker from '../sections/CelestialMarker'
import { SECTION_DEFS } from '../sections/sectionDefs'
import Faifnir from '../assets/Fafnir'
import currentMarkerUrl from '../../public/map-marker.svg'

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

export default function SceneController({
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
  mobileInput,
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

  const startShipPos = useMemo(() => new THREE.Vector3(0, 2.2, 12), [])
  const startCamPos = useMemo(() => new THREE.Vector3(0, 6.2, 30), [])
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
  const pinchGesture = useRef({
    active: false,
    lastDistance: 0,
  })

  useEffect(() => {
    camera.fov = 52
    camera.updateProjectionMatrix()
  }, [camera])

  useEffect(() => {
    const el = gl.domElement
    if (!el) return

    const getTouchDistance = (touches) => {
      if (!touches || touches.length < 2) return 0
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      return Math.hypot(dx, dy)
    }

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

    const onTouchStart = (e) => {
      if (phase !== 'play' || resetState.current.active) return
      if (e.touches.length < 2) return

      const distance = getTouchDistance(e.touches)
      if (distance <= 0) return

      pinchGesture.current.active = true
      pinchGesture.current.lastDistance = distance
      e.preventDefault()
    }

    const onTouchMove = (e) => {
      if (phase !== 'play' || resetState.current.active) return
      if (!pinchGesture.current.active || e.touches.length < 2) return

      const distance = getTouchDistance(e.touches)
      if (distance <= 0) return

      const delta = distance - pinchGesture.current.lastDistance
      pinchGesture.current.lastDistance = distance

      if (mode === 'map') {
        const map = mapZoom.current
        map.targetZoom = clamp(map.targetZoom - delta * 0.12, 55, 420)
        e.preventDefault()
        return
      }

      if (mode !== 'flight') return
      const ctrl = cameraControl.current
      ctrl.mode = 'free'
      ctrl.targetDistance = clamp(ctrl.targetDistance - delta * 0.006, 6, 28)
      e.preventDefault()
    }

    const endPinch = () => {
      pinchGesture.current.active = false
      pinchGesture.current.lastDistance = 0
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', endPinch)
    el.addEventListener('touchcancel', endPinch)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', endPinch)
      el.removeEventListener('touchcancel', endPinch)
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
      camera.position.lerp(new THREE.Vector3(0, 6.2, 30), 0.04)
      camera.lookAt(0, 6.2, -96)
      ship.current.position.lerp(new THREE.Vector3(0, 2.2, 12), 0.08)
      setBoostLevel((prev) => lerp(prev, 0, 0.15))
      return
    }

    if (phase === 'intro') {
      const introTargetPos = new THREE.Vector3(0, 8.8, 34 - reveal * 21)
      camera.position.lerp(introTargetPos, 0.035)
      camera.lookAt(0, 6.2, -100)
      ship.current.position.lerp(new THREE.Vector3(0, 2.2, 12 - reveal * 4), 0.05)
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

    const accelerating = keys.KeyW || keys.ArrowUp || mobileInput.forward
    const braking = keys.KeyS || keys.ArrowDown || mobileInput.back
    const left = keys.KeyA || keys.ArrowLeft || mobileInput.left
    const right = keys.KeyD || keys.ArrowRight || mobileInput.right
    const up = keys.Space || mobileInput.up
    const down = keys.ControlLeft || keys.ControlRight || mobileInput.down
    const boostNow = keys.ShiftLeft || keys.ShiftRight || mobileInput.boost
    const boosting = Boolean(boostNow && accelerating)

    const hasManualFlightInput =
      accelerating || braking || left || right || up || down || keys.ShiftLeft || keys.ShiftRight

    if (hasManualFlightInput) {
      cameraControl.current.mode = 'follow'
      cameraControl.current.dragging = false
      cameraControl.current.pointerId = null
    }

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
      <group ref={ship} position={[0, 2.2, 12]} rotation={[0.08, Math.PI, 0]}>
        <Faifnir scale={0.2} visible={phase !== 'loading'} boostLevel={boostLevel} />
        <WarpLines active={phase === 'play' && mode === 'flight'} amount={boostLevel} />
      </group>

      <StarLane speedFactor={Math.min(1, velocity.current.length() / 26)} boostLevel={boostLevel} />
      {/* <NebulaRings boostLevel={boostLevel} /> */}
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
