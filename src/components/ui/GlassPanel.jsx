/**
 * High-craft glassmorphic panel container with multi-tier transparency levels.
 * Uses pointer-events: none on the panel frame so pointer drag events pass
 * through to the 3D canvas, while any nested interactive elements (buttons, links)
 * remain pointer-events: auto.
 */
export default function GlassPanel({
  children,
  variant = 'panel', // 'hero' | 'body' | 'telemetry' | 'panel'
  className = '',
  id,
  ...props
}) {
  const variantClass =
    variant === 'hero'
      ? 'glass-hero'
      : variant === 'body'
        ? 'glass-body'
        : variant === 'telemetry'
          ? 'glass-telemetry'
          : 'glass-panel'

  return (
    <div
      id={id}
      className={`${variantClass} pointer-events-none rounded-xl p-6 sm:p-8 transition-all duration-300 [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto [&_textarea]:pointer-events-auto [&_label]:pointer-events-auto [&_select]:pointer-events-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
