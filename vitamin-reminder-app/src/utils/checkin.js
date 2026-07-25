const SLEEP_LABELS = ['exhausted', 'tired', 'okay rest', 'rested', 'well rested']
const STRESS_LABELS = ['very calm', 'calm', 'moderate stress', 'stressed', 'very stressed']

export function describeCheckIn(checkIn) {
  if (!checkIn) return ''
  const sleep = SLEEP_LABELS[Math.min(4, Math.max(0, checkIn.sleep - 1))]
  const stress = STRESS_LABELS[Math.min(4, Math.max(0, checkIn.stress - 1))]
  return `Feeling ${sleep} · ${stress}`
}
