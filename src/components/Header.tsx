import { User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import NotificationBell from '@/components/notification/NotificationBell'
import { cookies, headers } from 'next/headers'

export default async function Header() {
  // 도메인 주소 변환
  const h = await headers()
  const host = h.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  // 라우트 핸들러의 getUser와 세션 일치를 위해 쿠키를 가져옴
  const cookieStore = await cookies()
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const res = await fetch(`${baseUrl}/apis/me`, {
    headers: {
      Cookie: cookieString, // 직접 쿠키를 넣어줌
    },
  })

  const { userName } = await res.json()

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4 shadow-soft">
      <div className="max-w-200 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Image
            src="/plantiful-logo.webp"
            alt="Plantiful Logo"
            width={36}
            height={36}
            priority
            className="rounded-full select-none"
          />
          <h1
            className="text-2xl text-primary cursor-default select-none"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Plantiful
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/mypage" aria-label="마이페이지">
            {userName && <span className="text-sm text-muted-foreground">{userName} 님</span>}
            <NotificationBell />
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
