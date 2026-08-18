import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import NeuralNodes from './NeuralNodes'
import NeuralConnections from './NeuralConnections'
import DataParticles from './DataParticles'

const SIGNAL = '#f2914b'

const getSectionBaseRotation = (p) => p * Math.PI * 2

export default function AIWorld({
  stageProgress = 0,
  assemblyProgress = 1.0,
  spin = true,
  onUserDrag,
  particleBurstEvent = null,
}) {
  const groupRef = useRef(null)
  const isDragging = useRef(false)
  const previousPointer = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ x: 0, y: 0 })

  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement
    if (!canvas) return

    const handlePointerDown = (e) => {
      if (e.button !== 0) return // Left click only
      isDragging.current = true
      previousPointer.current = { x: e.clientX, y: e.clientY }
      document.body.style.cursor = 'grabbing'
      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
      if (onUserDrag) onUserDrag()
    }

    const handleSelectStart = (e) => {
      if (isDragging.current) {
        e.preventDefault()
      }
    }

    const handlePointerMove = (e) => {
      if (!isDragging.current) return
      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
      const deltaX = e.clientX - previousPointer.current.x
      const deltaY = e.clientY - previousPointer.current.y
      previousPointer.current = { x: e.clientX, y: e.clientY }

      // Rotate group directly
      dragOffset.current.x += deltaX * 0.008
      dragOffset.current.y += deltaY * 0.008

      // Clamp vertical drag pitch
      dragOffset.current.y = THREE.MathUtils.clamp(dragOffset.current.y, -Math.PI / 3, Math.PI / 3)
    }

    const handlePointerUp = () => {
      isDragging.current = false
      document.body.style.cursor = 'default'
    }

    const handleContextLost = (e) => {
      e.preventDefault()
      console.warn('WebGL context lost. Pausing rendering pipeline.')
    }

    const handleContextRestored = () => {
      console.info('WebGL context restored. Re-initializing WebGL state.')
      if (gl) gl.resetState()
    }

    canvas.addEventListener('webglcontextlost', handleContextLost, false)
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false)

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('selectstart', handleSelectStart)

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('selectstart', handleSelectStart)
    }
  }, [gl, onUserDrag])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Calculate scroll-defined base rotation
    const baseRotationY = getSectionBaseRotation(stageProgress)

    // Smoothly damp user drag offset back to 0 when not dragging
    if (!isDragging.current) {
      dragOffset.current.x = THREE.MathUtils.damp(dragOffset.current.x, 0, 3.5, delta)
      dragOffset.current.y = THREE.MathUtils.damp(dragOffset.current.y, 0, 3.5, delta)
    }

    // Apply combined rotation to group (never touching camera)
    groupRef.current.rotation.y = baseRotationY + dragOffset.current.x
    groupRef.current.rotation.x = dragOffset.current.y
  })

  return (
    <group ref={groupRef}>
      {/* Lighting matches key light from upper right */}
      <directionalLight position={[4, 5, 3]} intensity={7} color="#fff4e8" />
      <directionalLight position={[-3, -2, 2]} intensity={0.8} color="#2a3446" />
      <ambientLight intensity={0.35} color="#232b38" />
      <pointLight position={[1.5, 1, 4]} intensity={3} color={SIGNAL} distance={7} decay={2} />

      <NeuralNodes stageProgress={stageProgress} assemblyProgress={assemblyProgress} particleBurstEvent={particleBurstEvent} />
      <NeuralConnections stageProgress={stageProgress} assemblyProgress={assemblyProgress} />
      <DataParticles stageProgress={stageProgress} animate={spin} particleBurstEvent={particleBurstEvent} />
    </group>
  )
}
