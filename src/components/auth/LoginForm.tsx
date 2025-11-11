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
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 폼 이벤트 및 기본값 초기화
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true); 

    const { data, error } = await signInWithPassword(email, password);

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return; // 로그인 실패 시 에러 메시지 표시
    }

    if (data?.session) {
      console.log('로그인 성공:', data.session.user);
      router.push('/'); // 로그인 성공 시 메인 페이지로 이동
    }
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
              <div className="pb-2">
                <label 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email">이메일</label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // 추후, 최적화 작업 필요.
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {errorMsg && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}
            
              <Button 
                type="submit" 
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >로그인</Button>

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