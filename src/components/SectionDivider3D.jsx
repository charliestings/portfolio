import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import styles from './SectionDivider3D.module.css'

/* ─── Spinning Wireframe Ring ─── */
function WireframeRing() {
  const meshRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Multi-axis slow rotation
    meshRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.15
    meshRef.current.rotation.z = t * 0.25
    meshRef.current.rotation.y = t * 0.1

    // Counter-rotating inner ring
    innerRef.current.rotation.x = Math.PI / 2 - Math.sin(t * 0.4) * 0.2
    innerRef.current.rotation.z = -t * 0.35
    innerRef.current.rotation.y = -t * 0.15

    // Subtle breathing scale
    const s = 1 + Math.sin(t * 0.7) * 0.03
    meshRef.current.scale.setScalar(s)
    innerRef.current.scale.setScalar(s * 0.65)
  })

  return (
    <group>
      {/* Outer ring */}
      <mesh ref={meshRef}>
        <torusGeometry args={[1.2, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={1.2}
          wireframe
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>

      {/* Inner ring */}
      <mesh ref={innerRef}>
        <torusGeometry args={[1.2, 0.03, 16, 48]} />
        <meshStandardMaterial
          color="#ea580c"
          emissive="#ea580c"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/* ─── Exported Canvas ─── */
export default function SectionDivider3D() {
  return (
    <div className={styles.dividerWrap}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} color="#fbbf24" />
        <pointLight position={[2, 1, 2]} intensity={1.2} color="#f59e0b" />
        <pointLight position={[-2, -1, 1]} intensity={0.6} color="#ea580c" />
        <WireframeRing />
      </Canvas>
    </div>
  )
}
