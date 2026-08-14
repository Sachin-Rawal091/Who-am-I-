import { motion } from 'framer-motion'
import ProjectVisual from './ProjectVisual'

function ProjectPipelineDiagram({ pipeline }) {
  return (
    <div className="mt-4 rounded border border-hairline bg-void/90 p-3 font-mono text-[11px]">
      <p className="mb-2 text-mist">// Inference Pipeline</p>
      <div className="flex flex-wrap items-center gap-1.5 text-foam">
        {pipeline.map((step, idx) => (
          <span key={step} className="flex items-center gap-1.5">
            <span className={idx === pipeline.length - 1 ? 'font-semibold text-signal' : ''}>
              {step}
            </span>
            {idx < pipeline.length - 1 && <span className="text-mist">→</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ProjectCard3D({ project, offset, isActive, onClick }) {
  // Calculate dynamic 3D transforms based on offset from active index
  const isLeft = offset < 0
  const absOffset = Math.abs(offset)

  // Motion variants configuration
  const getTransforms = () => {
    if (absOffset === 0) {
      return {
        x: '0%',
        scale: 1,
        rotateY: 0,
        z: 0,
        opacity: 1,
        zIndex: 30,
      }
    }
    if (absOffset === 1) {
      return {
        x: isLeft ? '-62%' : '62%',
        scale: 0.84,
        rotateY: isLeft ? 18 : -18,
        z: -120,
        opacity: 0.5,
        zIndex: 20,
      }
    }
    return {
      x: isLeft ? '-120%' : '120%',
      scale: 0.7,
      rotateY: isLeft ? 30 : -30,
      z: -250,
      opacity: 0,
      zIndex: 10,
    }
  }

  const transforms = getTransforms()

  return (
    <motion.div
      initial={false}
      animate={{
        x: transforms.x,
        scale: transforms.scale,
        rotateY: transforms.rotateY,
        opacity: transforms.opacity,
        zIndex: transforms.zIndex,
      }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={!isActive ? onClick : undefined}
      style={{
        transformStyle: 'preserve-3d',
      }}
      className={`absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full max-w-2xl origin-center select-none ${
        isActive
          ? 'pointer-events-auto cursor-default'
          : 'pointer-events-auto cursor-pointer hover:opacity-75'
      }`}
    >
      <div
        className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 lg:p-7 backdrop-blur-xl transition-colors duration-300 ${
          isActive
            ? 'border-signal/50 bg-graphite/95 shadow-[0_0_35px_rgba(242,145,75,0.12)]'
            : 'border-hairline/80 bg-void/90 shadow-lg'
        }`}
      >
        {/* Glowing top-edge subtle line for active card */}
        {isActive && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-signal to-transparent opacity-80" />
        )}

        <div className="grid gap-5 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-center">
          <ProjectVisual variant={project.visual} />

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-medium tracking-tight text-foam">
                  {project.title}
                </h3>
                {isActive && (
                  <span className="shrink-0 rounded border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
                    Active
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-foam/80">{project.description}</p>
            </div>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((tag) => (
                <li
                  key={tag}
                  className="rounded border border-hairline/90 bg-void/80 px-2 py-0.5 font-mono text-[11px] text-mist"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <ProjectPipelineDiagram pipeline={project.pipeline} />

            <div className="mt-4 flex items-center justify-between pt-1">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isActive ? 0 : -1}
                className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-signal underline decoration-signal/40 underline-offset-4 transition-all duration-200 hover:decoration-signal hover:text-signal/90"
              >
                {project.linkLabel} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
