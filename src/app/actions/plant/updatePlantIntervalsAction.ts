'use server'

import { requireAuth } from '@/utils/supabase/helpers'
import { revalidatePath } from 'next/cache'
import { clamp, monthsToDays } from '@/utils/generateDay'

export async function updatePlantIntervalsAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  const wateringInterval = Number(formData.get('wateringInterval') ?? 0)
  const fertilizerIntervalMonth = Number(formData.get('fertilizerIntervalMonth') ?? 0)
  const repottingIntervalMonth = Number(formData.get('repottingIntervalMonth') ?? 0)

  if (!id) {
    throw new Error('인증되지 않은 사용자입니다.')
  }

  const wateringDays = clamp(wateringInterval || 1, 1)
  const fertilizerDays = monthsToDays(clamp(fertilizerIntervalMonth || 1, 1))
  const repottingDays = monthsToDays(clamp(repottingIntervalMonth || 1, 1))

  const { supabase, user } = await requireAuth()

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

  revalidatePath('/')
}
