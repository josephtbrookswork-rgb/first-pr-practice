import { useState } from 'react'
import Sheet from '../ui/Sheet.jsx'
import Checkbox from '../ui/Checkbox.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'

const inputClass =
  'w-full rounded-[var(--radius-md)] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-slate-400'

export default function AddChoreSheet({ open, onClose }) {
  const { members, addChore } = useFamily()
  const [title, setTitle] = useState('')
  const [assignedTo, setAssignedTo] = useState('open')
  const [due, setDue] = useState('Today, 6:00 PM')
  const [recurring, setRecurring] = useState('none')
  const [requiresPhoto, setRequiresPhoto] = useState(false)

  function reset() {
    setTitle('')
    setAssignedTo('open')
    setDue('Today, 6:00 PM')
    setRecurring('none')
    setRequiresPhoto(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    addChore({ title: title.trim(), assignedTo, due, recurring, requiresPhoto })
    reset()
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="New chore">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Chore
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fold laundry"
            autoFocus
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Assign to
          <select
            className={inputClass}
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="open">Open — anyone can claim</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Due
            <input className={inputClass} value={due} onChange={(e) => setDue(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Repeats
            <select
              className={inputClass}
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
            >
              <option value="none">One time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </label>
        </div>

        <label className="flex items-center gap-3 py-1">
          <Checkbox
            checked={requiresPhoto}
            onChange={() => setRequiresPhoto((v) => !v)}
            size={20}
            aria-label="Require photo confirmation"
          />
          <span className="text-sm text-neutral-700">Require a photo to confirm completion</span>
        </label>

        <button
          type="submit"
          className="mt-1 rounded-[var(--radius-pill)] bg-slate-600 py-3 text-center text-sm font-semibold text-white"
        >
          Add chore
        </button>
      </form>
    </Sheet>
  )
}
