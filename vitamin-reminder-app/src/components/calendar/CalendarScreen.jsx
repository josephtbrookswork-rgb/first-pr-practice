import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useAppState } from '../../state/AppStateContext'
import { getTodayDateString, formatFriendlyDate } from '../../utils/date'
import { getMonthMatrix, formatMonthYear, WEEKDAY_SHORT, WEEKDAY_FULL } from '../../utils/calendar'
import { getPhaseMeta } from '../../utils/phaseMeta'
import { describeCheckIn } from '../../utils/checkin'

function CalendarScreen() {
  const { history } = useAppState()
  const today = useMemo(() => new Date(), [])
  const todayKey = getTodayDateString(today)

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedKey, setSelectedKey] = useState(todayKey)

  const weeks = useMemo(() => getMonthMatrix(viewDate.getFullYear(), viewDate.getMonth()), [viewDate])
  const selectedEntry = history[selectedKey]
  const selectedDate = useMemo(() => {
    const [year, month, day] = selectedKey.split('-').map(Number)
    return new Date(year, month - 1, day)
  }, [selectedKey])

  return (
    <>
      <h1 style={{ fontSize: 22 }}>Calendar</h1>

      <section className="card card-sketch elev-sm" style={{ padding: 'var(--space-4)' }} aria-label="Month view">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-icon btn-secondary"
            aria-label="Previous month"
            onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }} aria-live="polite">
            {formatMonthYear(viewDate)}
          </span>
          <button
            type="button"
            className="btn btn-icon btn-secondary"
            aria-label="Next month"
            onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        <div style={{ marginTop: 'var(--space-2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {WEEKDAY_SHORT.map((label, index) => (
              <div key={index} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)' }}>
                <span aria-hidden="true">{label}</span>
                <span className="sr-only">{WEEKDAY_FULL[index]}</span>
              </div>
            ))}
          </div>

          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginTop: 4 }}>
              {week.map((date, dayIndex) => {
                if (!date) return <div key={dayIndex} aria-hidden="true" />
                const key = getTodayDateString(date)
                const hasEntry = Boolean(history[key])
                const isSelected = key === selectedKey
                const isToday = key === todayKey
                return (
                  <button
                    key={dayIndex}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}${isToday ? ', today' : ''}${hasEntry ? ', has an entry' : ''}`}
                    onClick={() => setSelectedKey(key)}
                    style={{
                      position: 'relative',
                      minHeight: 40,
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      border: isToday && !isSelected ? '2px solid var(--color-accent-700)' : '2px solid transparent',
                      background: isSelected ? 'var(--color-accent-700)' : 'transparent',
                      color: isSelected ? 'var(--color-neutral-100)' : 'var(--color-text)',
                      fontSize: 13,
                      fontWeight: isSelected || isToday ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {date.getDate()}
                    {hasEntry && !isSelected && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: 'var(--color-accent-2-700)',
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="card card-sketch elev-sm" style={{ padding: 'var(--space-4)' }} aria-live="polite">
        <div className="card-kicker">
          {formatFriendlyDate(selectedDate)}
          {selectedKey === todayKey ? ' · Today' : ''}
        </div>

        {!selectedEntry ? (
          <p className="text-muted" style={{ fontSize: 13, margin: '2px 0 0' }}>
            No entry logged for this day yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 2 }}>
            {selectedEntry.checkIn && (
              <div className="rowcard" style={{ background: 'var(--color-bg)' }}>
                <div
                  className="iconwrap"
                  aria-hidden="true"
                  style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-700)' }}
                >
                  <Check size={18} aria-hidden="true" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Checked in</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{describeCheckIn(selectedEntry.checkIn)}</div>
                </div>
              </div>
            )}

            {(selectedEntry.totalItems > 0 || selectedEntry.takenItems.length > 0) && (
              <>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
                  {selectedEntry.takenItems.length}/{selectedEntry.totalItems} taken
                </p>
                {selectedEntry.takenItems.length > 0 && (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedEntry.takenItems.map((item) => {
                      const phase = getPhaseMeta(item.phase)
                      const Icon = phase.Icon
                      return (
                        <li
                          key={item.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--color-bg)', borderRadius: 999 }}
                        >
                          <Icon size={14} strokeWidth={2.75} aria-hidden="true" style={{ color: phase.iconColor, flex: 'none' }} />
                          <span style={{ fontSize: 13, flex: 1 }}>{item.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </>
            )}

            {!selectedEntry.checkIn && selectedEntry.takenItems.length === 0 && (
              <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
                No entry logged for this day yet.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  )
}

export default CalendarScreen
