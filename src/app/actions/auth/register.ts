'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function register(formData: FormData) {

  const name = (formData.get('name') as string)?.trim()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const userName = name === "" ? "식집사" : name

  // 중복 검사용 admin 클라이언트 생성
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // admin 클라이언트로 테이블 비교 후, 중복 검사 실시.
  const { data: existingUser } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle()

  if (existingUser) {
    return { error: "이미 등록된 이메일입니다." }
  }

  // 중복 없으면 가입 진행 후 인증 메일 전송
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
    return { error: "회원가입 중 문제가 발생했습니다." }
  }

  return { success: "이제 이메일 인증을 진행해 주세요!" }
}