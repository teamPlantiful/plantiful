// src/hooks/usePlantSearch.ts
import { useState, useEffect } from 'react'

export interface PerenualPlant {
  id: number
  common_name: string
  scientific_name: string[]
  default_image?: { medium_url: string }
}

const API_KEY = process.env.NEXT_PUBLIC_PERENUAL_API_KEY

export const usePlantSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [plants, setPlants] = useState<PerenualPlant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultPlants: PerenualPlant[] = [
    { id: 1, common_name: '몬스테라', scientific_name: ['Monstera deliciosa'] },
    {
      id: 2,
      common_name: '스킨답서스 (황금빛 포토스)',
      scientific_name: ['Epipremnum aureum'],
    },
    { id: 3, common_name: '산세베리아', scientific_name: ['Sansevieria trifasciata'] },
  ]

  useEffect(() => {
    if (!searchQuery.trim()) {
      setPlants([])
      return
    }

    const fetchPlants = async () => {
      setLoading(true)
      setError(null)
      try {
        const API_URL = `https://perenual.com/api/species-list?key=${API_KEY}&q=${searchQuery}`
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error(`API 오류: ${response.statusText}`)
        const data = await response.json()
        setPlants(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : '검색 중 오류 발생')
        setPlants([])
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    plants,
    loading,
    error,
    defaultPlants,
  }
}
