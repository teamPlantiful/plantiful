export const clamp = (n: number, min: number) => (Number.isFinite(n) ? Math.max(min, n) : min)

export const daysToMonths = (days: number) => clamp(Math.ceil(days / 30), 1)
export const monthsToDays = (months: number) => clamp(months * 30, 30)
