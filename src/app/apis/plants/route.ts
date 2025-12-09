import { NextResponse } from 'next/server'
import { requireAuth } from '@/utils/supabase/helpers'
import { fromDbFormat } from '@/utils/plant'
import { NextRequest } from 'next/server'

const TABLE_NAME = 'plants'
const DEFAULT_LIMIT = 10

export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth()
    const searchParams = request.nextUrl.searchParams

    const cursor = searchParams.get('cursor')
    const sortParam = searchParams.get('sort')
    const limitParam = searchParams.get('limit')

    const isCursorRequest = limitParam !== null
    const limit = parseInt(limitParam ?? String(DEFAULT_LIMIT), 10)

    let query = supabase.from(TABLE_NAME).select('*').eq('user_id', user.id)

    if (sortParam === 'name') {
      query = query.order('nickname', { ascending: true })
      if (cursor) query = query.gt('nickname', cursor)
    } else if (sortParam === 'water') {
      query = query.order('next_watering_date', { ascending: true })
      if (cursor) query = query.gt('next_watering_date', cursor)
    } else {
      query = query.order('created_at', { ascending: false })
      if (cursor) query = query.lt('created_at', cursor)
    }

    if (isCursorRequest) {
      query = query.limit(limit + 1)

      const { data, error } = await query
      if (error) throw error

      const hasNextPage = data.length > limit
      const items = data.slice(0, limit).map(fromDbFormat)

      const lastItem = items[items.length - 1]
      let nextCursor = undefined

      if (hasNextPage && lastItem) {
        if (sortParam === 'name') nextCursor = lastItem.nickname
        else if (sortParam === 'water')
          nextCursor = lastItem.nextWateringDate 
        else nextCursor = lastItem.createdAt
      }

      return NextResponse.json({
        items,
        nextCursor,
        hasNextPage,
      })
    } else {
      const { data, error } = await query
      if (error) throw error
      return NextResponse.json({ plants: data.map(fromDbFormat) })
    }
  } catch (error) {
    console.error('GET /apis/plants error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '실패' },
      { status: 500 }
    )
  }
}
