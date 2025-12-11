import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ArrowLeft, User, Lock, Smile } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/common/card'
import Button from '@/components/common/button'
import UpdateProfilesForm from '@/components/auth/UpdateProfileForm'
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'
import LogoutButton from '@/components/auth/LogoutButton'
import Image from 'next/image'

export default async function Page() {

  const supabase = await createClient()

  // 로그인한 유저 정보 불러옴
  const { data: { user } } = await supabase.auth.getUser()
  // 로그인 유저만 마이페이지 진입 가능
  if (!user) {
    redirect('/login')
  }
  // Supabase DB에서 닉네임 읽어오기
  const { data: profileData } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()
  // 현재 닉네임 표시를 Props를 통해 컴포넌트에 전달
  const currentUserName = profileData?.name ?? ''
  // 소셜 로그인 여부 판단
  const provider = user?.app_metadata?.provider || 'email'
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
        <div className="max-w-xl mx-auto flex items-center gap-3">
          {/* 뒤로가기 버튼 */}
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          {/* 마이페이지 헤더 */}
          <div className="flex items-center gap-2">
            <Image
              src="/plantiful-logo.webp"
              alt="Plantiful Logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <h1 className="text-lg font-bold text-primary">마이페이지</h1>
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
            <UpdateProfilesForm initialUserName={currentUserName}/>
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
