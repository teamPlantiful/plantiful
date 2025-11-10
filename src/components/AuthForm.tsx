'use client'

import { useState } from 'react';
import Button from '@/components/common/button';
import Input from '@/components/common/Input';
import { Card, CardContent, CardHeader } from '@/components/common/card'; 
import { Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  authMode?: 'login' | 'register';
}

export default function Auth({ authMode = 'login' }: AuthFormProps) {
  // useState로 로그인/회원가입 화면 나누기
  const [isLogin, setIsLogin] = useState(authMode === 'login');
  const router = useRouter();

  // 폼 이벤트 초기화 후 메인으로 돌아가기
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <span className="text-2xl font-bold">{isLogin ? '로그인' : '회원가입'}</span>
            <p className="pt-1 text-sm">
              {isLogin ? '계정에 로그인하세요' : '새 계정을 만드세요'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="pb-2">
                <label 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email">이메일</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="pb-3">
                <label 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="password">비밀번호</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  required
                />
              </div>
              {!isLogin && (
                <div className="pb-3">
                  <label 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="checkPassword">비밀번호 확인</label>
                  <Input 
                    id="checkPassword" 
                    type="password" 
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isLogin ? '로그인' : '회원가입'}
              </Button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
              </div>

              <div className="text-center text-sm mt-8">
                <button
                  type="button"
                  onClick={() => router.push(isLogin ? '/register' : '/login')}
                  className="text-primary hover:underline cursor-pointer"
                >
                  {isLogin ? '계정이 없으신가요? 회원가입하기' : '이미 계정이 있으신가요? 로그인하기'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}