import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IDENTITY } from '../../data/identity'
import { usePrefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

export default function About({ onParticleBurst }) {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)

  const [scrollActiveCard, setScrollActiveCard] = useState(1)
  const [hoverCardId, setHoverCardId] = useState(null)
  const [clickOverrideCardId, setClickOverrideCardId] = useState(null)
  const [expandedCard, setExpandedCard] = useState(null)

  const eventCounter = useRef(0)
  const clickTimeoutRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const fireBurst = (cardKey) => {
    if (!onParticleBurst) return
    eventCounter.current += 1

    onParticleBurst({
      id: eventCounter.current,
      cardId: cardKey,
      timestamp: performance.now(),
    })
  }

  // Active card precedence: Click override > Hover preview > Scroll-driven
  const effectiveActiveCard = clickOverrideCardId ?? hoverCardId ?? scrollActiveCard

  const handleCardClick = (cardId, cardKey) => {
    setClickOverrideCardId(cardId)
    fireBurst(cardKey)

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    clickTimeoutRef.current = setTimeout(() => {
      setClickOverrideCardId(null)
    }, 1800)
  }

  const handleMouseEnter = (cardId, cardKey) => {
    setHoverCardId(cardId)
    // Hover is temporary visual preview only, unless click override is active
    if (clickOverrideCardId === null) {
      fireBurst(cardKey)
    }
  }

  const handleMouseLeave = () => {
    setHoverCardId(null)
  }

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return

    const c1 = card1Ref.current
    const c2 = card2Ref.current
    const c3 = card3Ref.current

    if (!c1 || !c2 || !c3) return

    // Set initial directional offsets
    gsap.set(c1, { x: -80, opacity: 0 })
    gsap.set(c2, { x: 80, opacity: 0 })
    gsap.set(c3, { y: 60, opacity: 0 })

    const ctx = gsap.context(() => {
      // Single Master Timeline on gridRef: [c1, c2] animated in 100% simultaneous lockstep array
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current || sectionRef.current,
          start: 'top 85%',
          end: 'bottom 45%',
          scrub: 0.6,
        },
      })

      // Frame-perfect simultaneous entrance for Card 01 (Left) and Card 02 (Right) at time 0
      tl.to([c1, c2], { x: 0, opacity: 1, ease: 'power2.out' }, 0)
        // Card 03 (Bottom) enters at position 0.5
        .to(c3, { y: 0, opacity: 1, ease: 'power2.out' }, 0.5)

      // Synchronize scrollActiveCard progress along master timeline
      ScrollTrigger.create({
        trigger: gridRef.current || sectionRef.current,
        start: 'top 85%',
        end: 'bottom 45%',
        onUpdate: (self) => {
          const p = self.progress
          if (p < 0.35) {
            setScrollActiveCard(1)
          } else if (p < 0.7) {
            setScrollActiveCard(2)
          } else {
            setScrollActiveCard(3)
          }
        },
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    }
  }, [prefersReducedMotion])

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="Data Ingestion Stage"
      className="relative z-10 min-h-screen w-full px-6 py-24 md:px-12 lg:px-16"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-10 lg:max-w-5xl">
        {/* Stage Header */}
        <div className="flex flex-col gap-3 text-left">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse"></span>
            <span>STAGE 01 // DATA INGESTION</span>
          </div>

          <h2 className="font-display text-4xl font-bold tracking-tight text-foam sm:text-5xl">
            Ingested Identity
          </h2>

          <p className="font-display text-lg text-mist sm:text-xl">
            Raw telemetry, academic weights, and engineering mission streaming into the pipeline.
          </p>
        </div>

        {/* Responsive Dual Ingestion Grid (Row 1: 2-Column Split, Row 2: Full Width) */}
        <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1: Identity & Vision (Row 1, Left Column - Enters from Left) */}
          <div
            ref={card1Ref}
            onClick={() => handleCardClick(1, 'IDENTITY')}
            onMouseEnter={() => handleMouseEnter(1, 'IDENTITY')}
            onMouseLeave={handleMouseLeave}
            className={`group relative flex cursor-pointer flex-col gap-4 rounded-xl border p-6 transition-[border-color,box-shadow,background-color] duration-300 backdrop-blur-md ${
              effectiveActiveCard === 1
                ? 'border-signal/90 bg-graphite/90 shadow-[0_0_25px_rgba(242,145,75,0.2)]'
                : 'border-hairline/70 bg-graphite/50 hover:border-hairline'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-signal font-semibold">01 // IDENTITY_STREAM</span>
              <span className="text-mist/70">FORMAT: UNSTRUCTURED_TEXT</span>
            </div>

            <h3 className="font-display text-2xl font-semibold text-foam">
              Engineering Mission
            </h3>

            <p className="font-display text-base leading-relaxed text-foam/90">
              Most of what I build starts with a dataset or a repetitive task I want gone. My engineering work bridges full-stack software and machine learning.
            </p>

            <div className="text-sm leading-relaxed text-mist flex flex-col gap-3">
              <p>
                From cleaning and analyzing Shark Tank investment datasets into interactive dashboards, to wiring Chrome extensions that automate repetitive form entry from spreadsheets.
              </p>
              <p>
                Lately, that extends into agentic tooling: building multi-user expense tracking MCP servers with natural-language intent parsers, deployed on Railway using Docker.
              </p>
            </div>

            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-hairline/40 font-mono text-xs text-signal/80">
              <span>● {effectiveActiveCard === 1 ? 'STREAM ACTIVE' : 'STREAM PROCESSED'}</span>
              <span className="text-mist/40">|</span>
              <span className="text-mist">FEEDING 3D FUNNEL NODES [0–15]</span>
            </div>
          </div>

          {/* Card 2: Academic Telemetry (Row 1, Right Column - Enters from Right) */}
          <div
            ref={card2Ref}
            onClick={() => handleCardClick(2, 'ACADEMIC')}
            onMouseEnter={() => handleMouseEnter(2, 'ACADEMIC')}
            onMouseLeave={handleMouseLeave}
            className={`group relative flex cursor-pointer flex-col gap-4 rounded-xl border p-6 transition-[border-color,box-shadow,background-color] duration-300 backdrop-blur-md ${
              effectiveActiveCard === 2
                ? 'border-data/90 bg-graphite/90 shadow-[0_0_25px_rgba(56,189,248,0.2)]'
                : 'border-hairline/70 bg-graphite/50 hover:border-hairline'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-data font-semibold">02 // ACADEMIC_TELEMETRY</span>
              <span className="text-mist/70">FORMAT: STRUCTURED_METRICS</span>
            </div>

            <h3 className="font-display text-2xl font-semibold text-foam">
              Education & Location
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1 rounded-lg border border-hairline/60 bg-void/50 p-3.5">
                <span className="font-mono text-xs text-mist">DEGREE</span>
                <span className="font-display font-medium text-foam">{IDENTITY.education}</span>
              </div>

              <div className="flex flex-col gap-1 rounded-lg border border-hairline/60 bg-void/50 p-3.5">
                <span className="font-mono text-xs text-mist">ACADEMIC SCORE</span>
                <span className="font-display font-medium text-data">8.5 CGPA</span>
              </div>

              <div className="flex flex-col gap-1 rounded-lg border border-hairline/60 bg-void/50 p-3.5">
                <span className="font-mono text-xs text-mist">LOCATION</span>
                <span className="font-display font-medium text-foam">{IDENTITY.location}</span>
              </div>

              <div className="flex flex-col gap-1 rounded-lg border border-hairline/60 bg-void/50 p-3.5">
                <span className="font-mono text-xs text-mist">AVAILABILITY</span>
                <span className="font-display font-medium text-foam">Internships & Roles</span>
              </div>
            </div>

            {/* Expandable Coursework Details */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpandedCard(expandedCard === 2 ? null : 2)
              }}
              className="mt-1 flex items-center justify-between rounded-lg border border-hairline/40 bg-graphite/40 px-4 py-2.5 font-mono text-xs text-mist transition-colors hover:text-foam hover:border-data/50"
            >
              <span>{expandedCard === 2 ? '[-] HIDE CORE COURSEWORK' : '[+] VIEW CORE COURSEWORK'}</span>
              <span>{expandedCard === 2 ? '▲' : '▼'}</span>
            </button>

            {expandedCard === 2 && (
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
                {['Data Structures & Algorithms', 'Machine Learning', 'Deep Learning', 'Database Systems', 'Software Engineering'].map((course, idx) => (
                  <span key={idx} className="rounded-md border border-hairline bg-void/80 px-3 py-1.5 text-foam">
                    {course}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-hairline/40 font-mono text-xs text-data/80">
              <span>● {effectiveActiveCard === 2 ? 'STREAM ACTIVE' : 'STREAM PROCESSED'}</span>
              <span className="text-mist/40">|</span>
              <span className="text-mist">FEEDING 3D FUNNEL NODES [16–31]</span>
            </div>
          </div>

          {/* Card 3: Verified Weights & Achievements (Row 2: Full-Width - Enters from Bottom) */}
          <div
            ref={card3Ref}
            onClick={() => handleCardClick(3, 'VERIFIED')}
            onMouseEnter={() => handleMouseEnter(3, 'VERIFIED')}
            onMouseLeave={handleMouseLeave}
            className={`group relative flex cursor-pointer flex-col gap-4 rounded-xl border p-6 transition-[border-color,box-shadow,background-color] duration-300 backdrop-blur-md md:col-span-2 ${
              effectiveActiveCard === 3
                ? 'border-training/90 bg-graphite/90 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                : 'border-hairline/70 bg-graphite/50 hover:border-hairline'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-training font-semibold">03 // VERIFIED_WEIGHTS</span>
              <span className="text-mist/70">FORMAT: CERTIFIED_CREDENTIALS</span>
            </div>

            <h3 className="font-display text-2xl font-semibold text-foam">
              Achievements & Certifications
            </h3>

            <div className="grid gap-3 sm:grid-cols-3 font-mono text-sm">
              <div className="flex items-start gap-3 rounded-lg border border-hairline/60 bg-void/50 p-3.5">
                <span className="font-mono text-xs font-bold text-training border border-training/30 rounded px-1.5 py-0.5 bg-training/10">[SIH]</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-foam">Smart India Hackathon</span>
                  <span className="text-xs text-mist">National AI / Software Hackathon Winner</span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-hairline/60 bg-void/50 p-3.5">
                <span className="font-mono text-xs font-bold text-training border border-training/30 rounded px-1.5 py-0.5 bg-training/10">[IDE]</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-foam">RYB × PGVF Ideathon</span>
                  <span className="text-xs text-mist">Top Innovation Finalist</span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-hairline/60 bg-void/50 p-3.5">
                <span className="font-mono text-xs font-bold text-training border border-training/30 rounded px-1.5 py-0.5 bg-training/10">[OCI]</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-foam">Oracle Cloud AI Associate</span>
                  <span className="text-xs text-mist">Certified Cloud AI Practitioner</span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-hairline/40 font-mono text-xs text-training/80">
              <span>● {effectiveActiveCard === 3 ? 'STREAM ACTIVE' : 'STREAM PROCESSED'}</span>
              <span className="text-mist/40">|</span>
              <span className="text-mist">FEEDING 3D FUNNEL NODES [32–47]</span>
            </div>
          </div>
        </div>

        {/* Stage Completion Checkpoint Bar */}
        <div className="mt-2 flex items-center justify-between rounded-lg border border-signal/40 bg-signal/10 px-6 py-4 font-mono text-xs text-signal backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal"></span>
            <span className="font-bold tracking-wider">DATA INGESTED ✓ — NEURAL GRAPH SYNCHRONIZED</span>
          </div>
          <span className="hidden sm:inline text-mist">PREPARING FEATURE EXTRACTION →</span>
        </div>
      </div>
    </section>
  )
}
