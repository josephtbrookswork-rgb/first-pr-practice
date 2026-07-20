import { useEffect, useMemo, useState } from 'react'
import {
  formatTimeLabel,
  getMinutesSinceMidnight,
  getTodayDateString,
  parseTimeToMinutes,
} from '../utils/date'
import { loadDailyChecklist, saveDailyChecklist } from '../utils/storage'

const REMINDER_PRESETS = [
  { value: '08:00', label: 'Morning' },
  { value: '13:00', label: 'Afternoon' },
  { value: '18:00', label: 'Evening' },
]
const REMINDER_PRESET_VALUES = REMINDER_PRESETS.map((preset) => preset.value)

function getVitaminKey(vitamin) {
  return vitamin.source === 'custom' ? `custom:${vitamin.id}` : `rec:${vitamin.name}`
}

function getNotificationPermission() {
  return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
}

function VitaminDashboard({ userProfile, onUpdateProfile }) {
  const todaysVitamins = useMemo(() => {
    if (!userProfile) return []
    const recommended = (userProfile.selectedVitamins ?? []).map((vitamin) => ({
      ...vitamin,
      source: 'recommended',
    }))
    const custom = (userProfile.customVitamins ?? []).map((vitamin) => ({
      ...vitamin,
      source: 'custom',
    }))
    return [...recommended, ...custom].map((vitamin) => ({
      ...vitamin,
      key: getVitaminKey(vitamin),
    }))
  }, [userProfile])

  const [checklist, setChecklist] = useState(() => {
    const stored = loadDailyChecklist()
    const today = getTodayDateString()
    return stored && stored.date === today
      ? { reminded: false, ...stored }
      : { date: today, taken: {}, reminded: false }
  })
  const [notificationPermission, setNotificationPermission] = useState(getNotificationPermission)
  const [nativeNotificationFailed, setNativeNotificationFailed] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  useEffect(() => {
    saveDailyChecklist(checklist)
  }, [checklist])

  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodayDateString()
      setChecklist((previous) =>
        previous.date === today ? previous : { date: today, taken: {}, reminded: false },
      )
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setBannerDismissed(false)
    setNativeNotificationFailed(false)
  }, [checklist.date])

  useEffect(() => {
    const validKeys = new Set(todaysVitamins.map((vitamin) => vitamin.key))
    setChecklist((previous) => {
      const hasStaleKeys = Object.keys(previous.taken).some((key) => !validKeys.has(key))
      if (!hasStaleKeys) return previous
      const prunedTaken = Object.fromEntries(
        Object.entries(previous.taken).filter(([key]) => validKeys.has(key)),
      )
      return { ...previous, taken: prunedTaken }
    })
  }, [todaysVitamins])

  const takenCount = todaysVitamins.filter((vitamin) => checklist.taken[vitamin.key]).length
  const total = todaysVitamins.length
  const percent = total === 0 ? 0 : Math.round((takenCount / total) * 100)
  const reminderTime = userProfile?.reminderTime ?? null

  useEffect(() => {
    if (!reminderTime || total === 0 || checklist.reminded) return

    function maybeFireReminder() {
      if (getMinutesSinceMidnight() < parseTimeToMinutes(reminderTime)) return
      if (takenCount >= total) return

      setChecklist((previous) => (previous.reminded ? previous : { ...previous, reminded: true }))

      if (getNotificationPermission() === 'granted') {
        try {
          new Notification('Vitamin Reminder', {
            body: `You still have ${total - takenCount} of ${total} vitamins left to take today.`,
          })
          return
        } catch {
          setNativeNotificationFailed(true)
        }
      }
    }

    maybeFireReminder()
    const interval = setInterval(maybeFireReminder, 20_000)
    return () => clearInterval(interval)
  }, [reminderTime, checklist.reminded, takenCount, total])

  function toggleTaken(key) {
    setChecklist((previous) => ({
      ...previous,
      taken: { ...previous.taken, [key]: !previous.taken[key] },
    }))
  }

  function handleNextDay() {
    setChecklist({ date: getTodayDateString(), taken: {}, reminded: false })
  }

  function handleSetReminderTime(time) {
    onUpdateProfile({ reminderTime: time })
    setChecklist((previous) => ({ ...previous, reminded: false }))
    setBannerDismissed(false)
  }

  function handleEnableNotifications() {
    if (typeof Notification === 'undefined') return
    Notification.requestPermission().then((result) => {
      setNotificationPermission(result)
    })
  }

  if (!userProfile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center text-slate-500">
        Complete onboarding above to build your daily checklist.
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center text-slate-500">
        You haven't added any vitamins to your routine yet.
      </div>
    )
  }

  const showBanner =
    checklist.reminded &&
    (notificationPermission !== 'granted' || nativeNotificationFailed) &&
    takenCount < total &&
    !bannerDismissed

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {showBanner && (
        <div
          role="alert"
          aria-live="assertive"
          className="sticky top-2 z-50 mb-4 flex flex-col items-start gap-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold">
              !
            </span>
            <p className="text-sm font-medium sm:text-base">
              Time for your vitamins! You still have {total - takenCount} of {total} left today.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="shrink-0 self-end rounded-md bg-white/20 px-3 py-1 text-sm font-semibold hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white sm:self-auto"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-slate-900">Today's Checklist</h2>
        <button
          type="button"
          onClick={handleNextDay}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Simulate next day
        </button>
      </div>

      <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-medium text-slate-900">Daily reminder</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {REMINDER_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleSetReminderTime(preset.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                reminderTime === preset.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <label className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            Custom
            <input
              type="time"
              value={
                reminderTime && !REMINDER_PRESET_VALUES.includes(reminderTime) ? reminderTime : ''
              }
              onChange={(event) => event.target.value && handleSetReminderTime(event.target.value)}
              className="rounded bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </label>
        </div>

        <div className="mt-3">
          {notificationPermission === 'granted' && (
            <p className="text-sm text-teal-700">Browser notifications are enabled.</p>
          )}
          {notificationPermission === 'default' && (
            <button
              type="button"
              onClick={handleEnableNotifications}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-900"
            >
              Enable browser notifications
            </button>
          )}
          {notificationPermission === 'denied' && (
            <p className="text-sm text-amber-700">
              Browser notifications are blocked. We'll show an in-app reminder instead.
            </p>
          )}
          {notificationPermission === 'unsupported' && (
            <p className="text-sm text-amber-700">
              Your browser doesn't support notifications. We'll show an in-app reminder instead.
            </p>
          )}
        </div>

        {reminderTime && (
          <p className="mt-2 text-xs text-slate-400">
            We'll remind you at {formatTimeLabel(reminderTime)} if you still have vitamins left.
          </p>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            {takenCount} of {total} taken
          </span>
          <span>{percent}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {todaysVitamins.map((vitamin) => {
          const isTaken = Boolean(checklist.taken[vitamin.key])
          return (
            <li
              key={vitamin.key}
              className={`flex items-start gap-3 rounded-md border p-4 ${
                isTaken ? 'border-teal-200 bg-teal-50' : 'border-slate-200 bg-white'
              }`}
            >
              <input
                type="checkbox"
                id={`taken-${vitamin.key}`}
                checked={isTaken}
                onChange={() => toggleTaken(vitamin.key)}
                className="mt-1 h-4 w-4"
              />
              <label htmlFor={`taken-${vitamin.key}`} className="flex-1">
                <span
                  className={`block font-medium ${
                    isTaken ? 'text-teal-800 line-through' : 'text-slate-900'
                  }`}
                >
                  {vitamin.name}
                  {vitamin.dosage && (
                    <span className="font-normal text-slate-500"> &mdash; {vitamin.dosage}</span>
                  )}
                </span>
                {vitamin.source === 'custom' && (
                  <span className="mt-1 block text-xs text-slate-400">Custom</span>
                )}
              </label>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 text-xs text-slate-400">
        Checklist for {checklist.date}. Resets automatically each day.
      </p>
    </div>
  )
}

export default VitaminDashboard
