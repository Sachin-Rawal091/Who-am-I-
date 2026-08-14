import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MASTER_NODES, MASTER_EDGES, getStagePositions } from './machineData'

const HAIRLINE = '#4a5568'
const SIGNAL = '#f2914b'
const VIOLET = '#a855f7'

export default function NeuralConnections({ stageProgress = 0, assemblyProgress = 1.0 }) {
  const lineRef = useRef(null)
  const materialRef = useRef(null)

  const { geometry, positionsArray } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(MASTER_EDGES.length * 2 * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geometry: geo, positionsArray: pos }
  }, [])

  useFrame(() => {
    if (!lineRef.current) return
    const stagePos = getStagePositions(stageProgress)
    const nodeCount = MASTER_NODES.length

    let ptr = 0
    for (let i = 0; i < MASTER_EDGES.length; i++) {
      const [a, b] = MASTER_EDGES[i]
      const isAssembled = a / nodeCount <= assemblyProgress && b / nodeCount <= assemblyProgress
      const p1 = stagePos[a]
      const p2 = stagePos[b]

      if (!isAssembled || !p1 || !p2) {
        positionsArray[ptr++] = 0
        positionsArray[ptr++] = 0
        positionsArray[ptr++] = 0
        positionsArray[ptr++] = 0
        positionsArray[ptr++] = 0
        positionsArray[ptr++] = 0
      } else {
        positionsArray[ptr++] = p1.x
        positionsArray[ptr++] = p1.y
        positionsArray[ptr++] = p1.z
        positionsArray[ptr++] = p2.x
        positionsArray[ptr++] = p2.y
        positionsArray[ptr++] = p2.z
      }
    }

    geometry.attributes.position.needsUpdate = true

    if (materialRef.current) {
      const isTraining = stageProgress > 0.45 && stageProgress < 0.68
      materialRef.current.color.set(isTraining ? VIOLET : stageProgress > 0.68 ? SIGNAL : HAIRLINE)
      materialRef.current.opacity = isTraining ? 0.65 : 0.35
    }
  })

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial ref={materialRef} color={HAIRLINE} transparent opacity={0.35} />
    </lineSegments>
  )
}
