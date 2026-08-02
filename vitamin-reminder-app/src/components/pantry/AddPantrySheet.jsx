import { useEffect, useState } from 'react'
import Sheet from '../ui/Sheet'
import Button from '../ui/Button'
import Field from '../ui/Field'

function AddPantrySheet({ open, onClose, item, prefill, onSubmit }) {
  const [name, setName] = useState('')
  const [dosageMg, setDosageMg] = useState('')
  const [totalServings, setTotalServings] = useState('')
  const [servingsLeft, setServingsLeft] = useState('')
  const [cost, setCost] = useState('')
  const [error, setError] = useState('')
  const isEditing = Boolean(item)

  useEffect(() => {
    if (!open) return
    setName(item?.name ?? prefill?.name ?? '')
    setDosageMg(
      item?.dosageMg != null ? String(item.dosageMg) : prefill?.dosageMg != null ? String(prefill.dosageMg) : '',
    )
    setTotalServings(item?.totalServings != null ? String(item.totalServings) : '')
    setServingsLeft(item?.servingsLeft != null ? String(item.servingsLeft) : '')
    setCost(item?.costPerServing ? String(item.costPerServing) : '')
    setError('')
  }, [open, item, prefill])

  function handleSubmit(event) {
    event.preventDefault()
    const parsedTotal = Number(totalServings)
    if (!name.trim()) {
      setError('Give the item a name.')
      return
    }
    if (!Number.isFinite(parsedTotal) || parsedTotal <= 0) {
      setError('Enter how many servings are in the bottle.')
      return
    }
    const parsedDosage = dosageMg.trim() ? Number(dosageMg) : null
    const parsedServingsLeft = isEditing && servingsLeft.trim() ? Number(servingsLeft) : Math.round(parsedTotal)

    onSubmit({
      name: name.trim(),
      dosageMg: parsedDosage != null && Number.isFinite(parsedDosage) && parsedDosage > 0 ? parsedDosage : null,
      costPerServing: Number(cost) || 0,
      totalServings: Math.round(parsedTotal),
      servingsLeft: Number.isFinite(parsedServingsLeft) ? Math.max(0, Math.round(parsedServingsLeft)) : Math.round(parsedTotal),
    })
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title={isEditing ? `Edit ${item.name}` : 'Add pantry item'}>
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
        <Field label="Servings in bottle">
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="input"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="60"
              value={totalServings}
              onChange={(event) => setTotalServings(event.target.value)}
            />
          )}
        </Field>
        {isEditing && (
          <Field label="Servings left" hint="Correct this if the count is off">
            {(fieldProps) => (
              <input
                {...fieldProps}
                className="input"
                type="number"
                inputMode="numeric"
                min="0"
                value={servingsLeft}
                onChange={(event) => setServingsLeft(event.target.value)}
              />
            )}
          </Field>
        )}
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
          {isEditing ? 'Save changes' : 'Add to pantry'}
        </Button>
      </form>
    </Sheet>
  )
}

export default AddPantrySheet
