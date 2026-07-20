export function getTodayDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getMinutesSinceMidnight(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes()
}

export function parseTimeToMinutes(hhmm) {
  const [hours, minutes] = hhmm.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatTimeLabel(hhmm) {
  const [hours, minutes] = hhmm.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = ((hours + 11) % 12) + 1
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`
}
