import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { MASTER_EDGES, getStagePositions, INGESTION_LAYERS } from './machineData'

const SIGNAL = '#f2914b'
const DATA_BLUE = '#38bdf8'
const VIOLET = '#a855f7'

const normalParticleGeo = new THREE.SphereGeometry(0.045, 8, 8)
const burstParticleGeo = new THREE.SphereGeometry(0.07, 8, 8)

function SinglePacket({ edgeIndex, speed, offset, stageProgress, animate, burstActive, burstColor }) {
  const ref = useRef(null)
  const [a, b] = MASTER_EDGES[edgeIndex] ?? []

  useFrame((state) => {
    if (!ref.current || a === undefined || b === undefined) return
    const positions = getStagePositions(stageProgress)
    const startVec = positions[a]
    const endVec = positions[b]

    if (!startVec || !endVec) return

    if (!animate) {
      ref.current.position.lerpVectors(startVec, endVec, offset)
      return
    }

    const currentSpeed = burstActive ? speed * 3.5 : stageProgress > 0.45 && stageProgress < 0.68 ? speed * 3.0 : speed
    const t = (state.clock.elapsedTime * currentSpeed + offset) % 1
    ref.current.position.lerpVectors(startVec, endVec, t)
    const fade = Math.sin(t * Math.PI)
    ref.current.material.opacity = burstActive ? 0.95 : 0.25 + fade * 0.75
  })

  let color = burstActive && burstColor ? burstColor : SIGNAL
  if (!burstActive) {
    if (stageProgress < 0.28) color = DATA_BLUE
    else if (stageProgress > 0.45 && stageProgress < 0.68) color = VIOLET
  }

  return (
    <mesh ref={ref} geometry={burstActive ? burstParticleGeo : normalParticleGeo}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={burstActive ? 4.0 : 2.5}
        transparent
        opacity={1}
      />
    </mesh>
  )
}

export default function DataParticles({ stageProgress = 0, animate = true, particleBurstEvent = null }) {
  const lastProcessedEventId = useRef(0)
  const burstProgress = useRef(1.0)
  const activeBurstKey = useRef(null)

  useEffect(() => {
    if (!particleBurstEvent) return
    if (particleBurstEvent.id <= lastProcessedEventId.current) return

    lastProcessedEventId.current = particleBurstEvent.id
    activeBurstKey.current = particleBurstEvent.cardId
    burstProgress.current = 0.0
  }, [particleBurstEvent])

  useFrame((_, delta) => {
    if (burstProgress.current < 1.0) {
      burstProgress.current += delta * 1.2
    }
  })

  const activeEdgeIndices = useMemo(() => {
    return Array.from({ length: Math.min(24, MASTER_EDGES.length) }, (_, i) => i * 2)
  }, [])

  const burstActive = burstProgress.current < 1.0
  const activeLayerConfig = activeBurstKey.current ? INGESTION_LAYERS[activeBurstKey.current] : null

  return (
    <group>
      {activeEdgeIndices.map((edgeIdx, i) => (
        <SinglePacket
          key={edgeIdx}
          edgeIndex={edgeIdx}
          speed={0.25 + (i % 4) * 0.06}
          offset={(i * 0.15) % 1}
          stageProgress={stageProgress}
          animate={animate}
          burstActive={burstActive}
          burstColor={activeLayerConfig?.color}
        />
      ))}
    </group>
  )
}
