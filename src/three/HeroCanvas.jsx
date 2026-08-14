import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import AIWorld from './AIWorld'
import ScrollCamera from './ScrollCamera'
import CanvasErrorBoundary from './CanvasErrorBoundary'
import HeroFallback from '../components/hero/HeroFallback'
import { usePrefersReducedMotion, useIsLowPowerDevice } from '../lib/motion'

// Cache WebGL availability once at module scope
const webglAvailable = (() => {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
})()

export default function HeroCanvas({ assemblyProgress = 1.0, onUserDrag, particleBurstEvent = null }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isLowPower = useIsLowPowerDevice()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isTabVisible, setIsTabVisible] = useState(true)

  // Pause R3F render loop completely when browser tab is hidden to save battery
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible')
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  if (!webglAvailable) {
    return <HeroFallback />
  }

  return (
    <CanvasErrorBoundary fallback={<HeroFallback />}>
      <Canvas
        dpr={[1, isLowPower ? 1.25 : 1.75]}
        frameloop={isTabVisible ? 'always' : 'never'}
        camera={{ fov: 45, position: [0, 0.2, 6.4] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <AIWorld
            stageProgress={scrollProgress}
            assemblyProgress={assemblyProgress}
            spin={!prefersReducedMotion}
            onUserDrag={onUserDrag}
            particleBurstEvent={particleBurstEvent}
          />
          <ScrollCamera
            enabled={!prefersReducedMotion && !isLowPower}
            onProgress={setScrollProgress}
          />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  )
}
