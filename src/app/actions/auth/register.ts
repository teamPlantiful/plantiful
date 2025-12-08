'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function register(formData: FormData) {

  const name = (formData.get('name') as string)?.trim()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const userName = name === "" ? "식집사" : name

  const supabase = await createClient()

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/apis/auth/callback`,
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