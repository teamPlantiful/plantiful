import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/utils/supabase/helpers'

export async function POST(request: NextRequest) {
  const { supabase, user } = await requireAuth()

  const { token, platform, userAgent } = await request.json()

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const { error } = await supabase.from('push_tokens').upsert(
    {
      user_id: user.id,
      token,
      platform: platform ?? null,
      user_agent: userAgent ?? null,
      is_active: true,
    },
    {
      onConflict: 'token',
    }
  )

  if (error) {
    console.error('[push-tokens] upsert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
