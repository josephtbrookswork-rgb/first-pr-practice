const KEY = 'homestead:profile'

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {
    // Ignore write failures (e.g. private browsing) — the app still
    // works, it'll just re-run onboarding next launch.
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
