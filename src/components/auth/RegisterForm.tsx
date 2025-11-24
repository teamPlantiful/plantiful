'use client'

import Button from '@/components/common/button'
import Input from '@/components/common/input'
import { Card, CardContent, CardHeader } from '@/components/common/card'
import { Leaf } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signUp, signInWithPassword } from '@/app/apis/supabaseClient'

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 이메일 양식
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // 비밀번호 양식
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(password)
  }

  // 회원가입 완료되면 메인으로 이동
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 기본 닉네임 식집사 설정
    const userName = name.trim() === '' ? '식집사' : name

    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }

    if (!validatePassword(password)) {
      setError('비밀번호는 8자 이상이며, 영문과 숫자를 포함해야 합니다.')
      return
    }

    // 비밀번호 일치 검사
    if (password !== checkPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    const { error: signUpError } = await signUp(email, password, userName)

    // 회원가입 시 에러 발생하면 에러 메세지 출력
    if (signUpError) {
      setLoading(false)
      // 중복 이메일 체크
      if (signUpError.message === 'User already registered') {
        setError('이미 등록된 이메일입니다.')
      } else {
        // 기타 에러
        setError(`회원가입 중 에러가 발생했습니다. ${signUpError.message}`)
      }

      return
    }

    const { error: signInError } = await signInWithPassword(email, password)

    setLoading(false)

    // 자동 로그인 실패 시 에러 메세지 출력
    if (signInError) {
      setError(`로그인 중 에러가 발생했습니다. ${signInError.message}`)
      return
    }

    // 로그인 성공 시, 메인 페이지로 이동
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Plantiful</h1>
          </div>
          <p className="text-muted-foreground">당신의 반려식물을 더 건강하게</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <span className="text-2xl font-bold">회원가입</span>
            <p className="pt-1 text-sm">새 계정을 만드세요</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  type="text"
                  placeholder="식집사"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  type="password"
                  placeholder="••••••••"
                  required
                  value={checkPassword}
                  onChange={(e) => setCheckPassword(e.target.value)}
                />
              </div>

              {/* 에러 메세지 출력 */}
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                disabled={loading}
              >
                {loading ? '가입 중...' : '회원가입'}
              </Button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
              </div>

              <div className="text-center text-sm mt-8">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-primary hover:underline cursor-pointer"
                >
                  이미 계정이 있으신가요? 로그인하기
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
