import { useMemo, useState } from 'react'
import {
  Check,
  Circle,
  Sun as SunIcon,
  MapPinOff,
  Plus,
  ChevronDown,
  ChevronUp,
  Square,
  CheckSquare,
  X,
} from 'lucide-react'
import { useAppState } from '../../state/AppStateContext'
import { formatFriendlyDate, getGreeting, getTodayDateString } from '../../utils/date'
import { getMockUvIndex, getUvRiskLabel } from '../../utils/uv'
import { describeCheckIn } from '../../utils/checkin'
import { getPhaseMeta, PHASES } from '../../utils/phaseMeta'
import RowCard from '../ui/RowCard'
import Tag from '../ui/Tag'
import StatCard from '../home/StatCard'
import SortableList, { DragHandle } from '../ui/SortableList'
import CheckInSheet from './CheckInSheet'
import AddChecklistSheet from './AddChecklistSheet'
import ChecklistAddItemRow from './ChecklistAddItemRow'

function HomeDashboard({ onNavigateToSchedule, onNavigateToCalendar, onNavigateToProfile }) {
  const {
    profile,
    checkIn,
    checkedInToday,
    submitCheckIn,
    scheduleItems,
    toggleScheduleItemTaken,
    toggleScheduleItemSkipped,
    takenTodayCount,
    sessionQuote,
    customChecklists,
    addChecklist,
    addChecklistItem,
    toggleChecklistItem,
    reorderChecklists,
    reorderChecklistItems,
  } = useAppState()
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [addChecklistOpen, setAddChecklistOpen] = useState(false)
  const [expandedChecklists, setExpandedChecklists] = useState(() => new Set())

  function toggleExpanded(id) {
    setExpandedChecklists((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const now = useMemo(() => new Date(), [])
  const uv = profile?.locationGranted
    ? getMockUvIndex(now, profile.latitude ?? 40)
    : null

  const sortedStack = useMemo(() => {
    const order = { dawn: 0, midday: 1, dusk: 2 }
    return [...scheduleItems].sort((a, b) => order[a.phase] - order[b.phase])
  }, [scheduleItems])

  const routineStatus = useMemo(() => {
    const today = getTodayDateString()
    return PHASES.map((phase) => {
      const items = scheduleItems.filter((item) => item.phase === phase.id)
      const taken = items.filter((item) => item.lastTakenDate === today).length
      return { ...phase, total: items.length, taken }
    })
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
        <button
          type="button"
          className="avatar"
          aria-label="Open profile"
          onClick={onNavigateToProfile}
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
            border: 'none',
            padding: 0,
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          <span aria-hidden="true">{initial}</span>
        </button>
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
        <StatCard
          value={`${takenTodayCount}/${scheduleItems.length}`}
          label="taken today"
          onClick={onNavigateToCalendar}
          ariaLabel={`${takenTodayCount} of ${scheduleItems.length} taken today — view calendar`}
        />
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
              const today = getTodayDateString()
              const isTaken = item.lastTakenDate === today
              const isSkipped = item.skippedDate === today
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
                      {item.dosageMg ? (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}> · {item.dosageMg}mg</span>
                      ) : null}
                      {isSkipped && (
                        <span style={{ color: 'var(--color-danger-text)', fontSize: 12 }}> · Skipped</span>
                      )}
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
                    ) : isSkipped ? (
                      <button
                        type="button"
                        aria-pressed="true"
                        aria-label={`Unmark ${item.name} as skipped`}
                        onClick={() => toggleScheduleItemSkipped(item.id)}
                        style={{
                          width: 40,
                          height: 40,
                          minHeight: 40,
                          flex: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          border: '2px solid var(--color-danger)',
                          background: 'var(--color-danger)',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={20} strokeWidth={3} aria-hidden="true" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          aria-pressed="false"
                          aria-label={`Mark ${item.name} as not taken today`}
                          onClick={() => toggleScheduleItemSkipped(item.id)}
                          style={{
                            width: 32,
                            height: 32,
                            minHeight: 32,
                            flex: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            border: '1.5px solid var(--color-divider)',
                            background: 'transparent',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={16} aria-hidden="true" />
                        </button>
                        <Tag
                          as="button"
                          variant="outline"
                          aria-pressed="false"
                          aria-label={`Mark ${item.name} as taken`}
                          onClick={() => toggleScheduleItemTaken(item.id)}
                        >
                          Take now
                        </Tag>
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="card card-sketch elev-sm" style={{ background: 'var(--color-neutral-100)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="card-kicker">Daily routine</div>
          <button
            type="button"
            className="btn btn-icon btn-secondary"
            aria-label="Add checklist"
            onClick={() => setAddChecklistOpen(true)}
          >
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>
        <ul style={{ listStyle: 'none', margin: '2px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <li>
            <RowCard
              style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg)' }}
              onClick={checkedInToday ? undefined : () => setCheckInOpen(true)}
            >
              <span
                className="iconwrap"
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  background: checkedInToday ? 'var(--color-accent-2-100)' : 'var(--color-neutral-200)',
                  color: checkedInToday ? 'var(--color-accent-2-800)' : 'var(--color-text-muted)',
                }}
              >
                {checkedInToday ? <Check size={14} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
              </span>
              <span style={{ flex: 1, fontSize: 13, textAlign: 'left' }}>Morning check-in</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{checkedInToday ? 'Done' : 'Not yet'}</span>
            </RowCard>
          </li>
          {routineStatus.map((phase) => {
            const done = phase.total > 0 && phase.taken === phase.total
            const PhaseIcon = phase.Icon
            return (
              <li key={phase.id}>
                <RowCard style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg)' }}>
                  <span
                    className="iconwrap"
                    aria-hidden="true"
                    style={{
                      width: 28,
                      height: 28,
                      background: done ? 'var(--color-accent-2-100)' : 'var(--color-neutral-200)',
                      color: done ? 'var(--color-accent-2-800)' : 'var(--color-text-muted)',
                    }}
                  >
                    {done ? <Check size={14} aria-hidden="true" /> : <PhaseIcon size={14} aria-hidden="true" />}
                  </span>
                  <span style={{ flex: 1, fontSize: 13, textAlign: 'left' }}>{phase.label} stack</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {phase.total === 0 ? 'Nothing scheduled' : `${phase.taken}/${phase.total} taken`}
                  </span>
                </RowCard>
              </li>
            )
          })}
        </ul>

        {customChecklists.length > 0 && (
          <SortableList
            items={customChecklists}
            getKey={(list) => list.id}
            onReorder={reorderChecklists}
            renderItem={(list, listIndex, { dragHandleProps }) => {
              const isExpanded = expandedChecklists.has(list.id)
              const doneCount = list.items.filter((item) => item.checked).length
              const allDone = list.items.length > 0 && doneCount === list.items.length
              return (
                <div>
                  <div
                    data-sortable-anchor
                    className="rowcard"
                    style={{ marginTop: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg)' }}
                  >
                    <DragHandle {...dragHandleProps} aria-label={`Drag ${list.title} to reorder`} />
                    <button
                      type="button"
                      onClick={() => toggleExpanded(list.id)}
                      aria-expanded={isExpanded}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        flex: 1,
                        minHeight: 40,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: 'inherit',
                      }}
                    >
                      <span
                        className="iconwrap"
                        aria-hidden="true"
                        style={{
                          width: 28,
                          height: 28,
                          background: allDone ? 'var(--color-accent-2-100)' : 'var(--color-neutral-200)',
                          color: allDone ? 'var(--color-accent-2-800)' : 'var(--color-text-muted)',
                        }}
                      >
                        {allDone ? <Check size={14} aria-hidden="true" /> : <CheckSquare size={14} aria-hidden="true" />}
                      </span>
                      <span style={{ flex: 1, fontSize: 13 }}>{list.title}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {list.items.length === 0 ? 'Empty' : `${doneCount}/${list.items.length}`}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} aria-hidden="true" style={{ color: 'var(--color-text-muted)', flex: 'none' }} />
                      ) : (
                        <ChevronDown size={16} aria-hidden="true" style={{ color: 'var(--color-text-muted)', flex: 'none' }} />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: 'var(--space-1) var(--space-3) 0' }}>
                      <SortableList
                        items={list.items}
                        getKey={(item) => item.id}
                        onReorder={(fromIndex, toIndex) => reorderChecklistItems(list.id, fromIndex, toIndex)}
                        renderItem={(item, itemIndex, { dragHandleProps: itemDragHandleProps }) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <DragHandle {...itemDragHandleProps} aria-label={`Drag ${item.text} to reorder`} />
                            <button
                              type="button"
                              aria-pressed={item.checked}
                              onClick={() => toggleChecklistItem(list.id, item.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                flex: 1,
                                minHeight: 40,
                                background: 'none',
                                border: 'none',
                                padding: '6px 4px',
                                font: 'inherit',
                                fontSize: 13,
                                textAlign: 'left',
                                cursor: 'pointer',
                                color: 'var(--color-text)',
                              }}
                            >
                              {item.checked ? (
                                <CheckSquare size={18} aria-hidden="true" style={{ color: 'var(--color-accent-2-700)', flex: 'none' }} />
                              ) : (
                                <Square size={18} aria-hidden="true" style={{ color: 'var(--color-text-muted)', flex: 'none' }} />
                              )}
                              <span
                                style={{
                                  textDecoration: item.checked ? 'line-through' : 'none',
                                  color: item.checked ? 'var(--color-text-muted)' : 'var(--color-text)',
                                }}
                              >
                                {item.text}
                              </span>
                            </button>
                          </div>
                        )}
                      />
                      <ChecklistAddItemRow onAdd={(text) => addChecklistItem(list.id, text)} />
                    </div>
                  )}
                </div>
              )
            }}
          />
        )}
      </div>

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
      <AddChecklistSheet
        open={addChecklistOpen}
        onClose={() => setAddChecklistOpen(false)}
        onSubmit={addChecklist}
      />
    </>
  )
}

export default HomeDashboard
