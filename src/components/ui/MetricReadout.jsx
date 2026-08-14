/**
 * Terminal-style key-value metric readout list.
 */
export default function MetricReadout({ items = [], className = '' }) {
  return (
    <dl className={`font-mono text-xs ${className}`}>
      {items.map(({ label, value, highlight }) => (
        <div key={label} className="flex items-center justify-between border-b border-hairline py-2.5 first:pt-0 last:border-0 last:pb-0">
          <dt className="text-mist">{label}:</dt>
          <dd className={`font-semibold ${highlight ? 'text-signal' : 'text-foam'}`}>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
