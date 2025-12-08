'use server'

import { requireAuth } from '@/utils/supabase/helpers'

export default async function updateProfiles(formData: FormData) {
  
  const newUserName = formData.get('userName')?.toString()
  const { user, supabase } = await requireAuth()

  // DB 업데이트
  const { error } = await supabase
    .from('profiles')
    .update({ name: newUserName })
    .eq('id', user.id)

  if (error) {
    return { error: "닉네임 변경에 실패하였습니다." }
  }

  return { success: "닉네임이 성공적으로 변경되었습니다." }
}