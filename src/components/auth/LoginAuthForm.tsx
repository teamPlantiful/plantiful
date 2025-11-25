"use client"

import { useState, useTransition } from "react"
import { login } from "@/app/actions/auth/login"
import { useRouter } from "next/navigation"
import Button from "@/components/common/button"
import Input from "@/components/common/input"

export default function LoginAuthForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // 이메일 유효성 코드
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // 비밀번호 유효성 코드
  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  // 폼 데이터 입력 받아서 서버 액션 처리.
  const handleAction = (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // 이메일 유효성 검증
    if (!validateEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      return
    }

    // 비밀번호 유효성 검증
    if (!validatePassword(password)) {
      setError("비밀번호는 8자 이상이어야 합니다.")
      return
    }

    // 폼 데이터 전송 때까지 리렌더 X
    startTransition(async () => {
      setError(null)
      const result = await login(formData)

      if (result?.error) {
        setError(result.error)
        return
      }

      // 로그인 성공 시 새로고침 및 로그인 폼 조건에 따라 메인으로 이동
      router.refresh()
    })
  }

  return (
    <form onSubmit={(e) => {
        e.preventDefault() // 폼 초기화 방지
        const formData = new FormData(e.currentTarget)
        handleAction(formData)
      }}
      className="pb-3 space-y-4"
    >
      {/* 이메일 입력 */}
      <div className="pb-1">
        <label 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="email"
        >
          이메일
        </label>
        <Input 
          id="email" 
          name="email"
          type="text"
          placeholder="name@example.com"
        />
      </div>
      {/* 비밀번호 입력 */}
      <div className="pb-3">
        <label 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="password"
        >
          비밀번호
        </label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          placeholder="••••••••"
        />
      </div>
      {/* 에러 메세지 */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      {/* 로그인 버튼 */}
      <Button
        type="submit"
        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        disabled={isPending}
      >
        {isPending ? '로그인 중...' : '로그인'}
       </Button>
    </form>
  )
}