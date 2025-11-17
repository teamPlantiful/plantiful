import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { fromDbFormat } from '@/utils/plant'

const TABLE_NAME = 'plants'

// GET /apis/plants - 식물 목록 조회
export async function GET() {
  try {
    const supabase = await createClient()

    // 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 식물 목록 조회
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const plants = data.map(fromDbFormat)

    return NextResponse.json({ plants })
  } catch (error) {
    console.error('GET /apis/plants error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '식물 목록을 가져오는 데 실패했습니다.' },
      { status: 500 }
    )
  }
}
