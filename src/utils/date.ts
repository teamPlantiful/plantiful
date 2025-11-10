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
