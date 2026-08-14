import { useState } from 'react'
import { Wifi, Phone, Stethoscope, PawPrint, KeyRound, Plus, X } from 'lucide-react'
import Sheet from '../ui/Sheet.jsx'
import Checkbox from '../ui/Checkbox.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'

const ICON_OPTIONS = [
  { key: 'Wifi', Icon: Wifi },
  { key: 'Phone', Icon: Phone },
  { key: 'Stethoscope', Icon: Stethoscope },
  { key: 'PawPrint', Icon: PawPrint },
  { key: 'KeyRound', Icon: KeyRound },
]

const inputClass =
  'w-full rounded-[var(--radius-md)] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-slate-400'

export default function AddHubCardSheet({ open, onClose }) {
  const { addHubCard } = useFamily()
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('KeyRound')
  const [sensitive, setSensitive] = useState(false)
  const [fields, setFields] = useState([{ label: '', value: '' }])

  function reset() {
    setTitle('')
    setIcon('KeyRound')
    setSensitive(false)
    setFields([{ label: '', value: '' }])
  }

  function updateField(index, key, text) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: text } : f)))
  }

  function removeField(index) {
    setFields((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    const cleanFields = fields
      .map((f) => ({ label: f.label.trim(), value: f.value.trim() }))
      .filter((f) => f.label && f.value)
    if (cleanFields.length === 0) return

    addHubCard({ title: title.trim(), icon, sensitive, fields: cleanFields })
    reset()
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="New reference card">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Title
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Alarm Code"
            autoFocus
          />
        </label>

        <div>
          <p className="mb-1.5 text-sm font-medium text-neutral-700">Icon</p>
          <div className="flex gap-2">
            {ICON_OPTIONS.map(({ key, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setIcon(key)}
                aria-label={key}
                aria-pressed={icon === key}
                className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] transition-colors ${
                  icon === key ? 'bg-slate-600 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-neutral-700">Details</p>
          {fields.map((field, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputClass}
                value={field.label}
                onChange={(e) => updateField(i, 'label', e.target.value)}
                placeholder="Label, e.g. Network"
              />
              <input
                className={inputClass}
                value={field.value}
                onChange={(e) => updateField(i, 'value', e.target.value)}
                placeholder="Value"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  aria-label="Remove field"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFields((prev) => [...prev, { label: '', value: '' }])}
            className="flex items-center gap-1.5 self-start text-sm font-semibold text-slate-600"
          >
            <Plus size={14} /> Add another field
          </button>
        </div>

        <label className="flex items-center gap-3 py-1">
          <Checkbox
            checked={sensitive}
            onChange={() => setSensitive((v) => !v)}
            size={20}
            aria-label="Contains a password to hide"
          />
          <span className="text-sm text-neutral-700">
            Hide a "Password" field until tapped
          </span>
        </label>

        <button
          type="submit"
          className="mt-1 rounded-[var(--radius-pill)] bg-slate-600 py-3 text-center text-sm font-semibold text-white"
        >
          Add card
        </button>
      </form>
    </Sheet>
  )
}
