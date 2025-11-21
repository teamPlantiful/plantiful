import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { PlantSearchResult } from '@/types/plant'
import { searchNongsaro } from '@/utils/nongsaro'

const PAGE_SIZE = 20

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const page = Number(searchParams.get('page') ?? 1)

  const apiKey = process.env.NONGSARO_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 })
  }

  try {
    const parser = new XMLParser()

    let searchOption = { sType: 'sCntntsSj', sText: q }

    // 영문 1글자일 경우 학명(sPlntbneNm) 검색으로 전환
    if (/^[A-Z]$/i.test(q)) {
      searchOption = { sType: 'sPlntbneNm', sText: q.toUpperCase() }
    }

    const { items, totalCount: rawTotalCount } = await searchNongsaro(
      {
        ...searchOption,
        pageNo: page,
        numOfRows: PAGE_SIZE,
      },
      apiKey,
      parser
    )

    let totalCount = rawTotalCount
    if (totalCount === 0 && items.length >= PAGE_SIZE) {
      totalCount = (page + 1) * PAGE_SIZE
    }

    const totalPage = Math.ceil(totalCount / PAGE_SIZE)

    const plants: PlantSearchResult[] = items.map((item) => {
      const rawUrl = Array.isArray(item.rtnThumbFileUrl)
        ? item.rtnThumbFileUrl[0]
        : (item.rtnThumbFileUrl ?? '')

      const thumb = rawUrl.split('|')[0]

      return {
        id: Number(item.cntntsNo),
        commonName: item.plntzrNm ? `${item.cntntsSj} (${item.plntzrNm})` : item.cntntsSj,
        scientificName: item.plntbneNm ? [item.plntbneNm] : [],
        defaultImage: {
          mediumUrl: thumb || 'https://placehold.co/300x300/e2e8f0/e2e8f0?text=+',
        },
      }
    })

    return NextResponse.json({
      items: plants,
      pageNo: page,
      totalPage,
    })
  } catch (error) {
    console.error('[Nongsaro API Error]', error)

    let message = '서버 처리 중 오류 발생'
    if (error instanceof SyntaxError) {
      message = '농사로 API 응답 파싱 중 오류가 발생했습니다.'
    } else if (error instanceof TypeError) {
      message = '잘못된 요청 값이 전달되었습니다.'
    } else if (error instanceof Error) {
      message = error.message || '예기치 못한 오류가 발생했습니다.'
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
