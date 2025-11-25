'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/app/actions/auth/logout'
import { LogOut } from 'lucide-react'
import Button from '@/components/common/button'

export default function LogoutButton() {
  const router = useRouter()

  // 서버 액션으로 로그아웃 후 로그인 화면으로 돌아감.
  const handleLogout = async () => {
    await logout()
    // 마이페이지와 중복 로직이지만, 마이페이지를 거치지 않고 login으로 가기 때문에 이쪽이 더 성능이 좋음.
    router.replace("/login")
  }

  return (
    <Button
      variant="outline"
      className="w-full border-destructive bg-destructive-foreground text-destructive hover:bg-destructive/10"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      로그아웃
    </Button>
  )
}