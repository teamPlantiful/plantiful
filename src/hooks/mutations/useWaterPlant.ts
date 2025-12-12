import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updateWaterPlantAction } from '@/app/actions/plant/updateWaterPlantAction'
import type { CursorPagedResult } from '@/types/plant'
import { addDays, normalizeToMidnight } from '@/utils/date'

interface WaterPlantVariables {
  id: string
}

interface WaterPlantContext {
  previousData?: InfiniteData<CursorPagedResult>
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

      // 이전 데이터 저장 (롤백용)
      const previousData = queryClient.getQueryData<InfiniteData<CursorPagedResult>>(
        queryKeys.plants.lists()
      )

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

      return { previousData }
    },

    onError: (error, _variables, context) => {
      console.error('물주기 실패:', error)

      // 에러 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueriesData(
          { queryKey: queryKeys.plants.lists() },
          context.previousData
        )
      }
    },

    onSettled: () => {
      // stale 표시만 (즉시 refetch 안 함, 다음 포커스/마운트 시 동기화)
      queryClient.invalidateQueries({
        queryKey: queryKeys.plants.lists(),
        refetchType: 'none',
      })
    },
  })
}
