import axios from 'axios'
import type { XMLParser } from 'fast-xml-parser'
import type {
  NongsaroItem,
  NongsaroBody,
  NongsaroResponse,
  NongsaroDetailItem,
  NongsaroDetailBody,
  NongsaroDetailResponse,
} from '@/types/nongsaro'
/**
 * 특정 sType과 sText로 농사로 API를 검색하고 아이템 목록을 반환
 */
export async function searchNongsaro(
  params: Record<string, string>,
  apiKey: string,
  parser: XMLParser
): Promise<NongsaroItem[]> {
  const searchParams = new URLSearchParams(params)
  const url = `http://api.nongsaro.go.kr/service/garden/gardenList?apiKey=${apiKey}&${searchParams.toString()}`

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
    console.error(
      ` ${JSON.stringify(params)} 검색 중 오류:`,
      error instanceof Error ? error.message : error
    )
    return []
  }
}

/**
 * [상세] cntntsNo로 농사로 상세 API(gardenDtl)를 검색하고 상세 아이템을 반환
 */
export async function getNongsaroDetail(
  cntntsNo: string,
  apiKey: string,
  parser: XMLParser
): Promise<NongsaroDetailItem | null> {
  const url = `http://api.nongsaro.go.kr/service/garden/gardenDtl?apiKey=${apiKey}&cntntsNo=${cntntsNo}`

  try {
    const apiRes = await axios.get(url, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' },
    })
    const jsonData: NongsaroDetailResponse = parser.parse(apiRes.data)

    const header = jsonData.response?.header
    const body = jsonData.response?.body
    if (!header || !body) return null

    const code =
      typeof header.resultCode === 'string'
        ? header.resultCode.trim()
        : JSON.stringify(header.resultCode)

    // 상세 API는 body.items.item이 아닌 body.item을 반환합니다.
    if (/^0+$|^INFO-0+$/.test(code) && body.item) {
      const item = Array.isArray(body.item) ? body.item[0] : body.item
      return item
    }
    return null
  } catch (error) {
    console.error(`[${cntntsNo}] 상세 정보 로드 중 오류:`, error)
    return null
  }
}
