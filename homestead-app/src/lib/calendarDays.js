export const DAY_COUNT = 7

// dayOffset is relative to today (0 = today, 1 = tomorrow, ...)
export function buildDays() {
  const days = []
  const base = new Date()
  base.setHours(0, 0, 0, 0)
  for (let i = 0; i < DAY_COUNT; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    days.push({
      offset: i,
      weekday: d.toLocaleDateString(undefined, { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: i === 0,
    })
  }
  return days
}
