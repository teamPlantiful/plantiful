'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import PlantModel from './PlantModel'

type PlantState = 'normal' | 'thirsty'

interface PlantCanvasProps {
  state?: PlantState
}

export default function PlantCanvas({ state = 'normal' }: PlantCanvasProps) {
  return (
    <Canvas camera={{ position: [0, 0.8, 2.5], fov: 45 }} style={{ touchAction: 'pan-y' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[1, 1.5, 2]} />

      <Suspense fallback={null}>
        <PlantModel state={state} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 2.3}
        makeDefault
      />
    </Canvas>
  )
}
