/**
 * SolarSync stub. There's no live UV index API wired up, so this derives a
 * deterministic, plausible UV value from time of day and latitude — swap
 * for a real UV index service (e.g. OpenUV, EPA UV Index API) using the
 * device coordinates from the Geolocation permission screen.
 */
export function getMockUvIndex(date = new Date(), latitude = 40) {
  const hour = date.getHours() + date.getMinutes() / 60
  const daylightFactor = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI))
  const latitudeFactor = Math.max(0.3, 1 - Math.abs(latitude) / 90)
  const uv = Math.round(daylightFactor * latitudeFactor * 11)
  return Math.min(11, Math.max(0, uv))
}

export function getUvRiskLabel(uv) {
  if (uv >= 8) return 'Very high'
  if (uv >= 6) return 'High'
  if (uv >= 3) return 'Moderate'
  if (uv >= 1) return 'Low'
  return 'Minimal'
}
