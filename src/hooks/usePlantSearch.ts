import { useState, useEffect } from 'react'
import { PlantSearchResult } from '@/types/plant'
import axios from 'axios'

export const usePlantSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [plants, setPlants] = useState<PlantSearchResult[]>([])
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
        const response = await axios.get<{ plants?: PlantSearchResult[] }>(API_URL)

        setPlants(response.data.plants || [])
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message)
        } else {
          setError('검색 중 오류 발생')
        }
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
