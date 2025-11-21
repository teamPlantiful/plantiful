'use server'

import { requireAuth } from '@/utils/supabase/helpers'

export default async function updatePassword(formData: FormData) {
  const newPassword = formData.get('newPassword')?.toString()
  const currentPassword = formData.get('currentPassword')?.toString()
  const confirmPassword = formData.get('confirmPassword')?.toString()

  // 비밀번호 양식
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(password)
  }

  // 값 입력 검증
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: '모든 항목을 입력해주세요.' }
  }
  // 유효성 검증
  if (!validatePassword(newPassword)) {
    return { error: '비밀번호는 8자 이상이며, 영문과 숫자를 포함해야 합니다.' }
  }
  // 비밀번호 확인 일치 여부 검증
  if (newPassword !== confirmPassword) {
    return { error: '설정할 비밀번호가 일치하지 않습니다.' }
  }

  const { user, supabase } = await requireAuth()
  if (!user.email) return { error: '사용자 정보를 불러 오지 못했습니다.' }
  // 현재 비밀번호가 일치하는 지 검증
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  if (signInError) return { error: '현재 비밀번호가 올바르지 않습니다.' }

  if (newPassword === currentPassword) return { error: '이전 비밀번호는 사용하실 수 없습니다.' }

  // 비밀번호 변경
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) return { error: '비밀번호가 변경되지 않았습니다.' }

  return { success: '비밀번호가 성공적으로 변경되었습니다.' }
}
