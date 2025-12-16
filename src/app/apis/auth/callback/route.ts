import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const supabase = await createClient()

  if (!code) {
    return NextResponse.redirect(new URL('/authError', request.url))
  }

  // supabase에서 제공해주는 magic link 코드로 세션 생성
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/authError', request.url))
  }

  return NextResponse.redirect(new URL('/', request.url))
}