export function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function formatMonthYear(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getFullYear()}`
}

/**
 * 날짜를 00:00:00으로 정규화
 */
export function normalizeToMidnight(date: Date | string): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * 두 날짜 사이의 일수 차이 계산 (날짜만 비교)
 */
export function getDaysDifference(
  targetDate: Date | string,
  fromDate: Date | string = new Date()
): number {
  const target = normalizeToMidnight(targetDate)
  const from = normalizeToMidnight(fromDate)
  return Math.floor((target.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * D-day 계산
 * - 양수: D-n (n일 남음)
 * - 0: D-day (오늘)
 * - 음수: D+n (n일 지남)
 */
export function calculateDday(targetDate: Date | string): number {
  return getDaysDifference(targetDate)
}

/**
 * 날짜를 ISO 문자열로 변환 (00:00:00 기준, UTC 변환 없이 로컬 날짜 유지)
 */
export function toDateOnlyISO(date: Date | string): string {
  const normalized = normalizeToMidnight(date)
  const year = normalized.getFullYear()
  const month = String(normalized.getMonth() + 1).padStart(2, '0')
  const day = String(normalized.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}T00:00:00.000Z`
}

/**
 * 날짜에 일수를 더함 (00:00:00 기준)
 */
export function addDays(date: Date | string, days: number): Date {
  const normalized = normalizeToMidnight(date)
  normalized.setDate(normalized.getDate() + days)
  return normalized
}

export function getMonthCalendarDays(year: number, month: number) {
  const firstDay = getFirstDayOfMonth(year, month)
  const daysInMonth = getDaysInMonth(year, month)
  const prevMonthDays = getDaysInMonth(year, month - 1)

  const days: Array<{
    date: number
    month: 'prev' | 'current' | 'next'
    fullDate: Date
  }> = []

  // 이전 달 날짜들
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: prevMonthDays - i,
      month: 'prev',
      fullDate: new Date(year, month - 1, prevMonthDays - i),
    })
  }

  // 현재 달 날짜들
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      month: 'current',
      fullDate: new Date(year, month, i),
    })
  }

  // 다음 달 날짜들 (현재 주 완성)
  const totalCells = days.length
  const remainingInWeek = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)

  for (let i = 1; i <= remainingInWeek; i++) {
    days.push({
      date: i,
      month: 'next',
      fullDate: new Date(year, month + 1, i),
    })
  }

  return days
}

/**
 * SelectBox용 일(day) 옵션 생성
 * @param maxDays 최대 일수 (기본값: 60)
 */
export function generateDayOptions(maxDays: number = 60) {
  return Array.from({ length: maxDays }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}일`,
  }))
}

/**
 * SelectBox용 월(month) 옵션 생성
 * @param maxMonths 최대 개월 수 (기본값: 24)
 */
export function generateMonthOptions(maxMonths: number = 24) {
  return Array.from({ length: maxMonths }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}개월`,
  }))
}
