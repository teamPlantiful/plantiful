'use server'

import type { Plant } from '@/types/plant'
import { fromDbFormat } from '@/utils/plant'
import { createClient } from '@/utils/supabase/server'

interface WaterPlantInput {
  id: string
  lastWateredAt: string
}

export async function updateWaterPlantAction({
  id,
  lastWateredAt,
}: WaterPlantInput): Promise<Plant> {
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
      last_watered_at: lastWateredAt,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? '물주기 업데이트에 실패했습니다.')
  }

  return fromDbFormat(data)
}
