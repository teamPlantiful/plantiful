import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/utils/supabase/helpers'
import { fromDbFormat } from '@/utils/plant'
import { normalizeSearch, isChosungOnly } from '@/utils/normalizeSearch'
import { addDays } from '@/utils/date'
import type { Plant } from '@/types/plant'

const TABLE_NAME = 'plants'
type SortKey = 'water' | 'name' | 'recent'

// GET /apis/plants - 식물 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQ = (searchParams.get('q') ?? '').trim()
    const sortParam = (searchParams.get('sort') as SortKey | null) ?? 'recent'
    const sort: SortKey = sortParam

    // 검색어 정규화
    const { original: searchWord } = normalizeSearch(rawQ)
    const useChosungSearch = isChosungOnly(searchWord)

    const { user, supabase } = await requireAuth()

    let query = supabase.from(TABLE_NAME).select('*').eq('user_id', user.id)

    if (searchWord && !useChosungSearch) {
      query = query.or(
        `nickname.ilike.%${searchWord}%,korean_name.ilike.%${searchWord}%,scientific_name.ilike.%${searchWord}%`
      )
    }

    // 기본 정렬
    if (sort === 'recent') {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) throw error

    const rawPlants = (data ?? []).map(fromDbFormat) as Plant[]

    let plants = rawPlants
    //추가 정렬
    if (sort === 'name') {
      plants.sort((a, b) => a.nickname.localeCompare(b.nickname))
    } else if (sort === 'water') {
      plants.sort((a, b) => {
        // 1) A의 다음 물주기 날짜 계산
        const nextA =
          a.nextWateringDate ??
          (a.lastWateredAt && a.wateringIntervalDays
            ? addDays(a.lastWateredAt, a.wateringIntervalDays)
            : null)

        // 2) B의 다음 물주기 날짜 계산
        const nextB =
          b.nextWateringDate ??
          (b.lastWateredAt && b.wateringIntervalDays
            ? addDays(b.lastWateredAt, b.wateringIntervalDays)
            : null)

        // 3) 숫자 비교를 위해 timestamp로 변환 (없으면 Infinity → 맨 뒤)
        const aTime = nextA ? new Date(nextA).getTime() : Number.POSITIVE_INFINITY
        const bTime = nextB ? new Date(nextB).getTime() : Number.POSITIVE_INFINITY

        return aTime - bTime
      })
    }

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
