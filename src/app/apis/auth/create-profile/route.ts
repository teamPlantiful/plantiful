import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
  const supabase = await createClient()

  // 현재 로그인 유저 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 })
  }

  // 기존 프로필 확인
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 없으면 DB에 프로필 저장
  if (!existingProfile) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? '식집사',
    })
  }

  return NextResponse.json({ ok: true })
}