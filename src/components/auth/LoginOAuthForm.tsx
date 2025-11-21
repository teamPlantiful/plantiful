'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Button from '@/components/common/button'

export default function LoginOAuthForm() {
  const [loading, setLoading] = useState(false)

  const handleSocialLogin = async (provider: 'google') => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/apis/auth/callback`,
        },
      })

      if (error) {
        console.error('OAuth 로그인 오류:', error.message)
        return
      }

      if (data?.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        onClick={() => handleSocialLogin('google')}
        disabled={loading}
      >
        <Image 
          src="/google-logo.png"
          alt="Google"
          width={18}
          height={18}
        />
        {loading ? '로그인 중...' : 'Google로 로그인'}
      </Button>
      {/* 
      <Button
        className="w-full bg-gray-800 text-white"
        onClick={() => handleSocialLogin('kakao')}
        disabled={loading}
      >
        {loading ? '로그인 중...' : 'Kakao로 로그인'}
      </Button>
      */}
    </div>
  )
}