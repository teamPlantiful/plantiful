'use client'

import { useState, useTransition } from 'react'
import { sendResetEmail } from '@/app/actions/auth/sendResetEmail'
import Button from '@/components/common/button'
import Input from '@/components/common/input'

export default function ForgotPasswordInputForm() {
  const [msg, setMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // 이메일 유효성 코드
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleAction = (formData: FormData) => {
    const email = formData.get('email') as string
  
    // 이메일 유효성 검증
    if (!validateEmail(email)) {
      setMsg("올바른 이메일 형식을 입력해주세요.")
      return
    }

    // 폼 데이터 전송 때까지 리렌더 X
    startTransition(async () => {
      setMsg(null)
      const result = await sendResetEmail(formData)
    
      if (result?.error) {
        setMsg(result.error)
        return
      }
      
      if (result?.success) {
        setMsg(result.success)
      }
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
      {/* 상태 메세지 */}
      {msg && (
        <p className={`text-sm text-center ${msg.includes('발송되었습니다') ? 'text-green-500' : 'text-red-500'}`}>
          {msg}
        </p>
      )}
      {/* 회원가입 버튼 */}
      <Button 
        type="submit"
        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        disabled={isPending}
      >
        {isPending ? '발송 중...' : '링크 발송'}
      </Button>
    </form>
  )
}