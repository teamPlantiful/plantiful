import { ArrowLeft, User, Lock, Smile } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/common/card'
import Button from '@/components/common/button'
import UpdateProfilesForm from '@/components/auth/UpdateProfileForm'
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'
import LogoutButton from '@/components/auth/LogoutButton'
import Link from 'next/link'
import Image from 'next/image'
import { cookies, headers } from 'next/headers'

export default async function Page() {
  // 도메인 주소 변환
  const h = await headers()
  const host = h.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`
  
  // 라우트 핸들러의 getUser와 세션 일치를 위해 쿠키를 가져옴
  const cookieStore = await cookies()
  const cookieString = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ')

  const res = await fetch(`${baseUrl}/apis/me`, {
    headers: {
      Cookie: cookieString, // 쿠키 삽입
    },
  })

  // fetch를 통해 유저 정보 불러옴
  const { userName, provider } = await res.json()

  // 소셜 로그인 여부 판단
  const isOAuthUser = provider !== 'email'

  // 소셜 로그인이면 로그인 플랫폼 보여줌
  const providerLabelMap: Record<string, string> = {
    google: 'Google 로그인 계정입니다.',
    kakao: 'Kakao 로그인 계정입니다.',
  }
  const providerLabel = providerLabelMap[provider]

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="max-w-200 mx-auto flex items-center gap-3">
          {/* 뒤로가기 버튼 */}
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          {/* 마이페이지 헤더 */}
          <div className="flex items-center gap-1">
            <Image
              src="/plantiful-logo.webp"
              alt="Plantiful Logo"
              width={30}
              height={30}
              className="rounded-full select-none"
            />
            <h1 className="text-lg font-bold text-primary select-none">마이페이지</h1>
          </div>
        </div>
      </div>

      <main className="max-w-xl mx-auto p-4 space-y-4 animate-fade-in">
        {/* 닉네임 변경 구역 */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-xl font-bold">프로필 설정</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <UpdateProfilesForm initialUserName={userName}/>
          </CardContent>
        </Card>
        {/* 소셜 로그인 시 보이는 구역 */}
        {isOAuthUser && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smile className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold">로그인 플랫폼</span>
              </div>
            </CardHeader>
          <CardContent className="pt-0 space-y-4 flex justify-center gap-2">
            <div>
              <Image
                src={`/${provider}-logo.webp`}
                alt={`${provider} Logo`}
                width={24}
                height={24}></Image>
            </div>
            <div>
              <span className="text-sm text-gray-600">{providerLabel}</span>
            </div>
          </CardContent>
        </Card>
        )}
        {/* 비밀번호 변경 구역 */}
        {!isOAuthUser && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold">비밀번호 변경</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <UpdatePasswordForm />
            </CardContent>
          </Card>
        )}
        <div className="my-6" />
        {/* 로그아웃 기능 */}
        <LogoutButton />
      </main>
    </div>
  )
}
