import { useState, useEffect } from 'react'

export interface PerenualPlant {
  id: number
  commonName: string
  scientificName: string[]
  defaultImage?: { mediumUrl: string }
}

export const usePlantSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [plants, setPlants] = useState<PerenualPlant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setPlants([])
      return
    }

    const fetchPlants = async () => {
      setLoading(true)
      setError(null)
      try {
        const API_URL = `/apis/searchPlant?q=${searchQuery}`
        const response = await fetch(API_URL)
        if (!response.ok)
          throw new Error(`API 오류: ${response.statusText} (코드: ${response.status})`)
        const data = await response.json()
        setPlants(data.plants || [])
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
  }
}
