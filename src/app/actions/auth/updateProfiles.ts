'use server'

import { createClient } from '@/utils/supabase/server'


export default async function updateProfiles(formData: FormData) {
  const newUserName = formData.get('userName')?.toString()
  const supabase = await createClient()

  // 로그인 유저 확인
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    return { error: '사용자 정보를 불러오지 못했습니다.' }
  }

  // DB 업데이트
  const { error } = await supabase
    .from('profiles')
    .update({ name: newUserName })
    .eq('id', user.id)

  if (error) {
    return { error: '닉네임 변경에 실패하였습니다.' }
  }

  return { success: '닉네임이 성공적으로 변경되었습니다.' }
}