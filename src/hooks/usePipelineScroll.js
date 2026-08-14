import { useState, useRef, useEffect, useCallback } from 'react'
import { useLenis } from '../lib/LenisContext'

/**
 * Pipeline stages — each maps to a section ID and a display name
 * matching the ML pipeline narrative of the portfolio.
 */
const PIPELINE_STAGES = [
  { id: 'about',    label: 'DATA INGESTION',     stage: '01' },
  { id: 'skills',   label: 'FEATURE EXTRACTION', stage: '02' },
  { id: 'training', label: 'MODEL TRAINING',     stage: '03' },
  { id: 'projects', label: 'INFERENCE OUTPUT',   stage: '04' },
  { id: 'contact',  label: 'DEPLOYMENT',         stage: '05' },
]

const DWELL_MS = 2800  // time spent at each section before moving on
const SCROLL_DURATION = 1.4 // seconds for each Lenis scroll transition

/**
 * usePipelineScroll — orchestrates a staged auto-scroll journey through
 * every portfolio section, driven by the Lenis smooth-scroll instance.
 *
 * Returns:
 *  - isRunning: boolean — whether the pipeline is currently executing
 *  - currentStage: number — index into PIPELINE_STAGES (0-4), or -1
 *  - stageCount: number — total stages (5)
 *  - stageLabel: string — display name of current stage
 *  - stageNumber: string — e.g. "02"
 *  - start(): triggers the pipeline from stage 0
 *  - cancel(): aborts immediately
 */
export function usePipelineScroll() {
  const lenisRef = useLenis()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStageIdx, setCurrentStageIdx] = useState(-1)
  const cancelledRef = useRef(false)
  const timeoutIds = useRef([])

  // Clean up any pending timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(clearTimeout)
    }
  }, [])

  const cancel = useCallback(() => {
    cancelledRef.current = true
    timeoutIds.current.forEach(clearTimeout)
    timeoutIds.current = []
    setIsRunning(false)
    setCurrentStageIdx(-1)
  }, [])

  // Cancel on user scroll or Escape key while pipeline is running
  useEffect(() => {
    if (!isRunning) return

    let userScrolled = false

    const handleWheel = () => {
      if (!userScrolled) {
        userScrolled = true
        cancel()
      }
    }
    const handleTouch = () => {
      if (!userScrolled) {
        userScrolled = true
        cancel()
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') cancel()
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouch, { passive: true })
    window.addEventListener('keydown', handleKey)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('keydown', handleKey)
    }
  }, [isRunning, cancel])

  const start = useCallback(() => {
    const lenis = lenisRef?.current
    cancelledRef.current = false
    timeoutIds.current.forEach(clearTimeout)
    timeoutIds.current = []

    setIsRunning(true)
    setCurrentStageIdx(0)

    // Sequentially scroll to each stage with dwell time
    let cumulativeDelay = 0

    PIPELINE_STAGES.forEach((stage, idx) => {
      const scrollDelay = cumulativeDelay

      // Schedule the scroll to this section
      const scrollId = setTimeout(() => {
        if (cancelledRef.current) return
        setCurrentStageIdx(idx)

        const target = document.getElementById(stage.id)
        if (!target) return

        if (lenis) {
          lenis.scrollTo(target, {
            duration: SCROLL_DURATION,
            offset: -40, // slight top padding
          })
        } else {
          // Fallback: native smooth scroll if Lenis is not available
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, scrollDelay)
      timeoutIds.current.push(scrollId)

      // Add scroll transition time + dwell time for the next stage
      cumulativeDelay += (SCROLL_DURATION * 1000) + DWELL_MS
    })

    // After the last stage has dwelled, mark pipeline as complete
    const completeId = setTimeout(() => {
      if (cancelledRef.current) return
      setIsRunning(false)
      setCurrentStageIdx(-1)
    }, cumulativeDelay + 1000) // extra 1s buffer after final dwell
    timeoutIds.current.push(completeId)
  }, [lenisRef])

  const currentStage = PIPELINE_STAGES[currentStageIdx] || null

  return {
    isRunning,
    currentStage: currentStageIdx,
    stageCount: PIPELINE_STAGES.length,
    stageLabel: currentStage?.label || '',
    stageNumber: currentStage?.stage || '',
    start,
    cancel,
  }
}
