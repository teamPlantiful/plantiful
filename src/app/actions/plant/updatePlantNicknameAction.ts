'use server'

import type { Plant } from '@/types/plant'
import { fromDbFormat } from '@/utils/plant'
import { requireAuth } from '@/utils/supabase/helpers'
import { revalidatePath } from 'next/cache'

export async function updatePlantNicknameAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  const nickname = String(formData.get('nickname') ?? '').trim()

  if (!id || !nickname) {
    throw new Error('닉네임을 입력해주세요.')
  }

  const { supabase, user } = await requireAuth()

  const { data, error } = await supabase
    .from('plants')
    .update({ nickname })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? '닉네임 수정에 실패했습니다.')
  }

  revalidatePath('/')
}
