'use server'

import type { Plant } from '@/types/plant'
import { fromDbFormat } from '@/utils/plant'
import { createClient } from '@/utils/supabase/server'

interface UpdateIntervalsInput {
  id: string
  wateringDays: number
  fertilizerDays: number
  repottingDays: number
}

export async function updatePlantIntervalsAction({
  id,
  wateringDays,
  fertilizerDays,
  repottingDays,
}: UpdateIntervalsInput): Promise<Plant> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('인증되지 않은 사용자입니다.')
  }

  const { data, error } = await supabase
    .from('plants')
    .update({
      watering_interval_days: wateringDays,
      fertilizer_interval_days: fertilizerDays,
      repotting_interval_days: repottingDays,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? '주기 변경에 실패했습니다.')
  }

  return fromDbFormat(data)
}
