import { useMemo, useState } from 'react'
import { Check, Clock, Sun as SunIcon, MapPinOff } from 'lucide-react'
import { useAppState } from '../../state/AppStateContext'
import { formatFriendlyDate, getGreeting, getTodayDateString } from '../../utils/date'
import { getMockUvIndex, getUvRiskLabel } from '../../utils/uv'
import { describeCheckIn } from '../../utils/checkin'
import { getPhaseMeta } from '../../utils/phaseMeta'
import RowCard from '../ui/RowCard'
import Tag from '../ui/Tag'
import StatCard from '../home/StatCard'
import CheckInSheet from './CheckInSheet'

function HomeDashboard({ onNavigateToSchedule }) {
  const {
    profile,
    checkIn,
    checkedInToday,
    submitCheckIn,
    scheduleItems,
    toggleScheduleItemTaken,
    takenTodayCount,
    nextAnchor,
    sessionQuote,
  } = useAppState()
  const [checkInOpen, setCheckInOpen] = useState(false)

  const now = useMemo(() => new Date(), [])
  const uv = profile?.locationGranted
    ? getMockUvIndex(now, profile.latitude ?? 40)
    : null

  const sortedStack = useMemo(() => {
    const order = { dawn: 0, midday: 1, dusk: 2 }
    return [...scheduleItems].sort((a, b) => order[a.phase] - order[b.phase])
  }, [scheduleItems])

  const initial = profile?.name?.trim()?.[0]?.toUpperCase() ?? '?'

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: 'var(--color-accent-2-900)' }}>
            {getGreeting(now)}, {profile?.name || 'there'}
          </h1>
          <span style={{ fontSize: 12, color: 'var(--color-accent-2-text)' }}>{formatFriendlyDate(now)}</span>
        </div>
        <div
          className="avatar"
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--color-accent-2-100)',
            color: 'var(--color-accent-2-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            flex: 'none',
          }}
        >
          {initial}
        </div>
      </div>

      {checkedInToday ? (
        <RowCard className="card-sketch" style={{ padding: 'var(--space-4)' }}>
          <div
            className="iconwrap"
            aria-hidden="true"
            style={{ width: 46, height: 46, background: 'var(--color-accent-100)', color: 'var(--color-accent-700)' }}
          >
            <Check size={22} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Checked in</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{describeCheckIn(checkIn)}</div>
          </div>
          <Tag as="button" variant="outline" onClick={() => setCheckInOpen(true)}>
            Edit
          </Tag>
        </RowCard>
      ) : (
        <RowCard className="card-sketch" onClick={() => setCheckInOpen(true)} style={{ padding: 'var(--space-4)' }}>
          <div
            className="iconwrap"
            aria-hidden="true"
            style={{ width: 46, height: 46, background: 'var(--color-accent-100)', color: 'var(--color-accent-700)' }}
          >
            <SunIcon size={22} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Morning check-in</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>How'd you sleep? How's today feeling?</div>
          </div>
          <Tag variant="outline">Start</Tag>
        </RowCard>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <StatCard value={`${takenTodayCount}/${scheduleItems.length}`} label="taken today" />
        {profile?.locationGranted ? (
          <StatCard value={`UV ${uv}`} label={`SolarSync · ${getUvRiskLabel(uv)}`} valueColor="var(--color-accent-700)" />
        ) : (
          <div className="card card-sketch elev-sm" style={{ flex: 1, background: 'var(--color-neutral-100)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
              <MapPinOff size={22} aria-hidden="true" style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                Enable location for UV timing
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="card card-sketch elev-sm" style={{ background: 'var(--color-neutral-100)', padding: 'var(--space-4)' }}>
        <div className="card-kicker">Today's stack</div>
        {sortedStack.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
            Nothing scheduled yet.{' '}
            <button
              type="button"
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--color-accent-text)', cursor: 'pointer', textDecoration: 'underline', minHeight: 'auto' }}
              onClick={onNavigateToSchedule}
            >
              Build your schedule
            </button>
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: '2px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {sortedStack.map((item) => {
              const phase = getPhaseMeta(item.phase)
              const Icon = phase.Icon
              const isTaken = item.lastTakenDate === getTodayDateString()
              return (
                <li key={item.id}>
                  <div className="rowcard" style={{ padding: 'var(--space-3)', background: 'var(--color-bg)' }}>
                    <div
                      className="iconwrap"
                      aria-hidden="true"
                      style={{ width: 38, height: 38, background: phase.iconBg, color: phase.iconColor }}
                    >
                      <Icon size={18} strokeWidth={2.75} aria-hidden="true" />
                    </div>
                    <div style={{ flex: 1, fontSize: 14 }}>
                      {item.name}
                      <span className="sr-only"> — {phase.label}{item.anchor ? `, tied to ${item.anchor}` : ''}</span>
                    </div>
                    {isTaken ? (
                      <button
                        type="button"
                        aria-pressed="true"
                        aria-label={`Mark ${item.name} as not taken`}
                        onClick={() => toggleScheduleItemTaken(item.id)}
                        style={{
                          width: 40,
                          height: 40,
                          minHeight: 40,
                          flex: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          border: '2px solid var(--color-accent-2-900)',
                          background: 'var(--color-accent-2-700)',
                          color: 'var(--color-neutral-100)',
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={20} strokeWidth={3} aria-hidden="true" />
                      </button>
                    ) : (
                      <Tag
                        as="button"
                        variant="outline"
                        aria-pressed="false"
                        aria-label={`Mark ${item.name} as taken`}
                        onClick={() => toggleScheduleItemTaken(item.id)}
                      >
                        Take now
                      </Tag>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <RowCard className="card-sketch" style={{ padding: 'var(--space-4)' }}>
        <div
          className="iconwrap"
          aria-hidden="true"
          style={{ width: 46, height: 46, background: 'var(--color-neutral-200)', color: 'var(--color-neutral-700)' }}
        >
          <Clock size={22} aria-hidden="true" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Next anchor</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            {nextAnchor ? `${nextAnchor.phaseLabel} · ${nextAnchor.count} to go` : "You're all caught up"}
          </div>
        </div>
      </RowCard>

      <p
        style={{
          margin: 'var(--space-2) 0 0',
          fontSize: 13,
          fontStyle: 'italic',
          fontWeight: 500,
          textAlign: 'center',
          color: 'var(--color-accent-2-800)',
          opacity: 0.85,
        }}
      >
        "{sessionQuote}"
      </p>

      <CheckInSheet
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        initialValues={checkIn ?? undefined}
        onSubmit={submitCheckIn}
      />
    </>
  )
}

export default HomeDashboard
