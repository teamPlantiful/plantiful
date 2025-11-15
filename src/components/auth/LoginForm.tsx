'use client'

import Button from '@/components/common/button';
import Input from '@/components/common/Input';
import { Card, CardContent, CardHeader } from '@/components/common/card'; 
import { Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithPassword } from '@/app/apis/supabaseClient';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // 이메일 양식
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 비밀번호 양식
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // 폼 이벤트 및 기본값 초기화
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    // 비밀번호 유효성 검사
    if (!validatePassword(password)) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setLoginLoading(true);
    const { error: loginError } = await signInWithPassword(email, password);
    setLoginLoading(false);

    if (loginError) {
      // 이메일 또는 비밀번호 불일치 시
      if (loginError.message.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }
      // 기타 에러
      setError('로그인 중 문제가 발생했습니다.');
      return;
    }

    router.replace('/')
  };

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
            <span className="text-2xl font-bold">로그인</span>
            <p className="pt-1 text-sm">계정에 로그인하세요</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이메일 입력 */}
              <div className="pb-1">
                <label 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email"
                >이메일
                </label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // 추후, 최적화 작업 필요.
                  required
                />
              </div>
              {/* 비밀번호 입력 */}
              <div className="pb-3">
                <label 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="password">비밀번호</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* 에러 메세지 */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                disabled={loginLoading}
              >{loginLoading ? '로그인 중...' : '로그인'}
              </Button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
              </div>

              <div className="text-center text-sm mt-8">
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="text-primary hover:underline cursor-pointer"
                >계정이 없으신가요? 회원가입하기
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}