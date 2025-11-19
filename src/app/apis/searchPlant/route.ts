import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import axios from 'axios'
import { PlantSearchResult } from '@/types/plant'
import { searchNongsaro } from '@/utils/nongsaro'

const PAGE_SIZE = 20
const parser = new XMLParser()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const NONGSARO_API_KEY = process.env.NONGSARO_API_KEY
  if (!NONGSARO_API_KEY) {
    return NextResponse.json({ error: 'API 키가 없습니다.' }, { status: 500 })
  }

  try {
    const safeQuery = q.trim()

    let searchArgs: Record<string, string | number> = {
      pageNo: page,
      numOfRows: PAGE_SIZE,
    }

    if (safeQuery !== '') {
      searchArgs.sType = 'sCntntsSj'
      searchArgs.sText = safeQuery

      if (/^[A-Z]$/i.test(safeQuery)) {
        searchArgs.sType = 'sPlntbneNm'
        searchArgs.sText = safeQuery.toUpperCase()
      }
    }

    const items = await searchNongsaro(searchArgs, NONGSARO_API_KEY, parser)

    const totalCount = items.length >= PAGE_SIZE ? (page + 1) * PAGE_SIZE : page * PAGE_SIZE
    const totalPage = Math.ceil(totalCount / PAGE_SIZE)
    const plants: PlantSearchResult[] = items.map((item) => {
      const raw = Array.isArray(item.rtnThumbFileUrl)
        ? item.rtnThumbFileUrl[0]
        : item.rtnThumbFileUrl || ''
      const thumb = raw.includes('|') ? raw.split('|')[0] : raw

      return {
        id: Number(item.cntntsNo),
        commonName: item.plntzrNm ? `${item.cntntsSj} (${item.plntzrNm})` : item.cntntsSj,
        scientificName: item.plntbneNm ? [item.plntbneNm] : [],
        defaultImage: { mediumUrl: thumb },
      }
    })

    return NextResponse.json(
      {
        items: plants,
        pageNo: page,
        totalPage,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '알 수 없는 오류' }, { status: 500 })
  }
}
