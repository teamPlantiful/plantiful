import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const supabase = await createClient()

  // 이메일 코드 없이 접근 시, authError 페이지로 이동
  if (!code) {
    return NextResponse.redirect(new URL('/authError', request.url))
  }

  // supabase에서 제공해주는 magic link 코드로 세션 생성
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  // 세션 생성에 실패했을 경우, authError 페이지로 이동
  if (error) {
    return NextResponse.redirect(new URL('/authError', request.url))
  }

  // 비밀번호 재설정 페이지로 콜백하면서 쿠키 부여
  const cookieStore = await cookies()
  cookieStore.set('reset_flow', 'true', {
    httpOnly: true,
    maxAge: 60 * 5, // 5분
    path: '/',
  })

  return NextResponse.redirect(new URL('/account/reset-password', request.url))
}