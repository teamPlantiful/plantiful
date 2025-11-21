import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. request 쿠키 업데이트
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

          // 2. response 재생성 (업데이트된 request 사용)
          supabaseResponse = NextResponse.next({
            request,
          })

          // 3. response 쿠키 설정 (브라우저로 전송)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 토큰 갱신 트리거 (getUser 호출 시 자동으로 만료된 토큰 갱신)
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, etc in public folder
     * - actions, apis (server actions and API routes handle auth themselves)
     */
    '/((?!_next/static|_next/image|favicon.ico|actions|apis|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
