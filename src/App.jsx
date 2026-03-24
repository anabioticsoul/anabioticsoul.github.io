import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'
import SpaceBackdrop from './assets/SpaceBackdrop'
import useViewportInfo from './hooks/useViewportInfo'
import { HUD, IntroOverlay, MobileControls } from './ui/OverlayUI'
import { BootReadyBridge, BloomFx } from './scene/RuntimeFx'
import SceneController from './scene/SceneController'

function lerp(a, b, t) {
  return a + (b - a) * t
}

function SpaceEnvironment() {
  return (
    <>
      <color attach="background" args={['#02040c']} />
      <fog attach="fog" args={['#02040c', 40, 260]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[8, 10, 6]} intensity={1.1} color="#b8f1ff" />
      <pointLight position={[-24, 10, -20]} intensity={20} distance={120} color="#4aa8ff" />
      <pointLight position={[24, -8, 20]} intensity={12} distance={100} color="#4ce0d2" />
      <Stars radius={280} depth={180} count={9000} factor={4.5} saturation={0} fade speed={0.45} />
      <Sparkles count={220} scale={[180, 100, 220]} size={2.2} speed={0.25} color="#c7f9ff" />
    </>
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
  const [bootReady, setBootReady] = useState(false)
  const [mode, setMode] = useState('flight')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [reveal, setReveal] = useState(0)
  const [resetTick, setResetTick] = useState(0)
  const [boostLevel, setBoostLevel] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isShipMoving, setIsShipMoving] = useState(false)
  const viewport = useViewportInfo()
  const [mobileInput, setMobileInput] = useState({
    forward: false,
    back: false,
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false,
  })

  useEffect(() => {
    if (!viewport.isTouch) return
    setShowControls(true)
  }, [viewport.isTouch])

  useEffect(() => {
    const clearTouchInput = () => {
      setMobileInput({
        forward: false,
        back: false,
        left: false,
        right: false,
        up: false,
        down: false,
        boost: false,
      })
    }

    window.addEventListener('pointerup', clearTouchInput)
    window.addEventListener('pointercancel', clearTouchInput)
    window.addEventListener('blur', clearTouchInput)

    return () => {
      window.removeEventListener('pointerup', clearTouchInput)
      window.removeEventListener('pointercancel', clearTouchInput)
      window.removeEventListener('blur', clearTouchInput)
    }
  }, [])

  useEffect(() => {
    if (!bootReady) {
      setPhase('loading')
      return
    }

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
  }, [bootReady])

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
      if (!bootReady) return

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
  }, [bootReady, phase])

  return (
    <div className="app">
      <div
        className="canvas-wrap"
        style={{
          opacity: phase === 'play' ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      >
        <Canvas camera={{ position: [0, 3, 32], fov: 52 }} gl={{ antialias: true }}>
          <BootReadyBridge onReady={() => setBootReady(true)} onProgress={setLoadingProgress} />
          <SpaceEnvironment />
          <SpaceBackdrop position={[0, 8, -150]} scale={22} rotation={[0, 0, 0]} />
          <BloomFx />
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
            mobileInput={mobileInput}
          />
        </Canvas>
      </div>

      <HUD hud={hud} activeSection={activeSection} mode={mode} phase={phase} boostLevel={boostLevel} hasInteracted={hasInteracted} showControls={showControls} isShipMoving={isShipMoving} />
      <MobileControls
        visible={bootReady}
        phase={phase}
        mode={mode}
        setMode={setMode}
        onReset={() => setResetTick((v) => v + 1)}
        setHasInteracted={setHasInteracted}
        setShowControls={setShowControls}
        input={mobileInput}
        setInput={setMobileInput}
      />
      <IntroOverlay phase={phase} reveal={reveal} loadingProgress={loadingProgress} />
    </div>
  )
}
