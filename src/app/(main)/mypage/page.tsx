'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Leaf, User, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/common/card'
import Button from '@/components/common/button'
import Input from '@/components/common/Input'
import LogoutButton from '@/components/auth/LogoutButton'
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'

export default function Page() {
  const [nickname, setNickname] = useState('식집사')

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
            <Leaf className="w-6 h-6 text-primary" />
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
            <div className="space-y-2">
              <label
                htmlFor="nickname"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                닉네임
              </label>
              <div className="pt-2 flex gap-2">
                <div className="flex-1">
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    size="sm"
                  />
                </div>
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                  저장
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 비밀번호 변경 구역 */}
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
        <div className="my-6" />

        {/* 로그아웃 기능 */}
        <LogoutButton />
      </main>
    </div>
  )
}
