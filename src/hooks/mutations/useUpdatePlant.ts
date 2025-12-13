import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { updatePlantAction } from '@/app/actions/plant/updatePlantAction'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant, CursorPagedResult } from '@/types/plant'
import { monthsToDays } from '@/utils/generateDay'
import { addDays, normalizeToMidnight } from '@/utils/date'
import { toast } from '@/store/useToastStore'

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
  previousQueries: [any, InfiniteData<CursorPagedResult> | undefined][]
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
  return useMutation<void, Error, UpdateIntervalsVariables, MutationContext>({
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
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.lists() })

      // 모든 매칭되는 쿼리의 이전 데이터 저장 (롤백용)
      const previousQueries = queryClient.getQueriesData<InfiniteData<CursorPagedResult>>({
        queryKey: queryKeys.plants.lists(),
      })

      const tempImageUrl = file ? URL.createObjectURL(file) : undefined

      // 무한 쿼리 캐시 낙관적 업데이트
      queryClient.setQueriesData<InfiniteData<CursorPagedResult>>(
        { queryKey: queryKeys.plants.lists() },
        (old) => {
          if (!old) return old

          const nextWateringDate = calcNextWateringDate(lastWateredAt, wateringDays)

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((plant) => {
                if (plant.id !== id) return plant

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
              }),
            })),
          }
        }
      )
      return { previousQueries, tempImageUrl }
    },

    onSuccess: () => {
      // 서버 데이터로 즉시 refetch (이미지 URL 동기화)
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.lists() })
    },

    onError: (error, _variables, context) => {
      console.error('식물 정보 수정 실패:', error)
      toast('식물 정보 수정에 실패했습니다.', 'error')
      // 에러 시 이전 데이터로 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data)
          }
        })
      }
    },
  })
}
