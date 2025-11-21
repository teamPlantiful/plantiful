import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlantIntervalsAction } from '@/app/actions/plant/updatePlantIntervalsAction'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant } from '@/types/plant'

interface UpdateIntervalsVariables {
  id: string
  wateringDays: number
  fertilizerDays: number
  repottingDays: number
}

export const useUpdatePlantIntervals = () => {
  const queryClient = useQueryClient()

  return useMutation<Plant, Error, UpdateIntervalsVariables>({
    mutationFn: updatePlantIntervalsAction,

    onSuccess: (updatedPlant) => {
      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev = []) =>
        prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
      )
    },
  })
}
