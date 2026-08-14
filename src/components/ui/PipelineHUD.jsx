/**
 * PipelineHUD — floating cinematic overlay that shows pipeline execution
 * progress as the auto-scroll moves through each portfolio section.
 *
 * Appears at the top center of the viewport with a glowing progress bar,
 * stage label, and cancel button. Automatically hides when not running.
 */
export default function PipelineHUD({
  isRunning,
  stageNumber,
  stageLabel,
  currentStage,
  stageCount,
  onCancel,
}) {
  if (!isRunning) return null

  const progress = stageCount > 0 ? ((currentStage + 1) / stageCount) * 100 : 0

  return (
    <div
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-fadeIn"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-full border border-signal/40 bg-void/95 px-5 py-2.5 font-mono text-xs shadow-[0_0_30px_rgba(242,145,75,0.15)] backdrop-blur-xl">
        {/* Pulsing execution indicator */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
        </span>

        {/* Stage info */}
        <div className="flex items-center gap-2">
          <span className="text-mist">PIPELINE</span>
          <span className="font-semibold text-foam">
            STAGE {stageNumber}/{String(stageCount).padStart(2, '0')}
          </span>
          <span className="hidden text-signal sm:inline">
            {stageLabel}
          </span>
        </div>

        {/* Progress bar */}
        <div className="hidden w-20 overflow-hidden rounded-full bg-hairline/60 sm:block">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-signal to-signal/70 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          aria-label="Cancel pipeline execution"
          className="ml-1 rounded-full p-1 text-mist transition-colors duration-200 hover:bg-hairline/50 hover:text-foam"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
          </svg>
        </button>
      </div>

      {/* Subtle hint text */}
      <p className="mt-1.5 text-center font-mono text-[10px] text-mist/50">
        scroll or press ESC to cancel
      </p>
    </div>
  )
}
