import LoginAuthForm from '@/components/auth/LoginAuthForm'
import LoginOAuthForm from '@/components/auth/LoginOAuthForm'
import { Card, CardContent, CardHeader } from '@/components/common/card'
import Link from 'next/link'
import Image from 'next/image'
import ForgotPasswordButton from '@/components/auth/ForgotPasswordButton'

export default function LoginForm() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1 mb-3">
            <Image
              src="/plantiful-logo.png"
              alt="Plantiful Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <h1
              className="text-3xl font-bold text-primary"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Plantiful
            </h1>
          </div>
          <p className="text-muted-foreground">당신의 반려식물을 더 건강하게</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <span className="text-2xl font-bold">로그인</span>
            <p className="pt-1 text-sm">계정에 로그인하세요</p>
          </CardHeader>
          <CardContent>
            <LoginAuthForm />
            <LoginOAuthForm />
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
            </div>

            <div className="text-center text-sm mt-8">
              {/* 비밀번호 찾기 버튼 */}
              <ForgotPasswordButton />
              <Link href="/register">
                <button type="button" className="text-primary hover:underline cursor-pointer">
                  계정이 없으신가요? 회원가입하기
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
