"use server"

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  // 폼에서 로그인 데이터 받아오기
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 서버 측 클라이언트 생성 후, 로그인 진행
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "이메일 또는 비밀번호가 올바르지 않습니다." }
    }
    return { error: "로그인 중 문제가 발생했습니다." }
  }

  // 로그인 성공
  return { success: true }
}