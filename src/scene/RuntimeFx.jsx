import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function BootReadyBridge({ onReady, onProgress }) {
  const { active, progress } = useProgress()
  const sentReadyRef = useRef(false)
  const visualProgressRef = useRef(0)
  const startTimeRef = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now())
  const lastTickRef = useRef(startTimeRef.current)

  useEffect(() => {
    const LINEAR_TO_99_MS = 7000
    const FORCE_READY_MS = 12000
    const NORMAL_RATE = 16
    const FINISH_RATE = 65

    let raf = 0

    const tick = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const dt = Math.max(0.001, (now - lastTickRef.current) / 1000)
      lastTickRef.current = now
      const elapsedMs = now - startTimeRef.current

      const loaderProgress = clamp(progress, 0, 100)

      const linearTarget99 = clamp((elapsedMs / LINEAR_TO_99_MS) * 99, 1, 99)
      const loaderTarget99 = clamp(loaderProgress * 0.99, 1, 99)
      const target99 = Math.max(linearTarget99, loaderTarget99 * 0.82)

      const shouldFinish = (loaderProgress >= 100 && !active) || elapsedMs >= FORCE_READY_MS

      if (shouldFinish) {
        visualProgressRef.current = Math.min(100, visualProgressRef.current + FINISH_RATE * dt)
      } else {
        const next = Math.min(target99, visualProgressRef.current + NORMAL_RATE * dt)
        visualProgressRef.current = Math.max(1, next)
      }

      if (visualProgressRef.current >= 99.95) {
        visualProgressRef.current = 100
        onProgress?.(100)
        if (!sentReadyRef.current) {
          sentReadyRef.current = true
          onReady?.()
        }
        return
      }

      onProgress?.(Math.max(1, visualProgressRef.current))
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, progress, onProgress, onReady])

  return null
}

export function BloomFx() {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef()

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.12

    const composer = new EffectComposer(gl)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.1,
      0.2,
      0.45
    )
    composer.addPass(bloomPass)

    composerRef.current = composer

    return () => {
      composer.dispose()
      composerRef.current = null
    }
  }, [gl, scene, camera, size.width, size.height])

  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height)
    }
  }, [size])

  useFrame(() => {
    if (composerRef.current) {
      gl.autoClear = true
      composerRef.current.render()
    }
  }, 1)

  return null
}
