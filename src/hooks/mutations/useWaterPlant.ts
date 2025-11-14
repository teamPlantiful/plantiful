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

    onSuccess: (updatedPlant) => {
      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev = []) =>
        prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
      )
    },
  })
}
