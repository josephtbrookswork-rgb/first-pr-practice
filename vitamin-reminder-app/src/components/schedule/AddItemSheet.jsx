import { useEffect, useState } from 'react'
import Sheet from '../ui/Sheet'
import Button from '../ui/Button'
import Field from '../ui/Field'
import { ANCHOR_OPTIONS, getPhaseMeta } from '../../utils/phaseMeta'

function AddItemSheet({ open, onClose, phase, item, onSubmit }) {
  const [name, setName] = useState('')
  const [dosageMg, setDosageMg] = useState('')
  const [anchor, setAnchor] = useState(null)
  const [error, setError] = useState('')
  const phaseMeta = phase ? getPhaseMeta(phase) : null
  const isEditing = Boolean(item)

  useEffect(() => {
    if (!open) return
    setName(item?.name ?? '')
    setDosageMg(item?.dosageMg != null ? String(item.dosageMg) : '')
    setAnchor(item?.anchor ?? null)
    setError('')
  }, [open, item])

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Give your supplement a name.')
      return
    }
    const parsedDosage = dosageMg.trim() ? Number(dosageMg) : null
    onSubmit({
      name: name.trim(),
      phase,
      anchor,
      dosageMg: parsedDosage != null && Number.isFinite(parsedDosage) && parsedDosage > 0 ? parsedDosage : null,
    })
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit ${item.name}` : phaseMeta ? `Add to ${phaseMeta.label}` : 'Add supplement'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Field label="Name your supplement" error={error}>
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="input"
              type="text"
              placeholder="e.g. Vitamin D3"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          )}
        </Field>
        <Field label="Dosage (mg)" hint="Optional">
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="input"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="e.g. 1000"
              value={dosageMg}
              onChange={(event) => setDosageMg(event.target.value)}
            />
          )}
        </Field>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', padding: 0, marginBottom: 8 }}>
            Reminder tied to (optional)
          </legend>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ANCHOR_OPTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                className="chip"
                aria-pressed={anchor === label}
                onClick={() => setAnchor((prev) => (prev === label ? null : label))}
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <Button block type="submit">
          {isEditing ? 'Save changes' : `Save to ${phaseMeta?.label ?? 'schedule'}`}
        </Button>
      </form>
    </Sheet>
  )
}

export default AddItemSheet
