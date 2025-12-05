'use client'

import { useState, useTransition } from 'react'
import { resetPassword } from '@/app/actions/auth/resetPassword'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/button'
import Input from '@/components/common/input'

export default function ResetPasswordInputForm() {
  const router = useRouter()
  const [msg, setMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // 비밀번호 양식
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(password)
  }
  
  const handleAction = (formData: FormData, form: HTMLFormElement) => {
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // 입력 필드 검증
    if (!newPassword || !confirmPassword) {
      setMsg("모든 항목을 입력해주세요.")
      return
    }
    // 비밀번호 유효성 검증
    if (!validatePassword(newPassword)) {
      setMsg("비밀번호는 8자 이상이며, 영문과 숫자를 포함해야 합니다.")
      return
    }
    // 비밀번호 확인 일치 여부 검증
    if (newPassword !== confirmPassword) {
      setMsg("설정할 비밀번호가 일치하지 않습니다.")
      return
    }

    // 서버 응답 중 UI 깜빡임 방지를 위해 useTransition 사용.
    startTransition(async () => {
      setMsg(null)
      const result = await resetPassword(formData)

      // 에러 발생 시, 에러 메세지 출력
      if (result.error) {
        setMsg(result.error)
      }
      // 성공 시, 변경 완료 문구 출력 후, 입력칸 초기화
      else if (result.success) {
        setMsg(result.success)
        form.reset()
        // 잠시 후 완료 문구 사라지고 메인 화면으로 이동.
        setTimeout(() => {
          setMsg(null)
        }, 3000)
        router.replace('/')
      }
    })
  }

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault() // 폼 초기화 방지
        const form = e.currentTarget
        const formData = new FormData(e.currentTarget)
        handleAction(formData, form)
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          새 비밀번호
        </label>
        <Input
          size="sm"
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          className="mt-2"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          새 비밀번호 확인
        </label>
        <Input
          size="sm"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="mt-2"
        />
      </div>
      <Button
        variant="default"
        className="w-full bg-primary hover:bg-primary/90"
        type="submit"
        disabled={isPending}
      >
        {isPending ? '변경 중...' : '비밀번호 변경'}
      </Button>
      {msg && (
        <p 
          className={`text-sm text-center ${msg.includes('성공') ? 'text-green-500' : 'text-red-500'}`}
          style={{ whiteSpace: 'pre-line' }} /* whitespace: pre-line으로 \n 줄바꿈 처리 */
        >
          {msg}
        </p>
      )}
    </form>
  )
}
