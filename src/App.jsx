import { useState, useEffect, lazy, Suspense } from 'react'
import SmoothScroll from './components/layout/SmoothScroll'
import SystemIntro from './components/boot/SystemIntro'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Training from './components/sections/Training'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import Footer from './components/sections/Footer'
import DragIndicator from './components/ui/DragIndicator'
import PipelineHUD from './components/ui/PipelineHUD'
import { usePipelineScroll } from './hooks/usePipelineScroll'

const HeroCanvas = lazy(() => import('./three/HeroCanvas'))

export default function App() {
  const [assemblyProgress, setAssemblyProgress] = useState(0.0)
  const [hasDragged, setHasDragged] = useState(false)
  const [particleBurstEvent, setParticleBurstEvent] = useState(null)

  const pipeline = usePipelineScroll()

  useEffect(() => {
    // Smooth live 3D node assembly animation on page load (1.8 seconds)
    const startTime = performance.now()
    const duration = 1800

    const animateAssembly = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(1.0, elapsed / duration)
      setAssemblyProgress(progress)

      if (progress < 1.0) {
        requestAnimationFrame(animateAssembly)
      }
    }

    const animId = requestAnimationFrame(animateAssembly)
    return () => cancelAnimationFrame(animId)
  }, [])

  const handleUserDrag = () => {
    if (!hasDragged) {
      setHasDragged(true)
    }
  }

  const triggerDeployPulse = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.style.transform = 'scale(1.02)'
      setTimeout(() => {
        canvas.style.transform = 'scale(1.0)'
      }, 350)
    }
  }

  return (
    <>
      <a href="#main" className="sr-only sr-only-focusable">
        Skip to main content
      </a>

      {/* Persistent 3D Canvas in Background Shell */}
      <div className="fixed inset-0 z-0 cursor-grab active:cursor-grabbing" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroCanvas
            assemblyProgress={assemblyProgress}
            onUserDrag={handleUserDrag}
            particleBurstEvent={particleBurstEvent}
          />
        </Suspense>
      </div>

      <DragIndicator dismissed={hasDragged} />

      {/* Pipeline Execution HUD — floats above everything during auto-scroll */}
      <PipelineHUD
        isRunning={pipeline.isRunning}
        stageNumber={pipeline.stageNumber}
        stageLabel={pipeline.stageLabel}
        currentStage={pipeline.currentStage}
        stageCount={pipeline.stageCount}
        onCancel={pipeline.cancel}
      />

      <SmoothScroll>
        <main id="main" tabIndex={-1} className="relative z-10 overflow-x-hidden focus:outline-none">
          <SystemIntro onRunPipeline={pipeline.start} />
          <About onParticleBurst={setParticleBurstEvent} />
          <Skills onParticleBurst={setParticleBurstEvent} />
          <Training />
          <Projects />
          <Contact onDeployPulse={triggerDeployPulse} />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}

