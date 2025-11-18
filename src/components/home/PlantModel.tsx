'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model() {
  const model = useGLTF('/models/plant.glb')
  return (
    <primitive
      object={model.scene}
      position={[0, -0.9, 0]}
      scale={1.3}
      rotation={[0, Math.PI / 5, 0]}
    />
  )
}

export default function PlantModel() {
  return (
    <Canvas camera={{ position: [0, 0.8, 2.5], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[1, 1.5, 2]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
