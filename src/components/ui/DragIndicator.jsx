import { useState, useEffect } from 'react'

export default function DragIndicator({ dismissed = false }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (dismissed) {
      setVisible(false)
    }
  }, [dismissed])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed bottom-8 right-8 z-30 flex items-center gap-2 rounded-full border border-hairline bg-void/80 px-4 py-2 font-mono text-xs text-mist backdrop-blur-md transition-opacity duration-500 animate-pulse">
      <span className="text-signal">← DRAG TO EXPLORE 3D →</span>
    </div>
  )
}
