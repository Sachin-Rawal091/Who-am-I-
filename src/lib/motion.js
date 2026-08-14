import { useEffect, useState } from 'react'

/**
 * Single source of truth for the easing curve used across GSAP timelines,
 * R3F camera tweens, and Framer Motion micro-interactions. Keeping one
 * constant here (mirrored in src/styles/index.css as --ease-signature)
 * is what stops each animation system from drifting onto its own feel.
 */
export const EASE_SIGNATURE = 'expo.out' // GSAP name for cubic-bezier(0.16, 1, 0.3, 1)
export const EASE_SIGNATURE_BEZIER = [0.16, 1, 0.3, 1] // same curve, for Framer Motion

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
}

/**
 * Tracks prefers-reduced-motion live (not just on mount), so a user who
 * toggles the OS setting mid-session gets an updated experience without
 * a reload. Every scroll-jacked / parallax / camera-travel sequence in
 * this app is gated behind this hook.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event) => setReduced(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return reduced
}

/**
 * Coarse device capability check used to decide between the full
 * computational-architecture scene and the simplified mobile version.
 * Deliberately conservative — a phone that also has a small viewport is
 * the case the brief calls out explicitly (simplified geometry, not a
 * squished desktop scene).
 */
export function useIsLowPowerDevice() {
  const [isLowPower, setIsLowPower] = useState(() => {
    if (typeof window === 'undefined') return false
    const narrow = window.matchMedia('(max-width: 768px)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const lowCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
    const lowMemory = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4
    return (narrow && coarsePointer) || (lowCores && lowMemory)
  })

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px) and (pointer: coarse)')
    const handleChange = (event) => {
      const lowCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
      const lowMemory = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4
      setIsLowPower(event.matches || (lowCores && lowMemory))
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return isLowPower
}
