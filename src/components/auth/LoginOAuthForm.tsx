'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Button from '@/components/common/button'

export default function LoginOAuthForm() {
  const [error, setError] = useState<string | null>(null)
  type Provider = 'google' | 'kakao' | null
  const [loading, setLoading] = useState<Provider>(null)

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setError(null)
    setLoading(provider)

    const supabase = createClient()

    try {
      // 현재 들어간 로그인 플랫폼 저장 provider 보냄
      const res = await fetch('/apis/auth/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })

      if (!res.ok) {
        setError('로그인 플랫폼 판별 중 오류가 발생했습니다. 다시 시도해주세요.')
        return
      }

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/apis/auth/oauth/callback`,
        },
      })

      if (oauthError) {
        setError('소셜 로그인에 실패했습니다.')
        return
      }

      if (data?.url) {
        window.location.href = data.url
      } 
      else {
        setError('로그인 URL을 가져오지 못했습니다.')
      }
    } catch (e) {
      setError('네트워크 오류가 발생했습니다.')
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        onClick={() => handleSocialLogin('google')}
        disabled={loading !== null && loading !== 'kakao'}
      >
        <Image
          src="/google-logo.webp"
          alt="Google"
          width={18}
          height={18}
        />
        {loading === 'google' ? '로그인 중...' : 'Google로 로그인'}
      </Button>
      <Button
        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        onClick={() => handleSocialLogin('kakao')}
        disabled={loading !== null && loading !== 'google'}
      >
        <Image
          src="/kakao-logo.webp"
          alt="Kakao"
          width={18}
          height={18}
        />
        {loading === 'kakao' ? '로그인 중...' : 'Kakao로 로그인'}
      </Button>
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  )
}