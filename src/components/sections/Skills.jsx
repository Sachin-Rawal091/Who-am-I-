import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FEATURE_LAYERS } from '../../data/featureLayers'
import { SKILL_NODE_MAP } from '../../data/skillNodeMap'
import { usePrefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_MATRIX = {
  opacity: 0.12,
  blur: 2,
}

export default function Skills({ onParticleBurst }) {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [activeLayerKey, setActiveLayerKey] = useState('CORE')

  // Neural Matrix Controls State
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX)
  const [matrixMode, setMatrixMode] = useState('AUTO') // 'AUTO' | 'MANUAL'
  const [isControlsOpen, setIsControlsOpen] = useState(false)
  const [isAdjusting, setIsAdjusting] = useState(false)

  const eventCounter = useRef(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  const fireSkillBurst = (skillName, layerKey) => {
    if (!onParticleBurst) return
    const skillData = SKILL_NODE_MAP[skillName]
    eventCounter.current += 1

    onParticleBurst({
      id: eventCounter.current,
      cardId: layerKey || skillData?.layer || 'CORE',
      nodes: skillData?.nodes || [0, 1, 2, 3],
      color: skillData?.color || '#f2914b',
      timestamp: performance.now(),
    })
  }

  const handleCardMouseEnter = (layerKey) => {
    setActiveLayerKey(layerKey)
  }

  const handleSkillHover = (e, skillName, layerKey) => {
    e.stopPropagation()
    setHoveredSkill(skillName)
    setActiveLayerKey(layerKey)
    fireSkillBurst(skillName, layerKey)
  }

  const handleSkillLeave = (e) => {
    e.stopPropagation()
    setHoveredSkill(null)
  }

  const handleSkillClick = (e, skillName, layerKey) => {
    e.stopPropagation()
    setSelectedSkill(selectedSkill === skillName ? null : skillName)
    setActiveLayerKey(layerKey)
    fireSkillBurst(skillName, layerKey)
  }

  const resetMatrix = () => {
    setMatrix(DEFAULT_MATRIX)
    setMatrixMode('AUTO')
  }

  // Calculate dynamic Auto values based on interaction state
  const getAutoValues = () => {
    if (selectedSkill) return { opacity: 0.24, blur: 6 } // Architecture Drawer Expanded
    if (hoveredSkill) return { opacity: 0.16, blur: 3 }  // Skill Hovered
    if (activeLayerKey) return { opacity: 0.14, blur: 2.5 }
    return DEFAULT_MATRIX
  }

  const autoVal = getAutoValues()
  const effectiveOpacity = matrixMode === 'AUTO' ? autoVal.opacity : matrix.opacity
  const effectiveBlur = matrixMode === 'AUTO' ? autoVal.blur : matrix.blur

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined

    let ctx = null
    const timer = requestAnimationFrame(() => {
      if (!sectionRef.current) return
      const cards = sectionRef.current.querySelectorAll('.skill-layer-card')
      if (cards.length < 4) return

      const c1 = cards[0] // Layer 01 (Left)
      const c2 = cards[1] // Layer 02 (Right)
      const c3 = cards[2] // Layer 03 (Left)
      const c4 = cards[3] // Layer 04 (Right)

      // Set initial directional offsets for Left & Right slide entrance
      gsap.set([c1, c3], { x: -90, opacity: 0 })
      gsap.set([c2, c4], { x: 90, opacity: 0 })

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.8,
          },
        })

        // Step 1: Row 1 (c1 Left & c2 Right) enters at position 0
        tl.to([c1, c2], { x: 0, opacity: 1, ease: 'power2.out' }, 0)
          // Step 2: Row 2 (c3 Left & c4 Right) enters at position 0.35
          .to([c3, c4], { x: 0, opacity: 1, ease: 'power2.out' }, 0.35)
      }, sectionRef)
    })

    return () => {
      cancelAnimationFrame(timer)
      if (ctx) ctx.revert()
    }
  }, [prefersReducedMotion])

  const activeSkillData = hoveredSkill ? SKILL_NODE_MAP[hoveredSkill] : null
  const selectedSkillData = selectedSkill ? SKILL_NODE_MAP[selectedSkill] : null

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Feature Extraction — Skills & Architecture"
      className="relative z-10 min-h-screen w-full px-6 py-24 md:px-12 lg:px-16"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {/* Stage Header & Real-time Telemetry Panel */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-data">
                <span className="h-1.5 w-1.5 rounded-full bg-data animate-pulse"></span>
                <span>STAGE 02 // FEATURE EXTRACTION</span>
              </div>

              {/* Compact Neural Matrix Controls Trigger Button */}
              <button
                onClick={() => setIsControlsOpen(!isControlsOpen)}
                aria-label="Toggle Neural Matrix Controls"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline/60 bg-graphite/40 px-3 py-1 font-mono text-xs text-mist hover:text-foam hover:border-signal/60 transition-all backdrop-blur-md"
              >
                <span>⚙ MATRIX CONTROLS</span>
                <span className="text-[10px] text-signal font-bold">[{matrixMode}]</span>
              </button>
            </div>

            <h2 className="font-display text-4xl font-bold tracking-tight text-foam sm:text-5xl">
              Skills &amp; Architecture
            </h2>

            <p className="font-display text-lg text-mist sm:text-xl max-w-xl">
              Mapping core engineering capabilities into structured neural layer clusters.
            </p>
          </div>

          {/* Ultra-Transparent Telemetry Panel */}
          <div className="w-full md:w-80 h-[160px] max-h-[160px] shrink-0 rounded-xl border border-hairline/40 bg-graphite/10 p-4 font-mono text-xs backdrop-blur-[2px] shadow-lg overflow-hidden flex flex-col justify-between transition-[border-color,box-shadow,background-color] duration-200">
            <div className="flex items-center justify-between border-b border-hairline/30 pb-2 text-mist">
              <span className="text-signal font-semibold">⚡ FEATURE ACTIVATION</span>
              <span>3D CLUSTER MAP</span>
            </div>

            {activeSkillData ? (
              <div className="flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-mist">FEATURE:</span>
                  <span className="font-semibold text-foam">{hoveredSkill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">LAYER:</span>
                  <span style={{ color: activeSkillData.color }} className="font-semibold truncate max-w-[170px]">
                    {FEATURE_LAYERS[activeSkillData.layer]?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">NODE LOAD:</span>
                  <span className="text-foam">{activeSkillData.load}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">CONNECTIONS:</span>
                  <span className="text-signal">{activeSkillData.connections} ACTIVE</span>
                </div>
                <div className="rounded bg-void/40 p-1 text-[10px] text-mist/90 border border-hairline/20 truncate">
                  <span className="text-foam font-semibold">TRACE: </span>
                  {activeSkillData.pipeline.join(' → ')}
                </div>
              </div>
            ) : (
              <div className="my-auto flex flex-col items-center justify-center py-2 text-mist/60 text-center">
                <span>[ HOVER ANY SKILL PILL ]</span>
                <span className="mt-1 text-[10px]">To pulse 3D neural cluster</span>
              </div>
            )}
          </div>
        </div>

        {/* Neural Matrix Controls System Popover / Drawer */}
        {isControlsOpen && (
          <div className="rounded-xl border border-signal/60 bg-graphite/90 p-5 font-mono text-xs backdrop-blur-lg shadow-2xl transition-all animate-fadeIn">
            <div className="flex items-center justify-between border-b border-hairline/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse"></span>
                <span className="font-bold text-foam tracking-wider">NEURAL MATRIX CONTROL // 02</span>
              </div>
              <button
                onClick={() => setIsControlsOpen(false)}
                className="text-mist hover:text-foam text-[11px]"
              >
                [✕ CLOSE]
              </button>
            </div>

            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              {/* Opacity Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-mist">
                  <span>TRANSPARENCY:</span>
                  <span className="text-foam font-bold">{Math.round(effectiveOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.05"
                  disabled={matrixMode === 'AUTO'}
                  value={effectiveOpacity}
                  onMouseDown={() => setIsAdjusting(true)}
                  onMouseUp={() => setIsAdjusting(false)}
                  onChange={(e) => {
                    setMatrixMode('MANUAL')
                    setMatrix((prev) => ({ ...prev, opacity: parseFloat(e.target.value) }))
                  }}
                  aria-label="Neural matrix opacity"
                  className="accent-signal cursor-pointer disabled:opacity-40"
                />
                <div className="flex justify-between text-[10px] text-mist/60">
                  <span>05% (CLEAR)</span>
                  <span>50% (DARK)</span>
                </div>
              </div>

              {/* Blur Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-mist">
                  <span>BACKDROP BLUR:</span>
                  <span className="text-foam font-bold">{Math.round(effectiveBlur)}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  disabled={matrixMode === 'AUTO'}
                  value={effectiveBlur}
                  onMouseDown={() => setIsAdjusting(true)}
                  onMouseUp={() => setIsAdjusting(false)}
                  onChange={(e) => {
                    setMatrixMode('MANUAL')
                    setMatrix((prev) => ({ ...prev, blur: parseInt(e.target.value, 10) }))
                  }}
                  aria-label="Neural matrix blur"
                  className="accent-signal cursor-pointer disabled:opacity-40"
                />
                <div className="flex justify-between text-[10px] text-mist/60">
                  <span>0px (SHARP)</span>
                  <span>12px (BLURRED)</span>
                </div>
              </div>

              {/* Mode Toggle & Reset */}
              <div className="flex flex-col justify-between gap-3 border-t sm:border-t-0 sm:border-l border-hairline/30 pt-3 sm:pt-0 sm:pl-5">
                <div>
                  <span className="text-mist text-[10px]">CONTROL MODE:</span>
                  <div className="mt-1 flex gap-2">
                    <button
                      onClick={() => setMatrixMode('AUTO')}
                      className={`flex-1 rounded border px-2 py-1 text-center transition-all ${
                        matrixMode === 'AUTO'
                          ? 'border-signal bg-signal/20 text-foam font-bold'
                          : 'border-hairline/40 text-mist/70 hover:text-foam'
                      }`}
                    >
                      ● AUTO
                    </button>
                    <button
                      onClick={() => setMatrixMode('MANUAL')}
                      className={`flex-1 rounded border px-2 py-1 text-center transition-all ${
                        matrixMode === 'MANUAL'
                          ? 'border-signal bg-signal/20 text-foam font-bold'
                          : 'border-hairline/40 text-mist/70 hover:text-foam'
                      }`}
                    >
                      MANUAL
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-mist/70">
                    STATUS: {isAdjusting ? <span className="text-signal">LIVE ● ADJUSTING</span> : <span className="text-emerald-400">● MATRIX STABLE</span>}
                  </span>
                  <button
                    onClick={resetMatrix}
                    className="text-data hover:underline"
                  >
                    [ RESET MATRIX ]
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Architecture Layer Cards Grid (Dynamic Opacity & Blur) */}
        <div className="grid gap-6 md:grid-cols-2 overflow-hidden p-1">
          {Object.entries(FEATURE_LAYERS).map(([key, layer], idx) => (
            <div
              key={key}
              ref={(el) => (cardsRef.current[idx] = el)}
              onMouseEnter={() => handleCardMouseEnter(key)}
              className={`skill-layer-card group relative flex flex-col justify-between rounded-xl border p-6 cursor-pointer transition-[border-color,box-shadow,background-color,backdrop-filter] duration-300 ${
                activeLayerKey === key
                  ? 'shadow-2xl'
                  : ''
              }`}
              style={{
                backgroundColor:
                  activeLayerKey === key
                    ? `rgba(35, 43, 56, ${Math.min(0.35, effectiveOpacity + 0.06)})`
                    : `rgba(35, 43, 56, ${effectiveOpacity})`,
                backdropFilter: `blur(${effectiveBlur}px)`,
                borderColor: activeLayerKey === key ? `${layer.color}dd` : 'rgba(255,255,255,0.06)',
                boxShadow: activeLayerKey === key ? `0 0 35px ${layer.color}35` : 'none',
              }}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span style={{ color: layer.color }} className="font-semibold">
                    LAYER 0{idx + 1} // {key}
                  </span>
                  <span className="text-mist/60">NODES [{layer.nodes[0]}–{layer.nodes[layer.nodes.length - 1]}]</span>
                </div>

                <h3 className="mt-2 font-display text-2xl font-semibold text-foam">
                  {layer.label}
                </h3>
                <p className="mt-1 font-mono text-xs text-mist">{layer.hint}</p>

                {/* Skill Pills */}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {layer.skills.map((skill) => {
                    const isHovered = hoveredSkill === skill
                    const isSelected = selectedSkill === skill
                    return (
                      <button
                        key={skill}
                        onClick={(e) => handleSkillClick(e, skill, key)}
                        onMouseEnter={(e) => handleSkillHover(e, skill, key)}
                        onMouseLeave={handleSkillLeave}
                        className={`h-9 rounded-lg border px-3.5 py-2 font-mono text-xs font-normal inline-flex items-center justify-center transition-[border-color,box-shadow,background-color,color] duration-150 backdrop-blur-[2px] ${
                          isSelected
                            ? 'bg-foam text-void font-semibold shadow-md'
                            : isHovered
                            ? 'bg-graphite/80 text-foam'
                            : 'bg-void/25 text-foam/90 hover:text-foam border-hairline/40 hover:border-hairline'
                        }`}
                        style={{
                          borderColor: isSelected
                            ? layer.color
                            : isHovered
                            ? layer.color
                            : undefined,
                          boxShadow: isHovered ? `0 0 15px ${layer.color}60` : undefined,
                        }}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-3 border-t border-hairline/30 font-mono text-xs text-mist">
                <span className="text-[11px]">
                  ● {activeLayerKey === key ? 'CLUSTER HIGHLIGHTED' : 'CLUSTER READY'}
                </span>
                <span className="text-[10px] text-mist/60">CLICK TO VIEW ARCHITECTURE →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Skill Architecture Modal / Drawer */}
        {selectedSkill && selectedSkillData && (
          <div className="rounded-xl border border-signal/60 bg-graphite/80 p-6 backdrop-blur-md shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between border-b border-hairline/40 pb-3">
              <div className="flex items-center gap-3">
                <span style={{ color: selectedSkillData.color }} className="font-mono text-sm font-bold">
                  [{selectedSkillData.layer} // {selectedSkill}]
                </span>
                <span className="font-display text-lg font-semibold text-foam">
                  Technology Architecture Pipeline
                </span>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="font-mono text-xs text-mist hover:text-foam"
              >
                [✕ CLOSE ARCHITECTURE]
              </button>
            </div>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-mist">EXECUTION FLOW TRACE:</span>
                <div className="flex flex-col gap-2 font-mono text-xs">
                  {selectedSkillData.arch.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md border border-hairline/50 bg-void/50 px-3 py-2 text-foam">
                      <span style={{ color: selectedSkillData.color }} className="font-bold">0{i + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-lg border border-hairline/40 bg-void/30 p-4 font-mono text-xs">
                <div>
                  <span className="text-mist">CLUSTER METRICS:</span>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-foam">
                    <div>
                      <span className="text-mist/70">3D NODES: </span>
                      <span>[{selectedSkillData.nodes.join(', ')}]</span>
                    </div>
                    <div>
                      <span className="text-mist/70">NODE LOAD: </span>
                      <span className="text-signal">{selectedSkillData.load}</span>
                    </div>
                    <div>
                      <span className="text-mist/70">CONNECTIONS: </span>
                      <span className="text-data">{selectedSkillData.connections}</span>
                    </div>
                    <div>
                      <span className="text-mist/70">STATUS: </span>
                      <span className="text-emerald-400">OPTIMIZED</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-hairline/30 text-mist/80 text-[11px]">
                  Click any other skill pill to compare neural architecture pipelines.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage Completion Checkpoint Bar */}
        <div className="mt-2 flex items-center justify-between rounded-lg border border-data/40 bg-data/10 px-6 py-4 font-mono text-xs text-data backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-data"></span>
            <span className="font-bold tracking-wider">FEATURE EXTRACTION COMPLETE ✓ — NEURAL CLUSTERS MAPPED</span>
          </div>
          <span className="hidden sm:inline text-mist">PREPARING MODEL TRAINING →</span>
        </div>
      </div>
    </section>
  )
}
