import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import styles from './ContactHelix.module.css'

const SPHERE_COUNT = 36
const HELIX_RADIUS = 1.2
const HELIX_HEIGHT = 4.5
const TURNS = 2.5

/* ─── Double Helix ─── */
function DoubleHelix() {
  const groupRef = useRef()
  const strandARef = useRef()
  const strandBRef = useRef()
  const connectRef = useRef()

  // Pre-compute dummy for instanced mesh transforms
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Connector bar positions (every 4th pair)
  const connectorCount = Math.floor(SPHERE_COUNT / 4)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Slow rotation
    groupRef.current.rotation.y = t * 0.12

    // Update strand A
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const frac = i / SPHERE_COUNT
      const angle = frac * Math.PI * 2 * TURNS + t * 0.3
      const y = (frac - 0.5) * HELIX_HEIGHT

      dummy.position.set(
        Math.cos(angle) * HELIX_RADIUS,
        y,
        Math.sin(angle) * HELIX_RADIUS
      )

      // Pulsing glow effect traveling along the helix
      const pulse = 0.6 + 0.4 * Math.sin(t * 2 - frac * Math.PI * 4)
      dummy.scale.setScalar(pulse)
      dummy.updateMatrix()
      strandARef.current.setMatrixAt(i, dummy.matrix)
    }
    strandARef.current.instanceMatrix.needsUpdate = true

    // Update strand B (180° offset)
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const frac = i / SPHERE_COUNT
      const angle = frac * Math.PI * 2 * TURNS + t * 0.3 + Math.PI
      const y = (frac - 0.5) * HELIX_HEIGHT

      dummy.position.set(
        Math.cos(angle) * HELIX_RADIUS,
        y,
        Math.sin(angle) * HELIX_RADIUS
      )

      const pulse = 0.6 + 0.4 * Math.sin(t * 2 - frac * Math.PI * 4 + Math.PI)
      dummy.scale.setScalar(pulse)
      dummy.updateMatrix()
      strandBRef.current.setMatrixAt(i, dummy.matrix)
    }
    strandBRef.current.instanceMatrix.needsUpdate = true

    // Update connector bars
    for (let c = 0; c < connectorCount; c++) {
      const idx = c * 4
      const frac = idx / SPHERE_COUNT
      const angle = frac * Math.PI * 2 * TURNS + t * 0.3
      const y = (frac - 0.5) * HELIX_HEIGHT

      // Position at midpoint between the two strands
      dummy.position.set(0, y, 0)
      dummy.rotation.set(0, angle, 0)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      connectRef.current.setMatrixAt(c, dummy.matrix)
    }
    connectRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Strand A */}
      <instancedMesh ref={strandARef} args={[null, null, SPHERE_COUNT]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={1.2}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      </instancedMesh>

      {/* Strand B */}
      <instancedMesh ref={strandBRef} args={[null, null, SPHERE_COUNT]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#ea580c"
          emissive="#ea580c"
          emissiveIntensity={1.0}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      </instancedMesh>

      {/* Connector bars between strands */}
      <instancedMesh ref={connectRef} args={[null, null, connectorCount]}>
        <cylinderGeometry args={[0.015, 0.015, HELIX_RADIUS * 2, 6]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </instancedMesh>
    </group>
  )
}

/* ─── Ambient Particles ─── */
function HelixParticles() {
  const ref = useRef()
  const count = 40

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return arr
  }, [])

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.015
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#fbbf24"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Exported Canvas ─── */
export default function ContactHelix() {
  return (
    <div className={styles.helixWrap}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.25} color="#fbbf24" />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#f59e0b" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#ea580c" />
        <pointLight position={[0, 4, -3]} intensity={0.6} color="#fbbf24" />

        <DoubleHelix />
        <HelixParticles />
      </Canvas>
      <div className={styles.glow} />
    </div>
  )
}
