import GlassPanel from '../ui/GlassPanel'
import { MODEL_CARD } from '../../data/identity'

export default function ModelCard() {
  return (
    <section id="model-card" aria-label="Model Card Summary" className="relative z-10 px-6 py-24 md:px-12 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-center font-mono text-xs tracking-wide text-mist">$ cat model_card.json</p>
        <h2 className="mt-2 text-center font-display text-2xl text-foam sm:text-3xl">System Model Card</h2>

        <GlassPanel className="mt-8 border-signal/40">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div>
              <span className="font-mono text-xs text-mist">SYSTEM IDENTIFIER</span>
              <h3 className="font-display text-2xl text-signal">{MODEL_CARD.model_id}</h3>
            </div>
            <span className="rounded bg-signal/10 px-3 py-1 font-mono text-xs font-semibold text-signal">
              {MODEL_CARD.status}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 font-mono text-xs sm:grid-cols-2">
            <div className="rounded border border-hairline bg-void/60 p-3">
              <dt className="text-mist">ROLE</dt>
              <dd className="mt-1 font-semibold text-foam">{MODEL_CARD.role}</dd>
            </div>
            <div className="rounded border border-hairline bg-void/60 p-3">
              <dt className="text-mist">PRIMARY STACK</dt>
              <dd className="mt-1 font-semibold text-foam">{MODEL_CARD.primary_stack}</dd>
            </div>
            <div className="rounded border border-hairline bg-void/60 p-3">
              <dt className="text-mist">SPECIALIZATION</dt>
              <dd className="mt-1 font-semibold text-foam">{MODEL_CARD.specialization}</dd>
            </div>
            <div className="rounded border border-hairline bg-void/60 p-3">
              <dt className="text-mist">SHIPPED PROJECTS</dt>
              <dd className="mt-1 font-semibold text-foam">{MODEL_CARD.total_projects}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap items-center justify-between border-t border-hairline pt-4 font-mono text-xs text-mist">
            <span>accuracy: {MODEL_CARD.metrics.accuracy}</span>
            <span>latency: {MODEL_CARD.metrics.latency}</span>
            <span>uptime: {MODEL_CARD.metrics.uptime}</span>
          </div>
        </GlassPanel>
      </div>
    </section>
  )
}
