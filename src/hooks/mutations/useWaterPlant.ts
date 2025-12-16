import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updateWaterPlantAction } from '@/app/actions/plant/updateWaterPlantAction'
import type { CursorPagedResult } from '@/types/plant'
import { addDays, normalizeToMidnight } from '@/utils/date'
import { toast } from '@/store/useToastStore'
import { notifyInApp } from '@/utils/notifyInApp'
import type { NotificationEvent } from '@/types/notification'

interface WaterPlantVariables {
  id: string
  nickname?: string
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

    onSuccess: (_data, variables) => {
      const nickname = variables.nickname ?? '식물'

      notifyInApp({
        title: `${nickname} 물주기 완료 💧`,
        body: '오늘 물을 줬어요.',
        toastMessage: `${nickname} 물주기 완료`,
        toastType: 'success',
        event: 'WATERED' satisfies NotificationEvent,
        plantId: variables.id,
      })
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
