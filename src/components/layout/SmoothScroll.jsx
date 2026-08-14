import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Owns smooth-scroll behavior (Lenis) and keeps it in sync with GSAP's
 * ScrollTrigger, which owns all scroll-driven choreography. This is the
 * only place either library's scroll wiring is set up — components
 * below should never instantiate their own Lenis/ScrollTrigger scroll
 * listener, only register ScrollTrigger animations against elements.
 *
 * Under prefers-reduced-motion, Lenis is skipped entirely and the page
 * falls back to native scroll; ScrollTrigger-driven sequences check the
 * same flag themselves before running (see ComputationalMachine.jsx).
 */
export default function SmoothScroll({ children }) {
  const rafId = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      // Native scroll only — still let ScrollTrigger measure the page
      // for the (fade-only) reveals other sections use.
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic-out, matches --ease-signature's decisiveness
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    function raf(time) {
      lenis.raf(time)
      rafId.current = requestAnimationFrame(raf)
    }
    rafId.current = requestAnimationFrame(raf)

    // Let GSAP drive scroll position for ScrollTrigger's own methods
    // (e.g. programmatic scrollTo), so the two never fight.
    gsap.ticker.lagSmoothing(0)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  return children
}
