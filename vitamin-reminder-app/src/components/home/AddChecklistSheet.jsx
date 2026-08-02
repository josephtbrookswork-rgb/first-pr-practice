import { useEffect, useState } from 'react'
import Sheet from '../ui/Sheet'
import Button from '../ui/Button'
import Field from '../ui/Field'

function AddChecklistSheet({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setTitle('')
    setError('')
  }, [open])

  function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) {
      setError('Give your checklist a name.')
      return
    }
    onSubmit(title.trim())
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="New checklist">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Field label="Checklist name" error={error}>
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="input"
              type="text"
              placeholder="e.g. Face wash routine"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          )}
        </Field>
        <Button block type="submit">
          Create checklist
        </Button>
      </form>
    </Sheet>
  )
}

export default AddChecklistSheet
