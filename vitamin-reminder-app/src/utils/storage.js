const USER_PROFILE_KEY = 'vitaminReminder.userProfile'
const DAILY_CHECKLIST_KEY = 'vitaminReminder.dailyChecklist'

export function loadUserProfile() {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveUserProfile(profile) {
  try {
    if (profile === null) {
      localStorage.removeItem(USER_PROFILE_KEY)
    } else {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile))
    }
  } catch {
    // localStorage unavailable (e.g. private browsing quota) — fail silently
  }
}

export function loadDailyChecklist() {
  try {
    const raw = localStorage.getItem(DAILY_CHECKLIST_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveDailyChecklist(checklist) {
  try {
    localStorage.setItem(DAILY_CHECKLIST_KEY, JSON.stringify(checklist))
  } catch {
    // localStorage unavailable (e.g. private browsing quota) — fail silently
  }
}
