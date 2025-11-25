import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlantIntervalsAction } from '@/app/actions/plant/updatePlantIntervalsAction'
import { queryKeys } from '@/lib/queryKeys'

interface UpdateIntervalsVariables {
  id: string
  wateringDays: number
  fertilizerMonths: number
  repottingMonths: number
}

export const useUpdatePlantIntervals = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateIntervalsVariables>({
    mutationFn: async ({ id, wateringDays, fertilizerMonths, repottingMonths }) => {
      const formData = new FormData()
      formData.set('id', id)
      formData.set('wateringInterval', String(wateringDays))
      formData.set('fertilizerIntervalMonth', String(fertilizerMonths))
      formData.set('repottingIntervalMonth', String(repottingMonths))

      await updatePlantIntervalsAction(formData)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },
  })
}
