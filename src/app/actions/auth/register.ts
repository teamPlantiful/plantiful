'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function register(formData: FormData) {
  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin")  // 인증 요청 도메인
  const callbackUrl = `${origin}/apis/auth/callback`

  const name = (formData.get('name') as string)?.trim()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const userName = name === "" ? "식집사" : name

  const supabase = await createClient()

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackUrl,
      data: {
        name: userName
      }
    }
  })

  if (signUpError) {
    return { error: "회원가입 중 문제가 발생했습니다." }
  }

  return { success: "이제 이메일 인증을 진행해 주세요!" }
}