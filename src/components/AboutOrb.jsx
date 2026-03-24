import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'

function FloatingIcosahedron() {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.y = t * 0.5
    ref.current.position.y = Math.sin(t * 0.8) * 0.15
    // Pulsing scale
    const scale = 1 + Math.sin(t * 1.2) * 0.06
    ref.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.8, 1]} />
      <MeshDistortMaterial
        color="#f59e0b"
        emissive="#ea580c"
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.85}
        distort={0.2}
        speed={2}
        transparent
        opacity={0.85}
        wireframe
      />
    </mesh>
  )
}

const wrapStyle = {
  width: '80px',
  height: '80px',
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: '10px',
}

export default function AboutOrb() {
  return (
    <div style={wrapStyle}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} color="#fbbf24" />
        <pointLight position={[2, 2, 2]} intensity={1.5} color="#f59e0b" />
        <pointLight position={[-2, -1, 1]} intensity={0.8} color="#ea580c" />
        <FloatingIcosahedron />
      </Canvas>
    </div>
  )
}
