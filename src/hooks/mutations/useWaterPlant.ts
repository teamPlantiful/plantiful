import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Plant } from '@/types/plant'
import { queryKeys } from '@/lib/queryKeys'
import { updateWateredAt } from '@/app/apis/supabaseApi'

interface WaterPlantVariables {
  id: string
  lastWateredAt: string
}

export const useWaterPlant = () => {
  const queryClient = useQueryClient()

  return useMutation<Plant, Error, WaterPlantVariables>({
    mutationFn: ({ id, lastWateredAt }) => updateWateredAt(id, lastWateredAt),

    onSuccess: () => {
      // 식물 목록 쿼리를 무효화하여 최신 데이터를 다시 가져옴
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },

    onError: (error) => {
      console.error('물주기 실패:', error)
    },
  })
}
