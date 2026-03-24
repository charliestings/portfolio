import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ─── 3D Extruded Name with infinite animations ─── */
function NameText({ hovered, setHovered }) {
  const groupRef = useRef()
  const textRef = useRef()
  const glowRef = useRef()
  const { pointer } = useThree()
  const fontUrl = '/fonts/helvetiker_bold.typeface.json'

  // Color palette for infinite cycling
  const colorA = useMemo(() => new THREE.Color('#f59e0b'), [])
  const colorB = useMemo(() => new THREE.Color('#ea580c'), [])
  const colorC = useMemo(() => new THREE.Color('#fbbf24'), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Continuous gentle Y rotation (very subtle so name stays visible)
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.06

    // Continuous floating bob
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.06

    // Continuous breathing scale
    const breathe = 1 + Math.sin(t * 0.7) * 0.02
    groupRef.current.scale.setScalar(breathe)

    // Mouse parallax (subtle to keep name in frame)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.sin(t * 0.4) * 0.02 + pointer.y * 0.04,
      0.05
    )

    // Infinite color cycling on the material
    if (textRef.current) {
      const cycle = (Math.sin(t * 0.3) + 1) / 2 // 0..1
      const cycle2 = (Math.sin(t * 0.3 + 2) + 1) / 2
      tempColor.copy(colorA).lerp(colorB, cycle).lerp(colorC, cycle2 * 0.3)
      textRef.current.material.color.copy(tempColor)

      // Pulsing emissive intensity
      textRef.current.material.emissiveIntensity = 0.4 + Math.sin(t * 0.8) * 0.25
    }

    // Glow wireframe counter-rotation
    if (glowRef.current) {
      glowRef.current.rotation.y = -Math.sin(t * 0.2) * 0.04
      glowRef.current.rotation.x = Math.sin(t * 0.35) * 0.015
      const glowScale = 1.005 + Math.sin(t * 1.2) * 0.008
      glowRef.current.scale.setScalar(glowScale)
    }
  })

  return (
    <group ref={groupRef}>
      <Center>
        {/* Main solid text */}
        <Text3D
          ref={textRef}
          font={fontUrl}
          size={1.2}
          height={0.35}
          curveSegments={18}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.025}
          bevelOffset={0}
          bevelSegments={8}
          letterSpacing={0.02}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {'Sudharsanan'}
          <MeshDistortMaterial
            color="#f59e0b"
            emissive="#ea580c"
            emissiveIntensity={0.5}
            roughness={0.12}
            metalness={0.97}
            distort={hovered ? 0.1 : 0.04}
            speed={2}
            transparent
            opacity={0.96}
          />
        </Text3D>

        {/* Wireframe glow outline */}
        <Text3D
          ref={glowRef}
          font={fontUrl}
          size={1.2}
          height={0.35}
          curveSegments={18}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.025}
          bevelOffset={0}
          bevelSegments={8}
          letterSpacing={0.02}
        >
          {'Sudharsanan'}
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.6}
            wireframe
            transparent
            opacity={0.15}
            toneMapped={false}
          />
        </Text3D>
      </Center>
    </group>
  )
}

/* ─── Floating Sparks around the name ─── */
function NameSparks() {
  const ref = useRef()
  const count = 16

  const sparks = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        angle: (i / count) * Math.PI * 2,
        radius: 5 + Math.random() * 1.5,
        speed: 0.08 + Math.random() * 0.12,
        size: 0.02 + Math.random() * 0.03,
        yOff: (Math.random() - 0.5) * 1.0,
        color: ['#fbbf24', '#f59e0b', '#ea580c'][i % 3],
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
      child.position.y = s.yOff + Math.sin(t * 0.5 + i) * 0.2
      // Pulsing opacity via scale
      const pulse = 0.6 + Math.sin(t * 1.5 + i * 0.8) * 0.4
      child.scale.setScalar(pulse)
    })
  })

  return (
    <group ref={ref}>
      {sparks.map((s, i) => (
        <mesh key={i}>
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

/* ─── Exported Inline Canvas ─── */
export default function Name3DInline() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        height: 'clamp(140px, 22vw, 240px)',
        pointerEvents: 'auto',
        cursor: hovered ? 'pointer' : 'default',
      }}
      aria-label="Sudharsanan"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.35} color="#fbbf24" />
        <pointLight position={[5, 3, 5]} intensity={2.2} color="#f59e0b" />
        <pointLight position={[-4, -2, 3]} intensity={1.2} color="#ea580c" />
        <pointLight position={[0, -3, 4]} intensity={0.6} color="#fbbf24" />
        <spotLight
          position={[0, 4, 6]}
          angle={0.45}
          penumbra={0.6}
          intensity={1.5}
          color="#fbbf24"
        />
        <NameText hovered={hovered} setHovered={setHovered} />
        <NameSparks />
      </Canvas>
    </div>
  )
}
