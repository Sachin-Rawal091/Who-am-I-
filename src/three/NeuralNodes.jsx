import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MASTER_NODES, getStagePositions } from './machineData'

const NODE_FILL = '#232b38'
const ORIGIN = new THREE.Vector3(0, 0, 0)
const innerGlowGeo = new THREE.SphereGeometry(0.34, 16, 16)
const outerAuraGeo = new THREE.SphereGeometry(0.52, 16, 16)

export default function NeuralNodes({ stageProgress = 0, assemblyProgress = 1.0, particleBurstEvent = null }) {
  const meshRef = useRef(null)
  const activeNodesRef = useRef([])
  const activeColorRef = useRef('#f2914b')
  const lastProcessedEventId = useRef(0)
  const glowTimer = useRef(0)

  useEffect(() => {
    if (!particleBurstEvent) return
    if (particleBurstEvent.id <= lastProcessedEventId.current) return

    lastProcessedEventId.current = particleBurstEvent.id
    if (particleBurstEvent.nodes && particleBurstEvent.nodes.length > 0) {
      activeNodesRef.current = particleBurstEvent.nodes
      activeColorRef.current = particleBurstEvent.color || '#f2914b'
      glowTimer.current = 1.8 // 1.8 seconds glow duration
    }
  }, [particleBurstEvent])

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.22, 1), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: NODE_FILL,
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const positions = getStagePositions(stageProgress)
    const time = state.clock.elapsedTime

    if (glowTimer.current > 0) {
      glowTimer.current -= delta
    }

    positions.forEach((pos, i) => {
      // Calculate individual node assembly threshold
      const nodeThreshold = i / MASTER_NODES.length
      const rawT = (assemblyProgress - nodeThreshold * 0.7) / 0.3
      const nodeProgress = THREE.MathUtils.clamp(rawT, 0, 1)
      const smoothProgress = THREE.MathUtils.smoothstep(nodeProgress, 0, 1)

      if (smoothProgress <= 0.001) {
        dummy.position.set(0, 0, 0)
        dummy.scale.set(0, 0, 0)
      } else {
        // Interpolate position from origin to target position
        dummy.position.lerpVectors(ORIGIN, pos, smoothProgress)
        dummy.rotation.x = time * 0.3 + i
        dummy.rotation.y = time * 0.2 + i

        const isOutput = MASTER_NODES[i]?.layer === 4
        const isTraining = stageProgress > 0.45 && stageProgress < 0.68
        const pulse = isTraining ? 1.0 + Math.sin(time * 6 + i) * 0.15 : 1.0
        
        // Keep physical node mesh scale natural
        const baseScale = isOutput && stageProgress > 0.68 ? 1.35 : pulse
        const finalScale = baseScale * smoothProgress
        dummy.scale.set(finalScale, finalScale, finalScale)
      }

      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Skill wireframe neon glowing spheres belong EXCLUSIVELY to Stage 2 (Skills & Architecture)
  const isGlowing = glowTimer.current > 0 && stageProgress > 0.25 && stageProgress < 0.50
  const activeNodes = activeNodesRef.current
  const activeColor = activeColorRef.current
  const currentPositions = getStagePositions(stageProgress)

  return (
    <group>
      {/* Base 48-node instanced mesh */}
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, MASTER_NODES.length]}
        castShadow
        receiveShadow
      />

      {/* Surrounding 3D Spherical Neon Orbs & Point Lights around active target nodes (Rotation Invariant) */}
      {isGlowing &&
        activeNodes.map((nodeIdx) => {
          const pos = currentPositions[nodeIdx]
          if (!pos) return null
          return (
            <group key={`${nodeIdx}-${activeColor}`} position={[pos.x, pos.y, pos.z]}>
              {/* Inner Glowing 3D Neon Orb */}
              <mesh geometry={innerGlowGeo}>
                <meshBasicMaterial
                  key={`inner-${nodeIdx}-${activeColor}`}
                  color={activeColor}
                  transparent
                  opacity={0.85}
                  wireframe
                />
              </mesh>

              {/* Outer Subtle Emissive Aura */}
              <mesh geometry={outerAuraGeo}>
                <meshBasicMaterial
                  key={`outer-${nodeIdx}-${activeColor}`}
                  color={activeColor}
                  transparent
                  opacity={0.25}
                />
              </mesh>

              {/* Surrounding PointLight */}
              <pointLight
                key={`light-${nodeIdx}-${activeColor}`}
                color={activeColor}
                intensity={6.0}
                distance={2.5}
                decay={2}
              />
            </group>
          )
        })}
    </group>
  )
}
