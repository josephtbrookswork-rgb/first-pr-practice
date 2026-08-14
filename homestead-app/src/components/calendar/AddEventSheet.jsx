import { useState } from 'react'
import Sheet from '../ui/Sheet.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'
import { buildDays } from '../../lib/calendarDays.js'

const inputClass =
  'w-full rounded-[var(--radius-md)] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-slate-400'

export default function AddEventSheet({ open, onClose, onAdded }) {
  const { addEvent } = useFamily()
  const days = buildDays()
  const [title, setTitle] = useState('')
  const [dayOffset, setDayOffset] = useState(0)
  const [time, setTime] = useState('9:00 AM')

  function reset() {
    setTitle('')
    setDayOffset(0)
    setTime('9:00 AM')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    addEvent({ title: title.trim(), dayOffset, time })
    onAdded?.(dayOffset)
    reset()
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="New event">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Event
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Soccer practice"
            autoFocus
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Day
            <select
              className={inputClass}
              value={dayOffset}
              onChange={(e) => setDayOffset(Number(e.target.value))}
            >
              {days.map((d) => (
                <option key={d.offset} value={d.offset}>
                  {d.isToday ? 'Today' : `${d.weekday} ${d.dayNum}`}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Time
            <input className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <button
          type="submit"
          className="mt-1 rounded-[var(--radius-pill)] bg-slate-600 py-3 text-center text-sm font-semibold text-white"
        >
          Add event
        </button>
      </form>
    </Sheet>
  )
}
