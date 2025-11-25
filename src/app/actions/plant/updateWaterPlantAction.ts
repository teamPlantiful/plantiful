'use server'

import { requireAuth } from '@/utils/supabase/helpers'
import { revalidatePath } from 'next/cache'

export async function updateWaterPlantAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')

  if (!id) {
    throw new Error('잘못된 요청입니다.')
  }

  const { supabase, user } = await requireAuth()

  const now = new Date().toISOString()

  const { error } = await supabase
    .from('plants')
    .update({
      last_watered_at: now,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message ?? '물주기 업데이트에 실패했습니다.')
  }

  revalidatePath('/')
}
