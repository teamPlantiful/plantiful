import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updatePlantNicknameAction } from '@/app/actions/plant/updatePlantNicknameAction'
import type { CursorPagedResult } from '@/types/plant'

interface UpdateNicknameVariables {
  id: string
  nickname: string
}

interface UpdateNicknameContext {
  previousData?: InfiniteData<CursorPagedResult>
}

export const useUpdatePlantNickname = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateNicknameVariables, UpdateNicknameContext>({
    mutationFn: async ({ id, nickname }) => {
      const formData = new FormData()
      formData.set('id', id)
      formData.set('nickname', nickname)
      await updatePlantNicknameAction(formData)
    },

    onMutate: async ({ id, nickname }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.lists() })

      // 이전 데이터 저장 (롤백용)
      const previousData = queryClient.getQueryData<InfiniteData<CursorPagedResult>>(
        queryKeys.plants.lists()
      )

      // 무한 쿼리 캐시 낙관적 업데이트
      queryClient.setQueriesData<InfiniteData<CursorPagedResult>>(
        { queryKey: queryKeys.plants.lists() },
        (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((plant) =>
                plant.id === id ? { ...plant, nickname } : plant
              ),
            })),
          }
        }
      )

      return { previousData }
    },

    onError: (error, _vars, context) => {
      console.error('닉네임 수정 실패:', error)
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
