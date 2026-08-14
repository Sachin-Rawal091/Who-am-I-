import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS } from '../../data/projects'
import ProjectCard3D from './ProjectCard3D'

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PROJECTS.length)
  }, [])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length)
  }, [])

  // Keyboard navigation when section is in focus or keydown event fires
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle arrow keys if section is in viewport
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) return

      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  // Drag swipe handler for touch / mouse gesture
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50
    const velocityThreshold = 300

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext()
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev()
    }
  }

  const currentProject = PROJECTS[activeIndex]

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Inference — Projects"
      className="relative z-10 overflow-hidden px-6 py-16 md:px-12 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Title & Dynamic Model Telemetry Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs tracking-wide text-mist">$ stage 04: inference_output</p>
            <h2 className="mt-1.5 font-display text-2xl tracking-tight text-foam sm:text-3xl lg:text-4xl">
              Inference &amp; Shipped Projects
            </h2>
          </div>

          {/* Model index indicator */}
          <div className="inline-flex items-center gap-3 rounded-full border border-hairline/80 bg-void/80 px-4 py-1.5 font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
            <span className="text-mist">MODEL</span>
            <span className="font-semibold text-foam">
              0{activeIndex + 1} / 0{PROJECTS.length}
            </span>
            <span className="hidden text-mist/60 sm:inline">•</span>
            <span className="hidden truncate max-w-[140px] text-signal sm:inline">
              {currentProject.title}
            </span>
          </div>
        </div>

        {/* 3D Swipe Stage Container */}
        <div className="relative mt-6 mb-6 flex min-h-[440px] items-center justify-center sm:mt-8 sm:mb-8 sm:min-h-[420px] lg:min-h-[400px]">
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/5 blur-3xl" />

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Project"
            className="group absolute left-0 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center rounded-full border border-hairline/80 bg-void/90 p-3 text-mist backdrop-blur-md transition-all duration-200 hover:border-signal/50 hover:bg-graphite hover:text-signal focus:outline-none focus:ring-2 focus:ring-signal sm:flex md:-left-4"
          >
            <span className="text-lg font-mono transition-transform duration-200 group-hover:-translate-x-0.5">
              ←
            </span>
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Project"
            className="group absolute right-0 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center rounded-full border border-hairline/80 bg-void/90 p-3 text-mist backdrop-blur-md transition-all duration-200 hover:border-signal/50 hover:bg-graphite hover:text-signal focus:outline-none focus:ring-2 focus:ring-signal sm:flex md:-right-4"
          >
            <span className="text-lg font-mono transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </button>

          {/* Perspective Stage with Motion Drag */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="perspective-1000 relative h-full w-full max-w-4xl py-2 touch-pan-y cursor-grab active:cursor-grabbing"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {PROJECTS.map((project, idx) => {
              const offset = idx - activeIndex
              return (
                <ProjectCard3D
                  key={project.id}
                  project={project}
                  offset={offset}
                  isActive={idx === activeIndex}
                  onClick={() => setActiveIndex(idx)}
                />
              )
            })}
          </motion.div>
        </div>

        {/* Swipe Hint & Interactive Pagination Controls */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-mono text-[11px] text-mist/70">
            <span className="inline-block animate-bounce mr-1">↔</span> Drag or use <kbd className="rounded border border-hairline px-1 py-0.5 text-[10px] text-mist">←</kbd> <kbd className="rounded border border-hairline px-1 py-0.5 text-[10px] text-mist">→</kbd> keys to navigate cards
          </p>

          {/* Pagination Pill Indicators */}
          <div className="flex items-center gap-2">
            {PROJECTS.map((project, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={project.id}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to project ${idx + 1}: ${project.title}`}
                  className={`group relative flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-all duration-300 ${
                    isActive
                      ? 'border-signal/50 bg-signal/15 text-foam shadow-[0_0_12px_rgba(242,145,75,0.2)]'
                      : 'border-hairline/80 bg-void/80 text-mist hover:border-hairline hover:text-foam'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-signal scale-125' : 'bg-mist/40 group-hover:bg-mist'
                    }`}
                  />
                  <span>0{idx + 1}</span>
                  {isActive && (
                    <span className="hidden text-[11px] text-signal sm:inline">{project.title}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
