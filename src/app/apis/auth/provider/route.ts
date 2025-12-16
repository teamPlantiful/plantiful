import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 페이지를 URL에 넣어서 들어올 수 없음.
export async function GET(request: Request) {
  const url = new URL('/apis/auth/authError', request.url) // ← 절대 URL 자동 생성
  return NextResponse.redirect(url)
}

// OAuth 버튼 클릭 시 먼저 provider 생성
export async function POST(request: Request) {
  const { provider } = await request.json()

  if (provider !== 'google' && provider !== 'kakao') {
    return NextResponse.json(
      { error: '제공되지 않은 플랫폼입니다.' },
      { status: 400 }
    )  }

  const cookieStore = await cookies()
  cookieStore.set('current_provider', provider, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  })

  return NextResponse.json({ success: true })
}