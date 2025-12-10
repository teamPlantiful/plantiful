import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // 로그인된 사용자 가져오기
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ userName: null })
  }

  // DB 접근
  const { data: profileData } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  // 닉네임 반환
  return NextResponse.json({
    userName: profileData?.name ?? ''
  })
}