'use server'

import type { Plant } from '@/types/plant'
import { fromDbFormat } from '@/utils/plant'
import { createClient } from '@/utils/supabase/server'

interface UpdateNicknameInput {
  id: string
  nickname: string
}

export async function updatePlantNicknameAction({
  id,
  nickname,
}: UpdateNicknameInput): Promise<Plant> {
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
    .update({ nickname })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? '닉네임 수정에 실패했습니다.')
  }

  return fromDbFormat(data)
}
