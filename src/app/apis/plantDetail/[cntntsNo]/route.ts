import { NextRequest, NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { getNongsaroDetail } from '@/utils/nongsaro'
import type { NongsaroDetailItem } from '@/types/nongsaro'
import type { PlantSpeciesInfo, CareInfo } from '@/types/plant'

//fast-xml-parser로 인해 앞의 0 이 지워지는 문제 해결을 위한 코드
function normalizeCode(code?: string | number | null) {
  if (!code) return undefined
  return String(code).padStart(6, '0') // 예: 82002 → "082002"
}

//광도 코드 제공이 안되는 경우가 있음 -> 문자열 기반 추론
function inferLightCode(nm: string | undefined): string | undefined {
  if (!nm) return undefined
  if (nm.includes('낮은')) return '055001'
  if (nm.includes('중간')) return '055002'
  if (nm.includes('높은')) return '055003'
  return undefined
}

function transformNongsaroDetail(
  detail: NongsaroDetailItem,
  imageUrl: string | null
): Partial<PlantSpeciesInfo> {
  const lightCode =
    normalizeCode(detail.lighttdemanddoCode) || // 코드가 있으면 코드 우선
    inferLightCode(detail.lighttdemanddoCodeNm) // 없으면 문자열 보고 추론
  const careInfo: CareInfo = {
    lightDemandCode: lightCode,
    waterCycleCode: normalizeCode(detail.watercycleSprngCode),
    temperatureCode: normalizeCode(detail.grwhTpCode),
    humidityCode: normalizeCode(detail.hdCode),
  }

  return {
    cntntsNo: detail.cntntsNo,
    commonName: detail.distbNm,
    scientificName: detail.plntbneNm || '',
    careInfo,
    imageUrl,
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ cntntsNo: string }> }
) {
  const params = await context.params

  const { cntntsNo } = await context.params

  if (!cntntsNo) {
    return NextResponse.json({ error: 'cntntsNo가 필요합니다.' }, { status: 400 })
  }

  const NONGSARO_API_KEY = process.env.NONGSARO_API_KEY
  if (!NONGSARO_API_KEY) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 })
  }

  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: false,
      trimValues: true,
    })

    const rawDetail = await getNongsaroDetail(cntntsNo, NONGSARO_API_KEY, parser)
    console.log('rawDetail =', rawDetail)

    if (!rawDetail) {
      return NextResponse.json({ error: '상세 정보를 찾을 수 없습니다.' }, { status: 404 })
    }
    const imageUrl = request.nextUrl.searchParams.get('imageUrl') || null

    const plantSpeciesInfo = transformNongsaroDetail(rawDetail, imageUrl)

    return NextResponse.json(plantSpeciesInfo)
  } catch (err) {
    console.error(`[API /apis/plantDetail]`, err)
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
