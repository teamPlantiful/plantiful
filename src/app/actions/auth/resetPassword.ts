'use server'

import { createClient } from '@/utils/supabase/server'

export async function resetPassword(formData: FormData) {
  // 폼에서 입력한 비밀번호 받아오기
  const newPassword = formData.get('newPassword') as string
  
  // 서버 측 클라이언트 생성 후, 비밀번호 재설정
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword!,
  })

  if (error) {
    return { error: "비밀번호 재설정에 실패하였습니다." }
  }

  return { success: `비밀번호가 성공적으로 재설정되었습니다! \n 잠시 후 메인 화면으로 이동합니다.` }
}