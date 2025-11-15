'use client'

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut } from 'lucide-react';
import Button from '@/components/common/button';

export default function LogoutButton() {
  const router = useRouter();
  const signOut = useAuthStore((userState) => userState.signOut);

  // 슈퍼베이스와 연동된 zustand를 이용해서 로그아웃 후 로그인 페이지로 돌아가는 핸들러
  const logout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <Button
      variant="outline"
      className="w-full border-destructive bg-destructive-foreground text-destructive hover:bg-destructive/10"
      onClick={logout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      로그아웃
    </Button>
  );
}