const STROKE = '#5b6674'
const SIGNAL = '#f2914b'

/** Investment/trend bars — for the Shark Tank analysis dashboard. */
function BarsMotif() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      {[18, 40, 62, 84, 106].map((x, i) => (
        <rect
          key={x}
          x={x - 6}
          y={80 - [30, 52, 38, 66, 44][i]}
          width="12"
          height={[30, 52, 38, 66, 44][i]}
          fill={i === 3 ? SIGNAL : '#232b38'}
          stroke={STROKE}
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

/** Genre/distribution donut — for the Netflix EDA project. */
function DonutMotif() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <circle cx="60" cy="40" r="26" fill="none" stroke="#232b38" strokeWidth="10" />
      <circle
        cx="60"
        cy="40"
        r="26"
        fill="none"
        stroke={SIGNAL}
        strokeWidth="10"
        strokeDasharray="55 108"
        strokeLinecap="round"
        transform="rotate(-90 60 40)"
      />
      <circle
        cx="60"
        cy="40"
        r="26"
        fill="none"
        stroke={STROKE}
        strokeWidth="10"
        strokeDasharray="30 133"
        strokeDashoffset="-55"
        transform="rotate(-90 60 40)"
      />
    </svg>
  )
}

/** Browser + form rows — for the FormAnchor extension. */
function FormMotif() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <rect x="14" y="12" width="92" height="56" rx="4" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <line x1="14" y1="24" x2="106" y2="24" stroke={STROKE} strokeWidth="1" />
      <circle cx="21" cy="18" r="2" fill={STROKE} />
      {[34, 44, 54].map((y, i) => (
        <rect
          key={y}
          x="24"
          y={y}
          width={i === 1 ? 44 : 60}
          height="6"
          rx="1.5"
          fill={i === 1 ? SIGNAL : '#232b38'}
          stroke={STROKE}
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

/** Small node graph — for the MCP expense-tracker server, echoing the hero motif. */
function NodesMotif() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <g stroke={STROKE} strokeWidth="1">
        <line x1="24" y1="24" x2="60" y2="40" />
        <line x1="24" y1="56" x2="60" y2="40" />
        <line x1="60" y1="40" x2="96" y2="24" />
        <line x1="60" y1="40" x2="96" y2="56" />
      </g>
      {[[24, 24], [24, 56], [96, 24]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#232b38" stroke={STROKE} strokeWidth="1" />
      ))}
      <circle cx="60" cy="40" r="6" fill="#232b38" stroke={STROKE} strokeWidth="1" />
      <circle cx="96" cy="56" r="5" fill={SIGNAL} />
    </svg>
  )
}

const MOTIFS = { bars: BarsMotif, donut: DonutMotif, form: FormMotif, nodes: NodesMotif }

/**
 * Deliberately abstract, not a fake screenshot — none of these projects
 * had a supplied image, and the brief is explicit about never fabricating
 * assets. This is honest visual variety instead.
 */
export default function ProjectVisual({ variant }) {
  const Motif = MOTIFS[variant] ?? NodesMotif
  return (
    <div className="flex aspect-[3/2] w-full items-center justify-center rounded-md border border-hairline bg-void p-6">
      <Motif />
    </div>
  )
}
