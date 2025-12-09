'use client'

import { useState, useTransition, useRef } from 'react'
import updateProfiles from '@/app/actions/auth/updateProfiles'
import Button from '@/components/common/button'
import Input from '@/components/common/input'

type Props = {
  initialUserName: string
}

export default function UpdateProfilesForm({ initialUserName }: Props) {
  const [msg, setMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false) // 수정 모드

  const formRef = useRef<HTMLFormElement>(null) // DOM 요소 접근

  const handleAction = (formData: FormData) => {

    let userName = formData.get('userName')?.toString() || ''

    // 비어있다면 '식집사'
    userName = userName.trim() === '' ? '식집사' : userName.trim()
    formData.set('userName', userName)
      
    // 서버 응답 중 UI 깜빡임 방지를 위해 useTransition 사용.
    startTransition(async () => {
      const result = await updateProfiles(formData)

      // 에러 발생 시, 에러 메세지 출력
      if (result.error) {
        setMsg(result.error)
      }
      // 성공 시, 변경 완료 문구 출력
      else if (result.success) {
        setMsg(result.success)
        // 수정 모드 종료
        setIsEditing(false)
        // 3초 뒤에는 완료 문구 사라짐
        setTimeout(() => setMsg(null), 3000)
      }
    })
  }

  return (
    <form 
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault() // 폼 초기화 방지
        const formData = new FormData(e.currentTarget)
        handleAction(formData)
      }} 
      className="space-y-4"
    >
      <div className="space-y-2">
        <label
          htmlFor="userName"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          닉네임
        </label>
        <div className="pt-2 flex gap-2">
          <div className="flex-1">
            <Input
              size="sm"
              id="userName"
              name="userName"
              placeholder="식집사"
              defaultValue={initialUserName}
              disabled={!isEditing || isPending}
            />
          </div>
          {isEditing ? (
            /* 수정 모드 */
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90"
              type="button"
              onClick={() => formRef.current?.requestSubmit()} // 제출 이벤트 할당
              disabled={isPending}
            >
              {isPending ? '저장 중...' : '저장'}
            </Button>
          ) : (
            /* 기본 모드 */
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              수정
            </Button>
          )}
        </div>
        {msg && (
          <p className={`text-sm ${msg.includes('성공') ? 'text-green-500' : 'text-red-500'}`}>
            {msg}
          </p>
        )}
      </div>
    </form>
  )
}
