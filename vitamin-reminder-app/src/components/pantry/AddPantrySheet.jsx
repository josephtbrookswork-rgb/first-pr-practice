import { useState } from 'react'
import Sheet from '../ui/Sheet'
import Button from '../ui/Button'
import Field from '../ui/Field'

function AddPantrySheet({ open, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [servings, setServings] = useState('')
  const [error, setError] = useState('')

  function handleClose() {
    setName('')
    setCost('')
    setServings('')
    setError('')
    onClose()
  }

  function handleSubmit(event) {
    event.preventDefault()
    const parsedServings = Number(servings)
    if (!name.trim()) {
      setError('Give the item a name.')
      return
    }
    if (!Number.isFinite(parsedServings) || parsedServings <= 0) {
      setError('Enter how many servings are in the bottle.')
      return
    }
    onSubmit({
      name: name.trim(),
      costPerServing: Number(cost) || 0,
      totalServings: Math.round(parsedServings),
    })
    handleClose()
  }

  return (
    <Sheet open={open} onClose={handleClose} title="Add pantry item">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Field label="Item name" error={error}>
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
        <Field label="Servings in bottle">
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="input"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="60"
              value={servings}
              onChange={(event) => setServings(event.target.value)}
            />
          )}
        </Field>
        <Field label="Cost per serving (optional)">
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.24"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
            />
          )}
        </Field>
        <Button block type="submit">
          Add to pantry
        </Button>
      </form>
    </Sheet>
  )
}

export default AddPantrySheet
