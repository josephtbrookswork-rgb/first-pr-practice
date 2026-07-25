import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createId, loadJSON, saveJSON } from '../utils/storage'
import { getTodayDateString } from '../utils/date'
import { pickRandomQuote } from '../utils/quotes'

const AppStateContext = createContext(null)

const PHASES = ['dawn', 'midday', 'dusk']
const PHASE_LABELS = { dawn: 'Dawn', midday: 'Midday', dusk: 'Dusk' }

const DEFAULT_REMINDERS = {
  dawn: { enabled: true, time: '07:30' },
  midday: { enabled: true, time: '12:30' },
  dusk: { enabled: true, time: '18:00' },
}

function getCurrentPhaseIndex(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 0
  if (hour < 17) return 1
  return 2
}

function getNotificationPermission() {
  return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
}

export function AppStateProvider({ children }) {
  const [profile, setProfile] = useState(() => loadJSON('profile', null))
  const [checkIn, setCheckIn] = useState(() => loadJSON('checkIn', null))
  const [sessionQuote] = useState(() => pickRandomQuote())
  const [scheduleItems, setScheduleItems] = useState(() => loadJSON('schedule', []))
  const [pantryItems, setPantryItems] = useState(() => loadJSON('pantry', []))
  const [history, setHistory] = useState(() => loadJSON('history', {}))
  const [notificationsEnabled, setNotificationsEnabledState] = useState(() => loadJSON('notificationsEnabled', false))
  const [reminders, setReminders] = useState(() => loadJSON('reminders', DEFAULT_REMINDERS))
  const [notificationPermission, setNotificationPermission] = useState(getNotificationPermission)

  useEffect(() => saveJSON('profile', profile), [profile])
  useEffect(() => saveJSON('checkIn', checkIn), [checkIn])
  useEffect(() => saveJSON('schedule', scheduleItems), [scheduleItems])
  useEffect(() => saveJSON('pantry', pantryItems), [pantryItems])
  useEffect(() => saveJSON('history', history), [history])
  useEffect(() => saveJSON('notificationsEnabled', notificationsEnabled), [notificationsEnabled])
  useEffect(() => saveJSON('reminders', reminders), [reminders])

  const updateProfile = useCallback((partial) => {
    setProfile((previous) => ({ ...(previous ?? {}), ...partial }))
  }, [])

  const completeOnboarding = useCallback((finalProfile) => {
    setProfile((previous) => ({ ...(previous ?? {}), ...finalProfile, onboardingComplete: true }))
  }, [])

  const resetOnboarding = useCallback(() => {
    setProfile(null)
    setCheckIn(null)
  }, [])

  const submitCheckIn = useCallback(({ sleep, stress, activity }) => {
    const today = getTodayDateString()
    setCheckIn({ date: today, sleep, stress, activity })
    setHistory((previous) => {
      const entry = previous[today] ?? { date: today, checkIn: null, takenItems: [], totalItems: 0 }
      return { ...previous, [today]: { ...entry, checkIn: { sleep, stress, activity } } }
    })
  }, [])

  const checkedInToday = checkIn?.date === getTodayDateString()

  const addScheduleItem = useCallback(({ name, phase, anchor }) => {
    setScheduleItems((previous) => [
      ...previous,
      { id: createId(), name, phase, anchor: anchor ?? null, lastTakenDate: null },
    ])
  }, [])

  const removeScheduleItem = useCallback((id) => {
    setScheduleItems((previous) => previous.filter((item) => item.id !== id))
  }, [])

  const toggleScheduleItemTaken = useCallback((id) => {
    const today = getTodayDateString()
    setScheduleItems((previous) => {
      const item = previous.find((candidate) => candidate.id === id)
      if (!item) return previous
      const nowTaken = item.lastTakenDate !== today

      setHistory((previousHistory) => {
        const entry = previousHistory[today] ?? { date: today, checkIn: null, takenItems: [], totalItems: 0 }
        const takenItems = nowTaken
          ? [...entry.takenItems.filter((taken) => taken.id !== id), { id, name: item.name, phase: item.phase }]
          : entry.takenItems.filter((taken) => taken.id !== id)
        return { ...previousHistory, [today]: { ...entry, takenItems, totalItems: previous.length } }
      })

      return previous.map((candidate) =>
        candidate.id === id ? { ...candidate, lastTakenDate: nowTaken ? today : null } : candidate,
      )
    })
  }, [])

  const addPantryItem = useCallback(({ name, costPerServing, totalServings, usagePerDay }) => {
    setPantryItems((previous) => [
      ...previous,
      {
        id: createId(),
        name,
        costPerServing,
        totalServings,
        servingsLeft: totalServings,
        usagePerDay: usagePerDay ?? 1,
      },
    ])
  }, [])

  const removePantryItem = useCallback((id) => {
    setPantryItems((previous) => previous.filter((item) => item.id !== id))
  }, [])

  const setNotificationsEnabled = useCallback((enabled) => {
    if (!enabled) {
      setNotificationsEnabledState(false)
      return
    }
    if (typeof Notification === 'undefined') {
      setNotificationsEnabledState(false)
      return
    }
    if (Notification.permission === 'granted') {
      setNotificationsEnabledState(true)
      return
    }
    if (Notification.permission === 'denied') {
      setNotificationPermission('denied')
      setNotificationsEnabledState(false)
      return
    }
    Notification.requestPermission().then((result) => {
      setNotificationPermission(result)
      setNotificationsEnabledState(result === 'granted')
    })
  }, [])

  const updateReminder = useCallback((phase, partial) => {
    setReminders((previous) => ({ ...previous, [phase]: { ...previous[phase], ...partial } }))
  }, [])

  const scheduleItemsRef = useRef(scheduleItems)
  useEffect(() => {
    scheduleItemsRef.current = scheduleItems
  }, [scheduleItems])

  useEffect(() => {
    if (!notificationsEnabled || notificationPermission !== 'granted') return undefined

    const timeoutIds = []

    function scheduleNext(phase, time) {
      const [hours, minutes] = time.split(':').map(Number)
      const now = new Date()
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0)
      if (next <= now) next.setDate(next.getDate() + 1)
      const delay = next.getTime() - now.getTime()

      const id = setTimeout(() => {
        const todayKey = getTodayDateString()
        const pending = scheduleItemsRef.current.filter(
          (item) => item.phase === phase && item.lastTakenDate !== todayKey,
        )
        if (pending.length > 0) {
          try {
            new Notification(`${PHASE_LABELS[phase]} vitamins`, {
              body:
                pending.length === 1
                  ? `${pending[0].name} is still waiting.`
                  : `${pending.length} items waiting: ${pending.map((item) => item.name).join(', ')}`,
              tag: `solaris-${phase}`,
            })
          } catch {
            // Notification constructor can throw in some environments — skip silently
          }
        }
        scheduleNext(phase, time)
      }, delay)

      timeoutIds.push(id)
    }

    Object.entries(reminders).forEach(([phase, config]) => {
      if (config.enabled) scheduleNext(phase, config.time)
    })

    return () => timeoutIds.forEach(clearTimeout)
  }, [notificationsEnabled, notificationPermission, reminders])

  const today = getTodayDateString()
  const takenTodayCount = useMemo(
    () => scheduleItems.filter((item) => item.lastTakenDate === today).length,
    [scheduleItems, today],
  )

  const nextAnchor = useMemo(() => {
    if (scheduleItems.length === 0) return null
    const currentPhaseIndex = getCurrentPhaseIndex()
    for (let offset = 0; offset < PHASES.length; offset += 1) {
      const phase = PHASES[(currentPhaseIndex + offset) % PHASES.length]
      const pending = scheduleItems.filter(
        (item) => item.phase === phase && item.lastTakenDate !== today,
      )
      if (pending.length > 0) {
        return { phase, phaseLabel: PHASE_LABELS[phase], count: pending.length }
      }
    }
    return null
  }, [scheduleItems, today])

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      completeOnboarding,
      resetOnboarding,
      checkIn,
      checkedInToday,
      submitCheckIn,
      scheduleItems,
      addScheduleItem,
      removeScheduleItem,
      toggleScheduleItemTaken,
      takenTodayCount,
      nextAnchor,
      pantryItems,
      addPantryItem,
      removePantryItem,
      phases: PHASES,
      phaseLabels: PHASE_LABELS,
      sessionQuote,
      history,
      notificationsEnabled,
      setNotificationsEnabled,
      notificationPermission,
      reminders,
      updateReminder,
    }),
    [
      profile,
      updateProfile,
      completeOnboarding,
      resetOnboarding,
      checkIn,
      checkedInToday,
      submitCheckIn,
      scheduleItems,
      addScheduleItem,
      removeScheduleItem,
      toggleScheduleItemTaken,
      takenTodayCount,
      nextAnchor,
      pantryItems,
      addPantryItem,
      removePantryItem,
      sessionQuote,
      history,
      notificationsEnabled,
      setNotificationsEnabled,
      notificationPermission,
      reminders,
      updateReminder,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}
