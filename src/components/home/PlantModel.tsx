'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type PlantState = 'normal' | 'thirsty'

interface ModelProps {
  state: PlantState
}

function Model({ state }: ModelProps) {
  const model = useGLTF('/models/plant.glb')
  const plantMeshesRef = useRef<
    Array<{ mesh: THREE.Mesh; originalMaterial: THREE.Material; index: number }>
  >([])

  // 초기화: 식물 mesh 찾기 (한 번만)
  useEffect(() => {
    if (!model.scene || plantMeshesRef.current.length > 0) return

    let plantMeshIndex = 0
    model.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial
        const originalColor = material.color.clone()
        const hsl = { h: 0, s: 0, l: 0 }
        originalColor.getHSL(hsl)

        // lightness로 식물 구분
        const isPlantPart = hsl.l > 0.65 && hsl.l < 0.75

        if (isPlantPart) {
          plantMeshesRef.current.push({
            mesh: child,
            originalMaterial: material.clone(),
            index: plantMeshIndex++,
          })
        }
      }
    })
  }, [model.scene])

  // 상태 변경 시 material만 수정
  useEffect(() => {
    const plantMeshes = plantMeshesRef.current
    if (plantMeshes.length === 0) return

    plantMeshes.forEach(({ mesh, originalMaterial, index }) => {
      if (state === 'normal') {
        // 원본 material로 교체
        const normalMaterial = originalMaterial.clone() as THREE.MeshStandardMaterial
        normalMaterial.emissive.setHex(0x000000)
        normalMaterial.emissiveIntensity = 0
        mesh.material = normalMaterial
      } else if (state === 'thirsty') {
        // 시든 상태
        const newMaterial = originalMaterial.clone() as THREE.MeshStandardMaterial
        mesh.material = newMaterial

        const witheredColors = [
          { color: 0xffaa66, emissive: 0x664422 },
          { color: 0xffdd88, emissive: 0x886633 },
          { color: 0xddaa77, emissive: 0x775533 },
          { color: 0xffcc77, emissive: 0x997744 },
          { color: 0xeebb88, emissive: 0x886644 },
        ]

        const colorPair = witheredColors[index % witheredColors.length]
        newMaterial.color.setHex(colorPair.color)
        newMaterial.emissive.setHex(colorPair.emissive)
        newMaterial.emissiveIntensity = 0.4
        newMaterial.opacity = 0.9
        newMaterial.transparent = true
        newMaterial.roughness = 0.8
        newMaterial.needsUpdate = true
      }
    })
  }, [state])

  return (
    <group rotation={[0, Math.PI / 5, 0]} position={[0, -0.9, 0]} scale={1.1}>
      <primitive object={model.scene} />
    </group>
  )
}

interface PlantModelProps {
  state?: PlantState
}

export default function PlantModel({ state = 'normal' }: PlantModelProps) {
  return (
    <Canvas camera={{ position: [0, 0.8, 2.5], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[1, 1.5, 2]} />

      <Suspense fallback={null}>
        <Model state={state} />
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} makeDefault />
    </Canvas>
  )
}
