import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlantAction } from '@/app/actions/plant/updatePlantAction'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant } from '@/types/plant'
import { monthsToDays } from '@/utils/generateDay'
import { addDays, normalizeToMidnight } from '@/utils/date'

interface UpdateIntervalsVariables {
  id: string
  wateringDays: number
  fertilizerMonths: number
  repottingMonths: number
  adoptedAt: Date
  lastWateredAt: Date
  file?: File | null
  removeImage?: boolean
}

interface MutationContext {
  previousPlants?: Plant[]
  tempImageUrl?: string
}

const calcNextWateringDate = (
  lastWateredAt: Date | string | null,
  wateringDays: number
): string | null => {
  if (!lastWateredAt) return null

  const base = normalizeToMidnight(lastWateredAt)
  const next = addDays(base, wateringDays)
  return next.toISOString()
}

export const useUpdatePlant = () => {
  const queryClient = useQueryClient()
  const dateOnly = (d: Date) => d.toISOString().slice(0, 10)
  return useMutation<void, Error, UpdateIntervalsVariables>({
    mutationFn: async ({
      id,
      wateringDays,
      fertilizerMonths,
      repottingMonths,
      adoptedAt,
      lastWateredAt,
      file,
      removeImage,
    }) => {
      const formData = new FormData()
      formData.set('id', id)
      formData.set('wateringInterval', String(wateringDays))
      formData.set('fertilizerIntervalMonth', String(fertilizerMonths))
      formData.set('repottingIntervalMonth', String(repottingMonths))
      formData.set('adoptedAt', dateOnly(adoptedAt))
      formData.set('lastWateredAt', dateOnly(lastWateredAt))
      formData.set('removeImage', removeImage ? 'true' : 'false')

      if (file) {
        formData.set('file', file)
      }

      await updatePlantAction(formData)
    },

    onMutate: async ({
      id,
      wateringDays,
      fertilizerMonths,
      repottingMonths,
      adoptedAt,
      lastWateredAt,
      file,
      removeImage,
    }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.list() })

      const previousPlants = queryClient.getQueryData<Plant[]>(queryKeys.plants.list())

      const tempImageUrl = file ? URL.createObjectURL(file) : undefined

      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev = []) =>
        prev.map((plant) => {
          if (plant.id !== id) return plant

          const nextWateringDate = calcNextWateringDate(lastWateredAt, wateringDays)
          return {
            ...plant,
            wateringIntervalDays: wateringDays,
            fertilizerIntervalDays: monthsToDays(fertilizerMonths),
            repottingIntervalDays: monthsToDays(repottingMonths),
            adoptedAt: adoptedAt.toISOString(),
            lastWateredAt: lastWateredAt.toISOString(),
            nextWateringDate,
            coverImageUrl: removeImage ? null : (tempImageUrl ?? plant.coverImageUrl),
          }
        })
      )
      return { previousPlants, tempImageUrl }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },
  })
}
