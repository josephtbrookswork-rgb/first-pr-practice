import { useState } from 'react'
import Sheet from '../ui/Sheet'
import Button from '../ui/Button'
import Field from '../ui/Field'
import { ANCHOR_OPTIONS, getPhaseMeta } from '../../utils/phaseMeta'

function AddItemSheet({ open, onClose, phase, onSubmit }) {
  const [name, setName] = useState('')
  const [anchor, setAnchor] = useState(null)
  const [error, setError] = useState('')
  const phaseMeta = phase ? getPhaseMeta(phase) : null

  function handleClose() {
    setName('')
    setAnchor(null)
    setError('')
    onClose()
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Give your supplement a name.')
      return
    }
    onSubmit({ name: name.trim(), phase, anchor })
    handleClose()
  }

  return (
    <Sheet open={open} onClose={handleClose} title={phaseMeta ? `Add to ${phaseMeta.label}` : 'Add supplement'}>
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
          Save to {phaseMeta?.label ?? 'schedule'}
        </Button>
      </form>
    </Sheet>
  )
}

export default AddItemSheet
