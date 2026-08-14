import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlassPanel from '../ui/GlassPanel'
import MetricReadout from '../ui/MetricReadout'
import { TRAINING_RUN, TRAINING_METADATA } from '../../data/trainingRun'
import { usePrefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

export default function Training() {
  const sectionRef = useRef(null)
  const svgRef = useRef(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  const currentData = TRAINING_RUN[currentIdx] ?? TRAINING_RUN[TRAINING_RUN.length - 1]

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return undefined

    let lastIdx = -1

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: (self) => {
        const index = Math.min(
          TRAINING_RUN.length - 1,
          Math.floor(self.progress * TRAINING_RUN.length)
        )
        if (index !== lastIdx) {
          lastIdx = index
          setCurrentIdx(index)
        }
      },
    })

    return () => st.kill()
  }, [prefersReducedMotion])

  // D3 Loss Curve Drawing
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 360
    const height = 180
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }

    const visibleData = TRAINING_RUN.slice(0, currentIdx + 1)

    const x = d3
      .scaleLinear()
      .domain([1, 50])
      .range([margin.left, width - margin.right])

    const y = d3
      .scaleLinear()
      .domain([0, 1.0])
      .range([height - margin.bottom, margin.top])

    const line = d3
      .line()
      .x((d) => x(d.epoch))
      .y((d) => y(d.loss))
      .curve(d3.curveMonotoneX)

    // Grid lines
    svg
      .append('g')
      .attr('stroke', '#232a35')
      .attr('stroke-opacity', 0.5)
      .call((g) =>
        g
          .append('g')
          .selectAll('line')
          .data(y.ticks(4))
          .join('line')
          .attr('y1', (d) => y(d))
          .attr('y2', (d) => y(d))
          .attr('x1', margin.left)
          .attr('x2', width - margin.right)
      )

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .attr('color', '#8a93a3')
      .call(d3.axisBottom(x).ticks(5))

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .attr('color', '#8a93a3')
      .call(d3.axisLeft(y).ticks(4))

    // Path
    svg
      .append('path')
      .datum(visibleData)
      .attr('fill', 'none')
      .attr('stroke', '#f2914b')
      .attr('stroke-width', 2.5)
      .attr('d', line)

    // Current point pulse
    if (visibleData.length > 0) {
      const last = visibleData[visibleData.length - 1]
      svg
        .append('circle')
        .attr('cx', x(last.epoch))
        .attr('cy', y(last.loss))
        .attr('r', 5)
        .attr('fill', '#f2914b')

      svg
        .append('circle')
        .attr('cx', x(last.epoch))
        .attr('cy', y(last.loss))
        .attr('r', 9)
        .attr('fill', 'none')
        .attr('stroke', '#f2914b')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.6)
    }
  }, [currentIdx])

  const telemetry = [
    { label: 'Model Architecture', value: TRAINING_METADATA.model_type },
    { label: 'Dataset', value: TRAINING_METADATA.dataset },
    { label: 'Epoch', value: `${currentData.epoch} / 50` },
    { label: 'Loss', value: currentData.loss.toFixed(3), highlight: true },
    { label: 'Accuracy', value: `${currentData.accuracy}%`, highlight: true },
    { label: 'Learning Rate', value: currentData.lr.toString() },
    { label: 'Status', value: currentIdx >= 13 ? 'CONVERGED ✓' : '● TRAINING IN PROGRESS' },
  ]

  return (
    <section
      ref={sectionRef}
      id="training"
      aria-label="Model Training — Telemetry"
      className="relative z-10 px-6 py-24 md:px-12 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs tracking-wide text-mist">$ stage 03: model_training</p>
        <h2 className="mt-2 font-display text-2xl text-foam sm:text-3xl">
          Training Telemetry &amp; Loss Convergence
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Left panel: Loss Curve SVG */}
          <GlassPanel className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="font-mono text-sm text-foam">Loss Curve (Scroll-Driven)</h3>
              <span className="font-mono text-xs text-signal">
                {currentIdx >= 13 ? 'MODEL TRAINED ✓' : `Epoch ${currentData.epoch}`}
              </span>
            </div>
            <div className="flex justify-center py-2">
              <svg ref={svgRef} width="360" height="180" className="w-full max-w-[360px]" />
            </div>
          </GlassPanel>

          {/* Right panel: Metrics Readout */}
          <GlassPanel className="flex flex-col gap-4">
            <div className="border-b border-hairline pb-3">
              <h3 className="font-mono text-sm text-foam">// Training Telemetry</h3>
            </div>
            <MetricReadout items={telemetry} />
          </GlassPanel>
        </div>
      </div>
    </section>
  )
}
