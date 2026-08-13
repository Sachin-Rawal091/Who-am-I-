import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { IDENTITY } from '../../data/identity'
import { usePrefersReducedMotion } from '../../lib/motion'

export default function SystemIntro() {
  const containerRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!containerRef.current) return
    const elements = containerRef.current.querySelectorAll('[data-reveal]')

    if (prefersReducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0 })
      return
    }

    gsap.set(elements, { opacity: 0, y: 16 })
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.15,
    })
  }, [prefersReducedMotion])

  return (
    <section
      id="hero"
      aria-label="System Introduction"
      className="relative flex min-h-[100svh] w-full flex-col justify-between px-6 py-16 md:px-12 lg:px-16"
    >
      {/* Floating Monospace Code Tag (Top Right - Lannino Style) */}
      <div
        aria-hidden="true"
        className="absolute top-12 right-12 hidden font-mono text-xs text-mist/35 md:block select-none"
      >
        import &#123; ML, LLM, Agents &#125; from &apos;@rawal/ai&apos;
      </div>

      {/* Protected Left-Side Content Zone (Split-Screen Composition) */}
      <div ref={containerRef} className="z-10 my-auto flex w-full max-w-xl flex-col items-start text-left lg:max-w-2xl xl:max-w-3xl pt-6">
        <div className="flex flex-col items-start gap-6 text-left">
          {/* Eyebrow System Pill with Pulsing Signal Indicator */}
          <div data-reveal className="inline-flex items-center gap-2.5 rounded-full border border-hairline/80 bg-graphite/80 px-4 py-1.5 font-mono text-xs tracking-wider text-mist backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal"></span>
            </span>
            <span className="text-foam/90 font-semibold">SYSTEM ONLINE</span>
            <span className="text-hairline">|</span>
            <span>RAWAL.AI v{IDENTITY.version}</span>
          </div>

          <div data-reveal className="flex flex-col items-start">
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-foam sm:text-6xl md:text-7xl lg:text-8xl">
              {IDENTITY.name}
            </h1>
            <p className="mt-3 font-mono text-base text-mist sm:text-lg lg:text-xl">
              AI & Machine Learning Engineer +{' '}
              <span className="text-gradient-shift font-bold">Vibecoder</span>
            </p>
          </div>

          <p data-reveal className="font-display text-xl font-medium leading-relaxed text-foam/90 sm:text-2xl lg:text-3xl max-w-xl">
            {IDENTITY.positioning}
          </p>

          <div data-reveal className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#about"
              className="rounded-md border border-hairline bg-graphite/90 px-6 py-3 font-mono text-sm text-foam transition-all duration-200 hover:border-signal hover:text-signal hover:scale-105 shadow-xl"
            >
              [ RUN MODEL / EXPLORE ]
            </a>
            <a
              href="#contact"
              className="rounded-md px-6 py-3 font-mono text-sm text-mist transition-all duration-200 hover:text-foam hover:scale-105"
            >
              [ DEPLOY / CONTACT ]
            </a>
          </div>
        </div>

        {/* Vertical Pipeline Laser Line (Lannino-Style) */}
        <div data-reveal className="mt-8 ml-6 flex flex-col items-start gap-2">
          <div className="h-16 w-px bg-gradient-to-b from-signal/70 via-signal/20 to-transparent"></div>
        </div>
      </div>

      {/* Bouncing Scroll Cue (Emilian-Style) */}
      <div className="z-10 flex w-full justify-center pb-4">
        <a
          href="#about"
          className="group flex flex-col items-center gap-2 font-mono text-xs tracking-widest text-mist/70 transition-colors hover:text-signal"
        >
          <span>RUN PIPELINE</span>
          <div className="scroll-mouse flex h-7 w-4 items-start justify-center rounded-full border border-mist/40 p-1 group-hover:border-signal">
            <div className="h-1.5 w-1 rounded-full bg-signal"></div>
          </div>
        </a>
      </div>
    </section>
  )
}
