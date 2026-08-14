/**
 * Static, dependency-free stand-in for the 3D scene: same layered
 * node/edge structure, rendered flat. Used when WebGL isn't available or
 * the Canvas fails to mount, so the hero never shows a blank gap.
 */
export default function HeroFallback() {
  return (
    <svg
      viewBox="0 0 480 360"
      role="img"
      aria-labelledby="hero-fallback-title"
      className="h-full w-full"
    >
      <title id="hero-fallback-title">
        A layered network of connected modules, narrowing from many inputs to a few outputs
      </title>
      <g stroke="#3a4250" strokeWidth="1" fill="none" opacity="0.6">
        <path d="M40 60 L170 100 M40 60 L170 150 M40 140 L170 100 M40 140 L170 150" />
        <path d="M40 220 L170 210 M40 220 L170 260 M40 300 L170 260 M40 300 L170 310" />
        <path d="M170 100 L300 90 M170 100 L300 130 M170 150 L300 130 M170 150 L300 170" />
        <path d="M170 210 L300 210 M170 210 L300 250 M170 260 L300 250 M170 260 L300 290" />
        <path d="M300 90 L420 140 M300 130 L420 140 M300 130 L420 190 M300 170 L420 190" />
        <path d="M300 210 L420 190 M300 210 L420 240 M300 250 L420 240 M300 290 L420 240" />
      </g>
      {[
        [40, 60], [40, 140], [40, 220], [40, 300],
        [170, 100], [170, 150], [170, 210], [170, 260], [170, 310],
        [300, 90], [300, 130], [300, 170], [300, 210], [300, 250], [300, 290],
        [420, 140], [420, 190], [420, 240],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="#12161d" stroke="#3a4250" strokeWidth="1" />
      ))}
      {[[420, 140], [420, 190], [420, 240]].map(([x, y], i) => (
        <circle key={`signal-${i}`} cx={x} cy={y} r="4" fill="#f2914b" />
      ))}
    </svg>
  )
}
