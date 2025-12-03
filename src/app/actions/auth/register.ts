'use server'

import { cookies } from 'next/headers'
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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/apis/auth/callback`,
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

  const responseCookies = await cookies()
  responseCookies.set({
    name: "pending_email",
    value: email,
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 10,
  })

  console.log("signUpError:", signUpError)
  return { success: "이제 이메일 인증을 진행해 주세요!" }
}