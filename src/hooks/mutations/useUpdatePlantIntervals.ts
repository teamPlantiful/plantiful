import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlantIntervalsAction } from '@/app/actions/plant/updatePlantIntervalsAction'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant } from '@/types/plant'
import { monthsToDays } from '@/utils/generateDay'
interface UpdateIntervalsVariables {
  id: string
  wateringDays: number
  fertilizerMonths: number
  repottingMonths: number
}

const calcNextWateringDate = (plant: Plant, wateringDays: number): string | null => {
  if (!plant.lastWateredAt) return plant.nextWateringDate ?? null

  const base = new Date(plant.lastWateredAt)
  base.setHours(0, 0, 0, 0)
  base.setDate(base.getDate() + wateringDays)

  return base.toISOString()
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

    onMutate: async ({ id, wateringDays, fertilizerMonths, repottingMonths }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.list() })

      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev = []) =>
        prev.map((plant) => {
          if (plant.id !== id) return plant

          const nextWateringDate = calcNextWateringDate(plant, wateringDays)
          return {
            ...plant,
            wateringIntervalDays: wateringDays,
            fertilizerIntervalDays: monthsToDays(fertilizerMonths),
            repottingIntervalDays: monthsToDays(repottingMonths),
            nextWateringDate,
          }
        })
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },
  })
}
