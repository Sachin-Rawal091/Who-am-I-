import { useState } from 'react'
import { motion } from 'framer-motion'
import ProjectVisual from './ProjectVisual'

function ProjectPipelineDiagram({ pipeline }) {
  return (
    <div className="mt-3.5 rounded-lg border border-hairline/80 bg-void/90 p-2.5 font-mono text-[11px]">
      <p className="mb-1.5 text-[10px] text-mist/80 uppercase tracking-wider">// Inference Pipeline</p>
      <div className="flex flex-wrap items-center gap-1.5 text-foam/90">
        {pipeline.map((step, idx) => (
          <span key={step} className="flex items-center gap-1.5 text-[10.5px]">
            <span className={idx === pipeline.length - 1 ? 'font-semibold text-signal' : ''}>
              {step}
            </span>
            {idx < pipeline.length - 1 && <span className="text-mist/60 text-[10px]">→</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectImageContainer({ project }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!project.image || imageError) {
    return <ProjectVisual variant={project.visual} />
  }

  return (
    <div className="group/preview relative aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/11] w-full overflow-hidden rounded-xl border border-hairline/80 bg-void/90 shadow-md">
      {/* Loading Skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-graphite/40">
          <span className="h-4 w-4 rounded-full border-2 border-signal border-t-transparent animate-spin" />
        </div>
      )}

      {/* Main Preview Image */}
      <img
        src={project.image}
        alt={project.imageAlt || project.title}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover/preview:scale-105 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />

      {/* Subtle Vignette & Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />

      {/* Interactive Badge on Top-Right */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full border border-hairline/90 bg-void/85 px-2 py-0.5 font-mono text-[9px] text-foam/90 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
        <span>{project.visual.toUpperCase()}</span>
      </div>

      {/* Project ID Pill on Bottom-Left */}
      <div className="absolute bottom-2 left-2 rounded border border-hairline/60 bg-void/70 px-1.5 py-0.5 font-mono text-[9px] text-mist backdrop-blur-sm">
        #{project.id}
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
        opacity: 0.45,
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
      className={`absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full max-w-2xl lg:max-w-3xl origin-center select-none ${
        isActive
          ? 'pointer-events-auto cursor-default'
          : 'pointer-events-auto cursor-pointer hover:opacity-75'
      }`}
    >
      <div
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 lg:p-6 backdrop-blur-xl transition-all duration-300 ${
          isActive
            ? 'border-signal/50 bg-graphite/95 shadow-[0_0_35px_rgba(242,145,75,0.14)]'
            : 'border-hairline/80 bg-void/90 shadow-lg'
        }`}
      >
        {/* Glowing top-edge subtle line for active card */}
        {isActive && (
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-signal to-transparent opacity-90" />
        )}

        <div className="grid gap-4 sm:grid-cols-[minmax(0,220px)_1fr] lg:grid-cols-[minmax(0,250px)_1fr] sm:items-center">
          <ProjectImageContainer project={project} />

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg sm:text-xl font-medium tracking-tight text-foam">
                  {project.title}
                </h3>
                {isActive && (
                  <span className="shrink-0 rounded-full border border-signal/40 bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal shadow-[0_0_10px_rgba(242,145,75,0.2)]">
                    Active
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-foam/85 font-sans">
                {project.description}
              </p>
            </div>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-hairline/90 bg-void/80 px-2 py-0.5 font-mono text-[10.5px] text-mist transition-colors hover:border-signal/40 hover:text-foam"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <ProjectPipelineDiagram pipeline={project.pipeline} />

            <div className="mt-3.5 flex items-center justify-between pt-1 border-t border-hairline/40">
              <div className="flex items-center gap-2">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isActive ? 0 : -1}
                  className="group/link inline-flex items-center gap-2 rounded-lg bg-signal/10 border border-signal/30 px-3 py-1.5 font-mono text-xs font-medium text-signal transition-all duration-200 hover:bg-signal hover:text-void hover:shadow-[0_0_15px_rgba(242,145,75,0.3)]"
                >
                  <span>{project.linkLabel}</span>
                  <span className="transition-transform duration-200 group-hover/link:translate-x-1" aria-hidden="true">→</span>
                </a>

                {project.github && project.github !== project.href && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isActive ? 0 : -1}
                    aria-label={`View ${project.title} source code on GitHub`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-hairline/80 bg-void/80 px-2.5 py-1.5 font-mono text-xs text-mist transition-all duration-200 hover:border-hairline hover:bg-graphite hover:text-foam"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>Code</span>
                  </a>
                )}
              </div>

              <span className="font-mono text-[10px] text-mist/60">
                // stage_04
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

