import axios from 'axios'
import type { XMLParser } from 'fast-xml-parser' 
import type {NongsaroItem,NongsaroBody,NongsaroResponse} from '@/types/nongsaro'


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