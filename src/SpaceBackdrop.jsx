import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function prepareScene(scene, { backSide = false, skybox = false } = {}) {
  const s = scene.clone(true)

  s.traverse((obj) => {
    if (!obj.isMesh) return

    obj.frustumCulled = false
    obj.renderOrder = skybox ? -1000 : -10

    if (obj.material) {
      obj.material = obj.material.clone()
      if ('side' in obj.material) obj.material.side = backSide ? THREE.BackSide : THREE.DoubleSide
      if ('depthWrite' in obj.material) obj.material.depthWrite = !skybox
      if ('depthTest' in obj.material) obj.material.depthTest = !skybox
      if ('fog' in obj.material) obj.material.fog = !skybox ? true : false
      if ('toneMapped' in obj.material) obj.material.toneMapped = false
      if ('transparent' in obj.material) obj.material.transparent = true
      if ('opacity' in obj.material && obj.material.opacity === 0) obj.material.opacity = 1
      if ('emissive' in obj.material) obj.material.emissive = new THREE.Color('#9ecbff')
      if ('emissiveIntensity' in obj.material) {
        obj.material.emissiveIntensity = skybox ? 0.35 : 0.18
      }
    }
  })

  return s
}

function NebulaSkybox() {
  const group = useRef()
  const { camera } = useThree()
  const { scene } = useGLTF('/models/nebula_skybox_16k.glb')

  const cloned = useMemo(() => prepareScene(scene, { backSide: true, skybox: true }), [scene])

  useFrame(() => {
    if (!group.current) return
    group.current.position.copy(camera.position)
    const d = Math.max(900, camera.far * 0.85)
    group.current.scale.setScalar(d)
  })

  return <primitive ref={group} object={cloned} />
}

function DeepSpaceObject({ position = [0, 8, -150], scale = 22, rotation = [0, 0, 0] }) {
  const group = useRef()
  const { scene } = useGLTF('/models/need_some_space.glb')

  const cloned = useMemo(() => prepareScene(scene, { backSide: false, skybox: false }), [scene])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.03
    group.current.rotation.z += delta * 0.01
  })

  return (
    <group ref={group} position={position} scale={scale} rotation={rotation}>
      <primitive object={cloned} />
    </group>
  )
}

export default function SpaceBackdrop(props) {
  return (
    <>
      <NebulaSkybox />
      <DeepSpaceObject {...props} />
    </>
  )
}

useGLTF.preload('/models/nebula_skybox_16k.glb')
useGLTF.preload('/models/need_some_space.glb')
