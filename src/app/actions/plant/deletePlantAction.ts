'use server'

import { requireAuth } from '@/utils/supabase/helpers'
import { revalidatePath } from 'next/cache'

export async function deletePlantAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')

  if (!id) {
    throw new Error('삭제할 식물 정보가 없습니다.')
  }

  const { supabase, user } = await requireAuth()

  const { error } = await supabase.from('plants').delete().eq('id', id).eq('user_id', user.id)

  if (error) {
    throw new Error(error.message || '식물 삭제에 실패했습니다.')
  }

  revalidatePath('/')
}
