'use server'

import { requireAuth } from '@/utils/supabase/helpers'

export default async function updatePassword(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string

  const { user, supabase } = await requireAuth()
  if (!user.email) return { error: "사용자 정보를 불러 오지 못했습니다." }
  
  // 현재 비밀번호가 일치하는 지 검증
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  // 현재 비밀번호 검증
  if (signInError) return { error: "현재 비밀번호가 올바르지 않습니다." }

  // 동일 비밀번호 검증
  if (newPassword === currentPassword) return { error: "이전 비밀번호는 사용하실 수 없습니다." }

  // 비밀번호 변경
  const { error } = await supabase.auth.updateUser({
    password: newPassword!,
  })

  if (error) return { error: "비밀번호가 변경 중 문제가 발생했습니다." }

  return { success: "비밀번호가 성공적으로 변경되었습니다." }
}
