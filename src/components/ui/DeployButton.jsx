import { useRef } from 'react'

/**
 * Deployment CTA Button.
 * Triggers a quick deployment pulse through the 3D pipeline before opening the link.
 */
export default function DeployButton({ href, children, onPulse, className = '', download = false, target }) {
  const isNavigating = useRef(false)

  const handleClick = (e) => {
    if (onPulse && !isNavigating.current) {
      e.preventDefault()
      isNavigating.current = true
      onPulse()
      setTimeout(() => {
        if (download) {
          const a = document.createElement('a')
          a.href = href
          a.download = ''
          a.click()
        } else if (target === '_blank') {
          window.open(href, '_blank', 'noopener,noreferrer')
        } else {
          window.location.href = href
        }
        isNavigating.current = false
      }, 400)
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      download={download ? '' : undefined}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center justify-center rounded-md border border-hairline bg-graphite px-5 py-3 font-mono text-sm text-foam transition-all duration-200 hover:border-signal hover:text-signal hover:shadow-[0_0_15px_rgba(242,145,75,0.25)] ${className}`}
    >
      {children}
    </a>
  )
}
