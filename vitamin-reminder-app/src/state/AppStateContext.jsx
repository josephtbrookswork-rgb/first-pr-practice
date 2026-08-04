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

const DEFAULT_ROUTINE_ORDER = ['checkin', 'dawn', 'midday', 'dusk']

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
  const [theme, setTheme] = useState(() => loadJSON('theme', 'default'))
  const [customChecklists, setCustomChecklists] = useState(() => loadJSON('customChecklists', []))
  const [routineOrder, setRoutineOrder] = useState(() => loadJSON('routineOrder', DEFAULT_ROUTINE_ORDER))

  useEffect(() => saveJSON('routineOrder', routineOrder), [routineOrder])
  useEffect(() => saveJSON('theme', theme), [theme])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => saveJSON('profile', profile), [profile])
  useEffect(() => saveJSON('checkIn', checkIn), [checkIn])
  useEffect(() => saveJSON('schedule', scheduleItems), [scheduleItems])
  useEffect(() => saveJSON('pantry', pantryItems), [pantryItems])
  useEffect(() => saveJSON('history', history), [history])
  useEffect(() => saveJSON('notificationsEnabled', notificationsEnabled), [notificationsEnabled])
  useEffect(() => saveJSON('reminders', reminders), [reminders])
  useEffect(() => saveJSON('customChecklists', customChecklists), [customChecklists])

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
      const entry = previous[today] ?? { date: today, checkIn: null, takenItems: [], skippedItems: [], totalItems: 0 }
      return { ...previous, [today]: { ...entry, checkIn: { sleep, stress, activity } } }
    })
  }, [])

  const checkedInToday = checkIn?.date === getTodayDateString()

  const addScheduleItem = useCallback(({ name, phase, anchor, dosageMg }) => {
    setScheduleItems((previous) => [
      ...previous,
      { id: createId(), name, phase, anchor: anchor ?? null, dosageMg: dosageMg ?? null, lastTakenDate: null, skippedDate: null },
    ])
  }, [])

  const updateScheduleItem = useCallback((id, { name, anchor, dosageMg }) => {
    setScheduleItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, name, anchor: anchor ?? null, dosageMg: dosageMg ?? null } : item,
      ),
    )
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
        const entry = previousHistory[today] ?? { date: today, checkIn: null, takenItems: [], skippedItems: [], totalItems: 0 }
        const takenItems = nowTaken
          ? [...entry.takenItems.filter((taken) => taken.id !== id), { id, name: item.name, phase: item.phase }]
          : entry.takenItems.filter((taken) => taken.id !== id)
        const skippedItems = (entry.skippedItems ?? []).filter((skipped) => skipped.id !== id)
        return { ...previousHistory, [today]: { ...entry, takenItems, skippedItems, totalItems: previous.length } }
      })

      return previous.map((candidate) =>
        candidate.id === id
          ? { ...candidate, lastTakenDate: nowTaken ? today : null, skippedDate: nowTaken ? null : candidate.skippedDate }
          : candidate,
      )
    })
  }, [])

  const toggleScheduleItemSkipped = useCallback((id) => {
    const today = getTodayDateString()
    setScheduleItems((previous) => {
      const item = previous.find((candidate) => candidate.id === id)
      if (!item) return previous
      const nowSkipped = item.skippedDate !== today

      setHistory((previousHistory) => {
        const entry = previousHistory[today] ?? { date: today, checkIn: null, takenItems: [], skippedItems: [], totalItems: 0 }
        const skippedItems = nowSkipped
          ? [...(entry.skippedItems ?? []).filter((skipped) => skipped.id !== id), { id, name: item.name, phase: item.phase }]
          : (entry.skippedItems ?? []).filter((skipped) => skipped.id !== id)
        const takenItems = nowSkipped ? entry.takenItems.filter((taken) => taken.id !== id) : entry.takenItems
        return { ...previousHistory, [today]: { ...entry, takenItems, skippedItems, totalItems: previous.length } }
      })

      return previous.map((candidate) =>
        candidate.id === id
          ? { ...candidate, skippedDate: nowSkipped ? today : null, lastTakenDate: nowSkipped ? null : candidate.lastTakenDate }
          : candidate,
      )
    })
  }, [])

  const addPantryItem = useCallback(({ name, dosageMg, costPerServing, totalServings, usagePerDay }) => {
    setPantryItems((previous) => [
      ...previous,
      {
        id: createId(),
        name,
        dosageMg: dosageMg ?? null,
        costPerServing,
        totalServings,
        servingsLeft: totalServings,
        usagePerDay: usagePerDay ?? 1,
      },
    ])
  }, [])

  const updatePantryItem = useCallback((id, { name, dosageMg, costPerServing, totalServings, servingsLeft }) => {
    setPantryItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, name, dosageMg: dosageMg ?? null, costPerServing, totalServings, servingsLeft }
          : item,
      ),
    )
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

  const addChecklist = useCallback((title) => {
    const id = createId()
    setCustomChecklists((previous) => [...previous, { id, title, items: [] }])
    setRoutineOrder((previous) => [...previous, id])
  }, [])

  const addChecklistItem = useCallback((checklistId, text) => {
    setCustomChecklists((previous) =>
      previous.map((list) =>
        list.id === checklistId ? { ...list, items: [...list.items, { id: createId(), text, checked: false }] } : list,
      ),
    )
  }, [])

  // Takes the full ordered list of currently *visible* row ids (as dictated
  // by a drag in the UI) and merges it back with whatever's currently
  // hidden (e.g. an empty phase) so those rows keep their place, appended
  // after the visible ones, instead of being dropped from the order.
  const reorderRoutine = useCallback((visibleOrderedIds) => {
    setRoutineOrder((previous) => {
      const visibleSet = new Set(visibleOrderedIds)
      const hidden = previous.filter((id) => !visibleSet.has(id))
      return [...visibleOrderedIds, ...hidden]
    })
  }, [])

  const reorderChecklistItems = useCallback((checklistId, fromIndex, toIndex) => {
    setCustomChecklists((previous) =>
      previous.map((list) => {
        if (list.id !== checklistId) return list
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= list.items.length ||
          toIndex >= list.items.length
        ) {
          return list
        }
        const items = [...list.items]
        const [moved] = items.splice(fromIndex, 1)
        items.splice(toIndex, 0, moved)
        return { ...list, items }
      }),
    )
  }, [])

  const toggleChecklistItem = useCallback((checklistId, itemId) => {
    setCustomChecklists((previous) =>
      previous.map((list) =>
        list.id === checklistId
          ? {
              ...list,
              items: list.items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)),
            }
          : list,
      ),
    )
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
      updateScheduleItem,
      removeScheduleItem,
      toggleScheduleItemTaken,
      toggleScheduleItemSkipped,
      takenTodayCount,
      pantryItems,
      addPantryItem,
      updatePantryItem,
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
      theme,
      setTheme,
      customChecklists,
      addChecklist,
      addChecklistItem,
      toggleChecklistItem,
      reorderChecklistItems,
      routineOrder,
      reorderRoutine,
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
      updateScheduleItem,
      removeScheduleItem,
      toggleScheduleItemTaken,
      toggleScheduleItemSkipped,
      takenTodayCount,
      pantryItems,
      addPantryItem,
      updatePantryItem,
      removePantryItem,
      sessionQuote,
      history,
      notificationsEnabled,
      setNotificationsEnabled,
      notificationPermission,
      reminders,
      updateReminder,
      theme,
      customChecklists,
      addChecklist,
      addChecklistItem,
      toggleChecklistItem,
      reorderChecklistItems,
      routineOrder,
      reorderRoutine,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}
