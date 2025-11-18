'use client'

import { updatePassword } from '@/app/actions/auth/updatePassword'
import { useState, useTransition } from 'react'
import Button from '@/components/common/button'
import Input from '@/components/common/Input'

export default function UpdatePasswordForm() {
  const [msg, setMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData();
    formData.set('currentPassword', currentPassword)
    formData.set('newPassword', newPassword)
    formData.set('confirmPassword', confirmPassword)
  
    // 서버 응답 중 UI 깜빡임 방지를 위해 useTransition 사용.
    startTransition(async () => {
      const result = await updatePassword(formData)

      // 에러 발생 시, 에러 메세지 출력
      if (result.error) {
        setMsg(result.error)
      }
      // 성공 시, 변경 완료 문구 출력
      else if (result.success) {
        setMsg(result.success)
        setTimeout(() => setMsg(null), 3000) // 3초 뒤 메시지 사라짐
        
        // 입력칸 초기화
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    })
  }

  return (            
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="space-y-2">
      <label
        htmlFor="currentPassword"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >현재 비밀번호
      </label>
      <Input
        size="sm"
        id="currentPassword"
        /* name="currentPassword" // 기본 폼일때 사용 가능 */
        type="password"
        placeholder="••••••••"
        className="mt-2"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <label
        htmlFor="newPassword"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >새 비밀번호
      </label>
      <Input
        size="sm"
        id="newPassword"
        /* name="newPassword" // 기본 폼일때 사용 가능 */
        type="password"
        placeholder="••••••••"
        className="mt-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <label
        htmlFor="confirmPassword"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >새 비밀번호 확인
      </label>
      <Input
        size="sm"
        id="confirmPassword"
        /* name="confirmPassword" // 기본 폼일때 사용 가능 */
        type="password"
        placeholder="••••••••"
        className="mt-2"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>
    <Button 
      variant="default"
      className="w-full bg-primary hover:bg-primary/90"
      type="submit"
      disabled={isPending}
    >{isPending ? '변경 중...' : '비밀번호 변경'}                
    </Button>
    {msg && (
      <p className={`mt-2 text-sm ${msg.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>
        {msg}
      </p>
    )}
  </form>)
}
