import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 페이지를 URL에 넣어서 들어올 수 없음.
export async function GET(request: Request) {
  const url = new URL('/authError', request.url) // ← 절대 URL 자동 생성
  return NextResponse.redirect(url)
}

export async function POST() {
  // 비밀번호 재설정 후, 쿠키 지움. (링크 재사용 불가를 위해)
  const cookieStore = await cookies()
  cookieStore.delete('reset_flow')

  return NextResponse.json({ ok: true })
}
