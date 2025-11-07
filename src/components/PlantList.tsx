'use client'

import { Loader2 } from 'lucide-react'
import { PerenualPlant } from '@/hooks/usePlantSearch'

interface PlantListProps {
  loading: boolean
  error: string | null
  plants: PerenualPlant[]
  defaultPlants: PerenualPlant[]
  searchQuery: string
  onSelect: (plant: PerenualPlant) => void
}

export default function PlantList({
  loading,
  error,
  plants,
  defaultPlants,
  searchQuery,
  onSelect,
}: PlantListProps) {
  const renderList = (list: PerenualPlant[]) => (
    <>
      {list.map((plant) => (
        <button
          key={plant.id}
          onClick={() => onSelect(plant)}
          className="w-full p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left flex items-center gap-3"
        >
          <img
            src={
              plant.default_image?.medium_url || 'https://placehold.co/48x48/EBF4E5/3B5935?text=?'
            }
            alt={plant.common_name}
            className="w-12 h-12 rounded-md object-cover bg-secondary/20"
          />
          <div>
            <h3 className="font-semibold text-foreground">{plant.common_name}</h3>
            <p className="text-sm text-muted-foreground italic">
              {plant.scientific_name.join(', ')}
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
    return <p className="text-center text-destructive pt-10">{error}</p>
  }

  if (searchQuery) {
    return plants.length > 0 ? (
      renderList(plants)
    ) : (
      <p className="text-center text-muted-foreground pt-10">검색 결과가 없습니다.</p>
    )
  }

  return renderList(defaultPlants)
}
