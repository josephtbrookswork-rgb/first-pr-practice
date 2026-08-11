import { useMemo, useState } from 'react'
import { Link2 } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { useFamily } from '../context/FamilyContext.jsx'
import { MEMBER_COLOR, PAGE_COLOR } from '../lib/colors.js'

const DAY_COUNT = 7
const color = PAGE_COLOR.calendar

function timeToMinutes(time) {
  const [, h, m, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/i) ?? []
  let hours = Number(h) % 12
  if (/pm/i.test(period)) hours += 12
  return hours * 60 + Number(m)
}

function buildDays() {
  const days = []
  const base = new Date()
  base.setHours(0, 0, 0, 0)
  for (let i = 0; i < DAY_COUNT; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    days.push({
      offset: i,
      weekday: d.toLocaleDateString(undefined, { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: i === 0,
    })
  }
  return days
}

export default function Calendar() {
  const { members, events, chores } = useFamily()
  const days = useMemo(buildDays, [])
  const [selectedOffset, setSelectedOffset] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')

  const dayEvents = events
    .filter((e) => e.dayOffset === selectedOffset)
    .filter((e) => activeFilter === 'all' || e.members.includes(activeFilter))
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 pb-6">
      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {days.map((d) => {
          const isSelected = d.offset === selectedOffset
          return (
            <button
              key={d.offset}
              type="button"
              onClick={() => setSelectedOffset(d.offset)}
              className={`flex w-14 shrink-0 flex-col items-center gap-1 rounded-[var(--radius-md)] py-2.5 transition-colors ${
                isSelected ? `${color.solid} ${color.solidText}` : 'bg-white text-neutral-700'
              }`}
            >
              <span className="text-[11px] uppercase opacity-80">{d.weekday}</span>
              <span className="text-lg font-bold">{d.dayNum}</span>
              {d.isToday && (
                <span
                  className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1">
        <FilterChip
          label="Everyone"
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        />
        {members.map((m) => (
          <FilterChip
            key={m.id}
            label={m.name}
            avatar={m}
            active={activeFilter === m.id}
            onClick={() => setActiveFilter(m.id)}
          />
        ))}
      </div>

      <section className="flex flex-col gap-2">
        {dayEvents.length === 0 && (
          <p className="py-6 text-center text-sm text-neutral-500">
            Nothing on the calendar for this day.
          </p>
        )}
        {dayEvents.map((e) => {
          const linkedChore = e.linkedChore && chores.find((c) => c.id === e.linkedChore)
          return (
            <Card key={e.id} className="flex items-start gap-3 p-3">
              <div className="flex w-14 shrink-0 flex-col pt-0.5 text-xs font-semibold text-neutral-500">
                {e.time}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-900">{e.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {e.members.map((id) => {
                    const m = members.find((mm) => mm.id === id)
                    return m ? <Avatar key={id} member={m} size="sm" /> : null
                  })}
                </div>
                {linkedChore && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-600">
                    <Link2 size={11} /> Linked to "{linkedChore.title}"
                  </p>
                )}
              </div>
            </Card>
          )
        })}
      </section>
    </div>
  )
}

function FilterChip({ label, active, onClick, avatar }) {
  const palette = avatar ? MEMBER_COLOR[avatar.color] : null
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600'
      }`}
    >
      {avatar && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-white' : palette.dot}`}
          aria-hidden="true"
        />
      )}
      {label}
    </button>
  )
}
