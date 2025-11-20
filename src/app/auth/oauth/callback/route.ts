import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return NextResponse.json({ error: '로그인 필요', status: 401 })

  // DB 프로필 확인
  const user = session.user
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? '식집사'
    })
  }

  return NextResponse.json({ session, profile })
}