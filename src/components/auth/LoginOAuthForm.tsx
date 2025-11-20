'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/utils/supabase/clientOnly';
import Button from '@/components/common/button';

export default function LoginOAuthForm() {
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' /* | 'kakao' */) => {
    setLoading(true);
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`, // 최종 리다이렉트. Supabase에 등록 필요
        },
      });

      if (error) {
        console.error('OAuth 로그인 오류:', error.message);
        return;
      }

      if (data?.url) {
        // Supabase OAuth 페이지로 이동
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        onClick={() => handleSocialLogin('google')}
        disabled={loading}
      >
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
  );
}