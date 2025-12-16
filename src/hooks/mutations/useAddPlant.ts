import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { PlantData, Plant, CursorPagedResult } from '@/types/plant'
import addPlantAction from '@/app/actions/plant/addPlantAction'
import { monthsToDays } from '@/utils/generateDay'
import { addDays, normalizeToMidnight, toDateOnlyISO } from '@/utils/date'
import { toast } from '@/store/useToastStore'
import { notifyInApp } from '@/utils/notifyInApp'
import type { NotificationEvent } from '@/types/notification'
interface AddPlantContext {
  tempId: string
  tempCoverImageUrl?: string
  tempDefaultImageUrl?: string
  previousQueries: [any, InfiniteData<CursorPagedResult> | undefined][]
}

const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const calcNextWateringDate = (lastWateredAt: Date, wateringDays: number): string => {
  const base = normalizeToMidnight(lastWateredAt)
  const next = addDays(base, wateringDays)
  return toDateOnlyISO(next)
}

export const useAddPlant = () => {
  const queryClient = useQueryClient()

  return useMutation<Plant, Error, PlantData, AddPlantContext>({
    mutationFn: async (plantData: PlantData) => {
      const formData = new FormData()

      if (plantData.uploadedImage) {
        formData.append('file', plantData.uploadedImage)
      }

      const { uploadedImage, lastWateredDate, startDate, ...rest } = plantData
      const dataToSend = {
        ...rest,
        lastWateredDate: lastWateredDate.toISOString(),
        startDate: startDate.toISOString(),
      }
      formData.append('data', JSON.stringify(dataToSend))

      return await addPlantAction(formData)
    },

    onMutate: async (plantData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.lists() })

      // 모든 매칭되는 쿼리의 이전 데이터 저장 (롤백용)
      const previousQueries = queryClient.getQueriesData<InfiniteData<CursorPagedResult>>({
        queryKey: queryKeys.plants.lists(),
      })

      const tempId = generateTempId()

      // Data URL 생성
      let tempCoverImageUrl: string | undefined
      let tempDefaultImageUrl: string | undefined

      // 사용자 업로드 이미지 → Data URL
      if (plantData.uploadedImage) {
        tempCoverImageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(plantData.uploadedImage!)
        })
      }

      // API 이미지는 원본 URL 사용
      if (plantData.species.imageUrl && !plantData.uploadedImage) {
        tempDefaultImageUrl = plantData.species.imageUrl
      }

      const now = new Date().toISOString()
      const lastWateredAt = toDateOnlyISO(plantData.lastWateredDate)
      const adoptedAt = plantData.startDate.toISOString()

      const optimisticPlant: Plant = {
        id: tempId,
        userId: 'temp-user',
        cntntsNo: plantData.species.cntntsNo,
        koreanName: plantData.species.koreanName,
        scientificName: plantData.species.scientificName || null,
        defaultImageUrl: tempDefaultImageUrl || plantData.species.imageUrl || null,
        coverImageUrl: tempCoverImageUrl || null,
        nickname: plantData.nickname,
        wateringIntervalDays: plantData.wateringInterval,
        fertilizerIntervalDays: monthsToDays(plantData.fertilizerInterval),
        repottingIntervalDays: monthsToDays(plantData.repottingInterval),
        adoptedAt,
        lastWateredAt,
        nextWateringDate: calcNextWateringDate(
          plantData.lastWateredDate,
          plantData.wateringInterval
        ),
        lightDemandCode: plantData.species.careInfo?.lightDemandCode || null,
        waterCycleCode: plantData.species.careInfo?.waterCycleCode || null,
        temperatureCode: plantData.species.careInfo?.temperatureCode || null,
        humidityCode: plantData.species.careInfo?.humidityCode || null,
        createdAt: now,
        updatedAt: now,
      }

      // 무한 쿼리 캐시 낙관적 업데이트
      queryClient.setQueriesData<InfiniteData<CursorPagedResult>>(
        { queryKey: queryKeys.plants.lists() },
        (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page, index) => {
              // 첫 페이지에만 새 식물 추가
              if (index === 0) {
                return {
                  ...page,
                  items: [optimisticPlant, ...page.items],
                }
              }
              return page
            }),
          }
        }
      )

      return { tempId, tempCoverImageUrl, tempDefaultImageUrl, previousQueries }
    },

    onSuccess: (createdPlant) => {
      const nickname = createdPlant.nickname ?? '새 식물'

      notifyInApp({
        title: `${nickname} 등록 완료 🌱`,
        body: '새 식물이 식물 목록에 추가되었어요.',
        toastMessage: `${nickname} 등록 완료`,
        toastType: 'success',
        event: 'PLANT_CREATED' satisfies NotificationEvent, // 🔸 NotificationEvent에 'CREATED' 추가 필요
        plantId: createdPlant.id,
      })
      // 서버 데이터로 즉시 refetch (올바른 정렬 순서 적용)
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.lists() })
    },

    onError: (error, _variables, context) => {
      console.error('식물 등록 실패:', error)
      toast('식물 등록에 실패했습니다.', 'error')
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
