import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CAMERA_KEYFRAMES = [
  { p: 0.0, pos: [0.0, 0.2, 6.4], target: [0.0, 0, 0] },
  { p: 0.18, pos: [0.0, 0.2, 6.4], target: [0.0, 0, 0] },
  { p: 0.38, pos: [0.0, 0.2, 6.4], target: [0.0, 0, 0] },
  { p: 0.58, pos: [1.2, 0.1, 5.5], target: [0.2, 0, 0] },
  { p: 0.76, pos: [2.0, 0.0, 6.2], target: [1.0, 0, 0] },
  { p: 0.88, pos: [0.0, 0.2, 6.8], target: [0, 0, 0] },
  { p: 1.0, pos: [0.0, 0.4, 7.8], target: [0, 0, 0] },
]

// Reusable vectors to eliminate memory allocations in 60fps scroll loop
const _v1 = new THREE.Vector3()
const _v2 = new THREE.Vector3()
const _curPos = new THREE.Vector3()
const _t1 = new THREE.Vector3()
const _t2 = new THREE.Vector3()
const _curTarget = new THREE.Vector3()

export default function ScrollCamera({ enabled = true, onProgress }) {
  const { camera } = useThree()
  const progressRef = useRef(0)

  useEffect(() => {
    if (!enabled) return undefined

    const mainEl = document.querySelector('main')
    if (!mainEl) return undefined

    const st = ScrollTrigger.create({
      trigger: mainEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress
        if (onProgress) onProgress(self.progress)

        // Interpolate camera position between keyframes
        const p = self.progress
        let k1 = CAMERA_KEYFRAMES[0]
        let k2 = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1]

        for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
          if (p >= CAMERA_KEYFRAMES[i].p && p <= CAMERA_KEYFRAMES[i + 1].p) {
            k1 = CAMERA_KEYFRAMES[i]
            k2 = CAMERA_KEYFRAMES[i + 1]
            break
          }
        }

        const range = k2.p - k1.p
        const localT = range > 0 ? (p - k1.p) / range : 0
        const smoothT = THREE.MathUtils.smoothstep(localT, 0, 1)

        _v1.set(k1.pos[0], k1.pos[1], k1.pos[2])
        _v2.set(k2.pos[0], k2.pos[1], k2.pos[2])
        _curPos.lerpVectors(_v1, _v2, smoothT)

        _t1.set(k1.target[0], k1.target[1], k1.target[2])
        _t2.set(k2.target[0], k2.target[1], k2.target[2])
        _curTarget.lerpVectors(_t1, _t2, smoothT)

        camera.position.copy(_curPos)
        camera.lookAt(_curTarget)
      },
    })

    // Synchronously force camera update on mount so reload frames correctly immediately
    st.update()

    return () => st.kill()
  }, [camera, enabled, onProgress])

  return null
}
