import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import styles from './ProjectsCrystal.module.css'

/* ─── Rotating Crystal (Octahedron) ─── */
function Crystal() {
  const groupRef = useRef()
  const solidRef = useRef()
  const wireRef = useRef()
  const { pointer } = useThree()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Slow rotation
    groupRef.current.rotation.x = t * 0.12
    groupRef.current.rotation.y = t * 0.18
    groupRef.current.rotation.z = t * 0.08

    // Gentle bob
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2

    // Pulsing scale
    const scale = 1 + Math.sin(t * 0.9) * 0.04
    groupRef.current.scale.setScalar(scale)

    // Mouse parallax tilt
    groupRef.current.rotation.x += THREE.MathUtils.lerp(0, pointer.y * 0.15, 0.04)
    groupRef.current.rotation.y += THREE.MathUtils.lerp(0, pointer.x * 0.15, 0.04)
  })

  return (
    <group ref={groupRef}>
      {/* Solid semi-transparent core */}
      <mesh ref={solidRef}>
        <octahedronGeometry args={[1.1, 0]} />
        <MeshDistortMaterial
          color="#f59e0b"
          emissive="#ea580c"
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.95}
          distort={0.08}
          speed={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Wireframe edge outline */}
      <mesh ref={wireRef}>
        <octahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/* ─── Orbiting Sparks ─── */
function CrystalSparks() {
  const ref = useRef()
  const count = 24

  const sparks = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      arr.push({
        id: i,
        radius: 1.6 + Math.random() * 0.5,
        angle,
        speed: 0.15 + Math.random() * 0.2,
        size: 0.03 + Math.random() * 0.04,
        yOffset: (Math.random() - 0.5) * 1.8,
        color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f59e0b' : '#ea580c',
      })
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.children.forEach((child, i) => {
      const s = sparks[i]
      const a = s.angle + t * s.speed
      child.position.x = Math.cos(a) * s.radius
      child.position.z = Math.sin(a) * s.radius
      child.position.y = s.yOffset + Math.sin(t * 0.6 + i * 0.5) * 0.25
    })
  })

  return (
    <group ref={ref}>
      {sparks.map((s) => (
        <mesh key={s.id}>
          <sphereGeometry args={[s.size, 8, 8]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Exported Canvas ─── */
export default function ProjectsCrystal() {
  return (
    <div className={styles.crystalWrap}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} color="#fbbf24" />
        <pointLight position={[3, 3, 3]} intensity={1.8} color="#f59e0b" />
        <pointLight position={[-2, -2, 2]} intensity={0.8} color="#ea580c" />
        <pointLight position={[0, 4, -2]} intensity={0.6} color="#fbbf24" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
          <Crystal />
        </Float>
        <CrystalSparks />
      </Canvas>
      <div className={styles.glow} />
    </div>
  )
}
