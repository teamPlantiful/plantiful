import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import axios from 'axios'

export interface PerenualPlant {
  id: number
  commonName: string
  scientificName: string[]
  defaultImage?: { mediumUrl: string }
}

// --- 농사로 API 타입 ---
interface NongsaroItem {
  cntntsNo: string
  cntntsSj: string // 국명
  plntbneNm?: string // 학명
  plntzrNm?: string // 영명
  rtnThumbFileUrl?: string | string[]
}
interface NongsaroBody {
  items?: { item: NongsaroItem[] | NongsaroItem }
}
interface NongsaroResponse {
  response?: {
    header: { resultCode: unknown; resultMsg: unknown }
    body: NongsaroBody
  }
}

// --- 헬퍼 함수: API 호출 및 아이템 추출 ---
/**
 * 특정 sType과 sText로 농사로 API를 검색하고 아이템 목록을 반환
 */
async function searchNongsaro(
  sType: 'sCntntsSj' | 'sPlntbneNm' | 'sPlntzrNm',
  sText: string,
  apiKey: string,
  parser: XMLParser
): Promise<NongsaroItem[]> {
  const url = `http://api.nongsaro.go.kr/service/garden/gardenList?apiKey=${apiKey}&sType=${sType}&sText=${encodeURIComponent(
    sText
  )}`

  try {
    const apiRes = await axios.get(url, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' },
    })
    const jsonData: NongsaroResponse = parser.parse(apiRes.data)

    const header = jsonData.response?.header
    const body = jsonData.response?.body
    if (!header || !body) return []

    const code =
      typeof header.resultCode === 'string'
        ? header.resultCode.trim()
        : JSON.stringify(header.resultCode)

    if (/^0+$|^INFO-0+$/.test(code) && body.items?.item) {
      return Array.isArray(body.items.item) ? body.items.item : [body.items.item]
    }
    return []
  } catch (error) {
    console.error(` ${sType} 검색 중 오류:`, error instanceof Error ? error.message : error)
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json({ error: '검색어가 필요합니다.' }, { status: 400 })
  }

  const NONGSARO_API_KEY = process.env.NONGSARO_API_KEY
  if (!NONGSARO_API_KEY) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 })
  }

  try {
    const parser = new XMLParser()

    const results = await Promise.allSettled([
      searchNongsaro('sCntntsSj', q, NONGSARO_API_KEY, parser), // 식물명
      searchNongsaro('sPlntbneNm', q, NONGSARO_API_KEY, parser), // 학명
      searchNongsaro('sPlntzrNm', q, NONGSARO_API_KEY, parser), // 영명
    ])

    const allItems = results
      .filter(
        (result): result is PromiseFulfilledResult<NongsaroItem[]> => result.status === 'fulfilled'
      )
      .flatMap((result) => result.value)

    const uniqueItems = new Map<string, NongsaroItem>()
    allItems.forEach((item) => {
      uniqueItems.set(item.cntntsNo, item) // cntntsNo (ID)를 기준으로 중복 제거
    })
    const itemsList = Array.from(uniqueItems.values())

    const plants: PerenualPlant[] = itemsList.map((item) => {
      const thumbRaw = Array.isArray(item.rtnThumbFileUrl)
        ? item.rtnThumbFileUrl[0]
        : (item.rtnThumbFileUrl ?? '')
      const thumb = thumbRaw.includes('|') ? thumbRaw.split('|')[0] : thumbRaw

      // 국명 + 영명 조합
      const commonName = item.plntzrNm ? `${item.cntntsSj} (${item.plntzrNm})` : item.cntntsSj

      // 학명을 배열로 변환
      const scientificName = item.plntbneNm ? [item.plntbneNm] : []

      return {
        id: parseInt(item.cntntsNo, 10),
        commonName: commonName,
        scientificName: scientificName,
        defaultImage: {
          mediumUrl: thumb || 'https://placehold.co/300x300/e2e8f0/e2e8f0?text=+', // camelCase
        },
      }
    })

    if (plants.length === 0) {
      console.log(`검색 결과 없음: "${q}"`)
      return NextResponse.json({ plants: [], message: '검색 결과가 없습니다.' }, { status: 200 })
    }

    return NextResponse.json({ plants, message: '검색 완료' }, { status: 200 })
  } catch (err) {
    let message = '알 수 없는 오류'
    if (axios.isAxiosError(err)) {
      message = `Axios Error: ${err.message}`
    } else if (err instanceof Error) {
      message = err.message
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
