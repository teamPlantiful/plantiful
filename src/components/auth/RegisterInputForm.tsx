'use client'

import { useState, useTransition } from 'react'
import { register } from '@/app/actions/auth/register'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/button'
import Input from '@/components/common/input'

export default function RegisterForm() {
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
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(password)
  }

  // 회원가입 완료되면 메인으로 이동
  const handleAction = (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const checkPassword = formData.get('checkPassword') as string

    // 이메일 유효성 검증
    if (!validateEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      return
    }

    // 비밀번호 유효성 검증
    if (!validatePassword(password)) {
      setError("비밀번호는 8자 이상이며, 영문과 숫자를 포함해야 합니다.")
      return
    }

    // 비밀번호 일치 검사
    if (password !== checkPassword) {
      setError("설정할 비밀번호가 일치하지 않습니다.")
      return
    }

    // 폼 데이터 전송 때까지 리렌더 X
    startTransition(async () => {
      setError(null)
      const result = await register(formData)
    
      if (result?.error) {
        setError(result.error)
        return
      }
    
      // 회원가입 성공 시 새로고침 및 회원가입 폼 조건에 따라 메인으로 이동
      router.refresh()
    })
  }

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault() // 폼 초기화 방지
        const formData = new FormData(e.currentTarget)
        handleAction(formData)
      }}
      className="space-y-4"
    >
      {/* 닉네임 입력 */}
      <div className="pb-1">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="name"
        >
          닉네임
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="식집사"
        />
      </div>
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
          type="email"
          placeholder="name@example.com"
        />
      </div>
      {/* 비밀번호 입력 */}
      <div className="pb-1">
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
      {/* 비밀번호 확인 */}
      <div className="pb-3">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="checkPassword"
        >
          비밀번호 확인
        </label>
        <Input
          id="checkPassword"
          name="checkPassword"
          type="password"
          placeholder="••••••••"
        />
      </div>
      {/* 에러 메세지 */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
      {/* 회원가입 버튼 */}
      <Button 
        type="submit"
        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        disabled={isPending}
      >
        {isPending ? '가입 중...' : '회원가입'}
      </Button>
    </form>
  )
}