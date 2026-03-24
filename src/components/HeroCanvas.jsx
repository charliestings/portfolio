import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import styles from './HeroCanvas.module.css'

/* ─── Glowing Torus-Knot ─── */
function GlowingTorusKnot() {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.15
    meshRef.current.rotation.y = t * 0.22
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.3
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.4, 0.45, 180, 32, 2, 3]} />
      <MeshDistortMaterial
        color="#f59e0b"
        emissive="#ea580c"
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.9}
        distort={0.15}
        speed={1.5}
        transparent
        opacity={0.88}
      />
    </mesh>
  )
}

/* ─── Orbiting Spheres that react to mouse ─── */
function OrbitingSpheres() {
  const groupRef = useRef()
  const { pointer } = useThree()

  const spheres = useMemo(() => {
    const arr = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      arr.push({
        id: i,
        radius: 2.8 + Math.random() * 0.6,
        angle,
        speed: 0.2 + Math.random() * 0.15,
        size: 0.08 + Math.random() * 0.1,
        yOffset: (Math.random() - 0.5) * 1.5,
        color: i % 2 === 0 ? '#fbbf24' : '#f59e0b',
      })
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Parallax tilt from mouse
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.3,
      0.05
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.3,
      0.05
    )
    // Update each sphere
    groupRef.current.children.forEach((child, i) => {
      const s = spheres[i]
      const a = s.angle + t * s.speed
      child.position.x = Math.cos(a) * s.radius
      child.position.z = Math.sin(a) * s.radius
      child.position.y = s.yOffset + Math.sin(t * 0.8 + i) * 0.3
    })
  })

  return (
    <group ref={groupRef}>
      {spheres.map((s) => (
        <mesh key={s.id}>
          <sphereGeometry args={[s.size, 16, 16]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Particle field for depth ─── */
function ParticleField() {
  const ref = useRef()
  const count = 60

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
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
        size={0.04}
        color="#fbbf24"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Main Scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} color="#fbbf24" />
      <pointLight position={[3, 3, 3]} intensity={2} color="#f59e0b" />
      <pointLight position={[-3, -2, 2]} intensity={1} color="#ea580c" />
      <pointLight position={[0, 5, -3]} intensity={0.8} color="#fbbf24" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <GlowingTorusKnot />
      </Float>

      <OrbitingSpheres />
      <ParticleField />
    </>
  )
}

/* ─── Exported Canvas ─── */
export default function HeroCanvas() {
  return (
    <div className={styles.canvasWrap}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
      {/* Radial glow behind the 3D scene */}
      <div className={styles.glow} />
    </div>
  )
}
