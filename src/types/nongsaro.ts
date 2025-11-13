export interface NongsaroItem {
  cntntsNo: string // 콘텐츠 ID
  cntntsSj: string // 국명
  plntbneNm?: string // 학명
  plntzrNm?: string // 영명
  rtnThumbFileUrl?: string | string[] // 썸네일 이미지 URL
}

//검색 api body
export interface NongsaroBody {
  items?: {
    item: NongsaroItem[] | NongsaroItem
  }
}

//검색 Response 응답
export interface NongsaroResponse {
  response?: {
    header: {
      resultCode: unknown
      resultMsg: unknown
    }
    body: NongsaroBody
  }
}

//상세조회 API(gardenDtl)
export interface NongsaroDetailItem {
  cntntsNo: string
  distbNm: string // 한국명
  plntbneNm?: string // 학명
  plntzrNm?: string // 영문명
  lighttdemanddoCode?: string // 광도 코드
  lighttdemanddoCodeNm?: string // 광도 코드명
  watercycleSprngCode?: string // 물주기
  watercycleSprngCodeNm?: string // 물주기
  grwhTpCode?: string // 생육 온도 코드
  grwhTpCodeNm?: string // 생육 온도 범위 (예: "16~20℃")
  hdCode?: string // 습도 코드
  hdCodeNm?: string // 습도 설명 (예: "70% 이상")
}

//상세조회 body
export interface NongsaroDetailBody {
  item?: NongsaroDetailItem | NongsaroDetailItem[]
}

//상세조회 전체 응답
export interface NongsaroDetailResponse {
  response?: {
    header: {
      resultCode: unknown
      resultMsg: unknown
    }
    body: NongsaroDetailBody
  }
}
