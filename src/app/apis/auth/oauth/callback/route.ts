import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/authError', requestUrl.origin))
  }

  const supabase = await createClient()

  // OAuth의 경우 세션 코드를 일치 시켜서 인증.
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/authError', requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}