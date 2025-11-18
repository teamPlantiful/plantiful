import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PlantSearchResult } from '@/types/plant'
import axios from 'axios'
import useDebounce from './useDebounce'
import { normalizeSearch } from '@/utils/normalizeSearch'

export const usePlantSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 300)
  const { original, chosung } = normalizeSearch(debouncedQuery)
  const isEmpty = !original || original.length < 1

  const { data, isFetching, error } = useQuery({
    queryKey: ['plant-search', original, chosung],
    enabled: !isEmpty,
    queryFn: async () => {
      const res = await axios.get<{ plants?: PlantSearchResult[] }>(
        `/apis/searchPlant?q=${original}&chosung=${chosung}`
      )
      return res.data.plants || []
    },
    staleTime: 1000 * 30,
    retry: 1,
  })

  return {
    searchQuery,
    setSearchQuery,
    plants: data ?? [],
    loading: isFetching,
    error,
  }
}
