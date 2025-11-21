'use server'

import { createClient } from '@/utils/supabase/server'

export async function deletePlantAction(id: string): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('인증되지 않은 사용자입니다.')
  }

  const { error } = await supabase.from('plants').delete().eq('id', id).eq('user_id', user.id)

  if (error) {
    throw new Error(error.message || '식물 삭제에 실패했습니다.')
  }

  return id
}
