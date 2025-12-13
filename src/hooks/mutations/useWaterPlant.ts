import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updateWaterPlantAction } from '@/app/actions/plant/updateWaterPlantAction'
import type { CursorPagedResult } from '@/types/plant'
import { addDays, normalizeToMidnight } from '@/utils/date'
import { toast } from '@/store/useToastStore'

interface WaterPlantVariables {
  id: string
}

interface WaterPlantContext {
  previousQueries: [any, InfiniteData<CursorPagedResult> | undefined][]
}

export const useWaterPlant = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, WaterPlantVariables, WaterPlantContext>({
    mutationFn: async ({ id }) => {
      const formData = new FormData()
      formData.set('id', id)
      await updateWaterPlantAction(formData)
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.lists() })

      // 모든 매칭되는 쿼리의 이전 데이터 저장 (롤백용)
      const previousQueries = queryClient.getQueriesData<InfiniteData<CursorPagedResult>>({
        queryKey: queryKeys.plants.lists(),
      })

      // 무한 쿼리 캐시 낙관적 업데이트
      const now = new Date()
      const today = normalizeToMidnight(now)

      queryClient.setQueriesData<InfiniteData<CursorPagedResult>>(
        { queryKey: queryKeys.plants.lists() },
        (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((plant) => {
                if (plant.id !== id) return plant

                const nextWateringDate = addDays(today, plant.wateringIntervalDays)

                return {
                  ...plant,
                  lastWateredAt: today.toISOString(),
                  nextWateringDate: nextWateringDate.toISOString(),
                }
              }),
            })),
          }
        }
      )

      return { previousQueries }
    },

    onSuccess: () => {
      // 서버 데이터로 즉시 refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.lists() })
    },

    onError: (error, _variables, context) => {
      console.error('물주기 실패:', error)
      toast('물주기에 실패했습니다.', 'error')

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
