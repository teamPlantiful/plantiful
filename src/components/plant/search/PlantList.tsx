'use client'

import { Loader2 } from 'lucide-react'
import type { PlantSearchResult } from '@/types/plant'

interface PlantListProps {
  loading: boolean
  error: string | null
  plants: PlantSearchResult[]
  searchQuery: string
  onSelect: (plant: PlantSearchResult) => void
}

export default function PlantList({ loading, error, plants, onSelect }: PlantListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">검색 중...</span>
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-destructive pt-10">{error}</p>
  }

  if (plants.length === 0) {
    return <p className="text-center text-muted-foreground pt-10">검색 결과가 없습니다.</p>
  }

  return (
    <>
      {plants.map((plant) => (
        <button
          key={plant.id}
          onClick={() => onSelect(plant)}
          className="w-full flex items-center gap-3 p-4 text-left rounded-lg border border-border hover:bg-accent/50 transition-colors"
        >
          <img
            alt={plant.commonName}
            src={plant.defaultImage?.mediumUrl || 'https://placehold.co/48x48/EBF4E5/3B5935?text=?'}
            className="w-12 h-12 rounded-md object-cover bg-secondary/20"
          />
          <div>
            <h3 className="font-semibold text-foreground">{plant.commonName}</h3>
            <p className="text-sm text-muted-foreground italic">
              {(plant.scientificName || []).join(', ')}
            </p>
          </div>
        </button>
      ))}
    </>
  )
}
