import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/utils/supabase/helpers'
import { fromDbFormat } from '@/utils/plant'
import { normalizeSearch, isChosungOnly } from '@/utils/normalizeSearch'

const TABLE_NAME = 'plants'
const DEFAULT_LIMIT = 10

type SortKey = 'water' | 'name' | 'recent'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQ = (searchParams.get('q') ?? '').trim()
    const sortParam = (searchParams.get('sort') as SortKey | null) ?? 'recent'
    const cursor = searchParams.get('cursor')
    const limitParam = searchParams.get('limit')
    const limit = parseInt(limitParam ?? String(DEFAULT_LIMIT), 10)
    const isCursorRequest = limitParam !== null

    const { original: searchWord } = normalizeSearch(rawQ)
    const useChosungSearch = isChosungOnly(searchWord)

    const { user, supabase } = await requireAuth()

    let query = supabase.from(TABLE_NAME).select('*').eq('user_id', user.id)

    if (searchWord && !useChosungSearch) {
      query = query.or(
        `nickname.ilike.%${searchWord}%,korean_name.ilike.%${searchWord}%,scientific_name.ilike.%${searchWord}%`
      )
    }

    if (sortParam === 'name') {
      query = query.order('nickname', { ascending: true }).order('id', { ascending: true })
      if (cursor) query = query.gt('nickname', cursor)
    } else if (sortParam === 'water') {
      query = query
        .order('next_watering_date', { ascending: true })
        .order('id', { ascending: true })
      if (cursor) query = query.gt('next_watering_date', cursor)
    } else {
      query = query.order('created_at', { ascending: false }).order('id', { ascending: false })
      if (cursor) query = query.lt('created_at', cursor)
    }

    // 3. 페이지네이션
    if (isCursorRequest) {
      query = query.limit(limit + 1)

      const { data, error } = await query
      if (error) throw error

      const hasNextPage = data.length > limit
      const items = data.slice(0, limit).map(fromDbFormat)

      let nextCursor: string | undefined
      const lastItem = items[items.length - 1]

      if (hasNextPage && lastItem) {
        if (sortParam === 'name') {
          nextCursor = lastItem.nickname
        } else if (sortParam === 'water') {
          nextCursor = lastItem.nextWateringDate ?? undefined
        } else {
          nextCursor = lastItem.createdAt
        }
      }

      return NextResponse.json({ items, nextCursor, hasNextPage })
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ plants: data.map(fromDbFormat) })
  } catch (error: any) {
    console.error('GET /apis/plants error:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch plants' }, { status: 500 })
  }
}
