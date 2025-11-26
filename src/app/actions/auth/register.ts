'use server'

import { createClient } from '@/utils/supabase/server'

export async function register(formData: FormData) {
  // 폼에서 회원가입 데이터 받아오기
  const name = (formData.get('name') as string)?.trim()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const userName = name === "" ? "식집사" : name

  // 서버 측 클라이언트 생성 후, 회원가입 진행
  const supabase = await createClient()
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: userName
      }
    }
  })

  if (signUpError) {
    if (signUpError.message.includes("User already registered")) {
      return { error: "이미 등록된 이메일입니다." }
    }
    return { error: "회원가입 중 문제가 발생했습니다." }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return { error: "로그인 중 문제가 발생했습니다." }
  }

  return { success: true }
}