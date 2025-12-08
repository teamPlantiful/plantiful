import { NextResponse } from 'next/server'
import { requireAuth } from '@/utils/supabase/helpers'
import { fromDbFormat } from '@/utils/plant'

const TABLE_NAME = 'plants'

// GET /apis/plants - 식물 목록 조회
export async function GET() {
  try {
    const { user, supabase } = await requireAuth()

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

    // 인증 에러
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 그 외 에러
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '식물 목록을 가져오는 데 실패했습니다.' },
      { status: 500 }
    )
  }
}
