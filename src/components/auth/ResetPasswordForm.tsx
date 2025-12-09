import ResetPasswordInputForm from '@/components/auth/ResetPasswordInputForm'
import { Card, CardContent, CardHeader } from '@/components/common/card'
import Image from 'next/image'

export default function ResetPasswordForm() {
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
            <span className="text-2xl font-bold">비밀번호 재설정</span>
            <p className="pt-1 text-sm">설정할 비밀번호를 입력해주세요</p>
          </CardHeader>
          <CardContent>
            <ResetPasswordInputForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
