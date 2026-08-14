import * as THREE from 'three'

/**
 * Perfectly Proportionate 48-Node 3D Neural Architecture across 6 Topologies:
 * Proportioned so no nodes or halo ring elements clip top/bottom/left/right boundaries.
 */

const NODE_COUNT = 48

export const MASTER_NODES = Array.from({ length: NODE_COUNT }, (_, i) => {
  const layer = Math.floor((i / NODE_COUNT) * 5) // 0 to 4
  return { id: i, layer }
})

export const INGESTION_LAYERS = {
  IDENTITY: { id: 1, range: [0, 15], color: '#f2914b' },
  ACADEMIC: { id: 2, range: [16, 31], color: '#38bdf8' },
  VERIFIED: { id: 3, range: [32, 47], color: '#a855f7' },
}

export const MASTER_EDGES = []
for (let i = 0; i < NODE_COUNT; i++) {
  const layer = MASTER_NODES[i].layer
  if (layer < 4) {
    const nextLayerStartIndex = (layer + 1) * 10
    const target1 = Math.min(NODE_COUNT - 1, nextLayerStartIndex + (i % 10))
    const target2 = Math.min(NODE_COUNT - 1, nextLayerStartIndex + ((i + 3) % 10))
    if (target1 < NODE_COUNT) MASTER_EDGES.push([i, target1])
    if (target2 < NODE_COUNT && target2 !== target1) MASTER_EDGES.push([i, target2])
  }
}

// Topology 1: Perfectly proportioned Fibonacci Sphere Core (Radius 2.0)
function getSpherePositions() {
  const phi = (1 + Math.sqrt(5)) / 2
  return MASTER_NODES.map((_, i) => {
    const theta = (2 * Math.PI * i) / phi
    const y = 1 - (i / (NODE_COUNT - 1)) * 2
    const radius = Math.sqrt(1 - y * y) * 2.0
    return new THREE.Vector3(Math.cos(theta) * radius + 2.2, y * 1.8, Math.sin(theta) * radius)
  })
}

// Topology 2: Ingestion Funnel
function getFunnelPositions() {
  return MASTER_NODES.map((n, i) => {
    const layerProgress = n.layer / 4
    const x = (layerProgress - 0.5) * 8.5 + 2.2
    const radius = (1.0 - layerProgress * 0.5) * 2.2
    const angle = (i % 10) * ((2 * Math.PI) / 10)
    return new THREE.Vector3(x, Math.sin(angle) * radius, Math.cos(angle) * radius)
  })
}

// Topology 3: 4 Architectural Columns
function getColumnPositions() {
  return MASTER_NODES.map((n, i) => {
    const x = (n.layer - 2) * 2.4 + 2.2
    const rowInLayer = i % 10
    const y = (rowInLayer - 4.5) * 0.65
    const z = Math.sin(i * 0.7) * 0.5
    return new THREE.Vector3(x, y, z)
  })
}

// Topology 4: Double-Helix Brain Cylinder
function getHelixPositions() {
  return MASTER_NODES.map((_, i) => {
    const strand = i % 2 === 0 ? 1 : -1
    const angle = (i / NODE_COUNT) * Math.PI * 4
    const y = (i / NODE_COUNT - 0.5) * 4.2
    const radius = 2.0
    return new THREE.Vector3(
      Math.cos(angle + strand * Math.PI) * radius,
      y,
      Math.sin(angle + strand * Math.PI) * radius
    )
  })
}

// Topology 5: 4 Output Rays
function getProjectRaysPositions() {
  return MASTER_NODES.map((n, i) => {
    if (n.layer === 4) {
      const rayIdx = i % 4
      const y = (rayIdx - 1.5) * 1.5
      return new THREE.Vector3(4.0, y, 0)
    }
    const x = (n.layer - 2) * 2.0
    const y = (i % 8 - 3.5) * 0.65
    const z = Math.cos(i) * 0.5
    return new THREE.Vector3(x, y, z)
  })
}

// Topology 6: Stabilized Ring & Core Collapse (Radius 3.0)
function getRingPositions() {
  return MASTER_NODES.map((_, i) => {
    if (i < 8) {
      const angle = (i / 8) * Math.PI * 2
      return new THREE.Vector3(Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0)
    }
    const angle = (i / (NODE_COUNT - 8)) * Math.PI * 2
    return new THREE.Vector3(Math.cos(angle) * 3.0, Math.sin(angle) * 3.0, (i % 3 - 1) * 0.3)
  })
}

const SPHERE_POS = getSpherePositions()
const FUNNEL_POS = getFunnelPositions()
const COLUMN_POS = getColumnPositions()
const HELIX_POS = getHelixPositions()
const RAYS_POS = getProjectRaysPositions()
const RING_POS = getRingPositions()

// Pre-instantiated vector pool to prevent 70,000+ object allocations/sec during 60fps animation
const STAGE_POS_CACHE = Array.from({ length: NODE_COUNT }, () => new THREE.Vector3())

export function getStagePositions(p) {
  let fromPos = SPHERE_POS
  let toPos = SPHERE_POS
  let t = 0

  if (p < 0.12) {
    fromPos = SPHERE_POS
    toPos = FUNNEL_POS
    t = p / 0.12
  } else if (p < 0.32) {
    fromPos = FUNNEL_POS
    toPos = COLUMN_POS
    t = (p - 0.12) / 0.2
  } else if (p < 0.52) {
    fromPos = COLUMN_POS
    toPos = HELIX_POS
    t = (p - 0.32) / 0.2
  } else if (p < 0.75) {
    fromPos = HELIX_POS
    toPos = RAYS_POS
    t = (p - 0.52) / 0.23
  } else {
    fromPos = RAYS_POS
    toPos = RING_POS
    t = Math.min(1.0, (p - 0.75) / 0.25)
  }

  const smoothT = THREE.MathUtils.smoothstep(t, 0, 1)

  for (let i = 0; i < NODE_COUNT; i++) {
    STAGE_POS_CACHE[i].lerpVectors(fromPos[i], toPos[i], smoothT)
  }

  return STAGE_POS_CACHE
}
