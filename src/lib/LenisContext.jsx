import { createContext, useContext } from 'react'

/**
 * Shares the Lenis smooth-scroll instance with any descendant that
 * needs programmatic scroll control (e.g. the Pipeline auto-scroll).
 */
export const LenisContext = createContext(null)

export function useLenis() {
  return useContext(LenisContext)
}
