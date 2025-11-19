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

export default function PlantList({
  loading,
  error,
  plants,
  searchQuery,
  onSelect,
}: PlantListProps) {
  const renderList = (list: PlantSearchResult[]) => (
    <>
      {list.map((plant) => (
        <button
          key={plant.id}
          onClick={() => onSelect(plant)}
          className="w-full cursor-pointer p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left flex items-center gap-3"
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">검색 중...</span>
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-destructive pt-10">
        {error ? '검색 도중 문제가 발생했습니다' : null}
      </p>
    )
  }

  return plants.length > 0 ? (
    renderList(plants)
  ) : (
    <p className="text-center text-muted-foreground pt-10">
      {searchQuery ? `'${searchQuery}'에 대한 ` : ''}검색 결과가 없습니다.
    </p>
  )
}
