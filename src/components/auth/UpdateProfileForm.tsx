'use client'

import { useState, useTransition } from 'react'
import Button from '@/components/common/button'
import Input from '@/components/common/input'
import updateProfiles from '@/app/actions/auth/updateProfiles'

type Props = {
  initialUserName: string
}

export default function UpdateProfilesForm({ initialUserName }: Props) {
  const [msg, setMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [userName, setUserName] = useState(initialUserName)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 닉네임 칸이 비어있을 경우 기본으로 식집사 적용.
    const isUserName = userName.trim() === '' ? '식집사' : userName.trim()
    const formData = new FormData()
    formData.set('userName', isUserName)

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
        setTimeout(() => setMsg(null), 3000) // 3초 뒤 메시지 사라짐
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
              /* name="userName" // 기본 폼일때 사용 가능 */
              placeholder="식집사"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <Button
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90"
            type="submit"
            disabled={isPending}
          >
            {isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
        {msg && (
          <p className={`text-sm ${msg.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>
            {msg}
          </p>
        )}
      </div>
    </form>
  )
}
