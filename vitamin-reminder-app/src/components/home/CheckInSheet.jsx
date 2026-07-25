import { useState } from 'react'
import Sheet from '../ui/Sheet'
import Button from '../ui/Button'

const QUESTIONS = [
  { key: 'sleep', label: 'Sleep quality', lowLabel: 'Rough night', highLabel: 'Well rested' },
  { key: 'stress', label: 'Stress level', lowLabel: 'Calm', highLabel: 'Very stressed' },
  { key: 'activity', label: 'Activity today', lowLabel: 'Resting', highLabel: 'Very active' },
]

function CheckInSheet({ open, onClose, initialValues, onSubmit }) {
  const [values, setValues] = useState(
    () => initialValues ?? { sleep: 3, stress: 3, activity: 3 },
  )

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(values)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="How are you feeling?">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {QUESTIONS.map(({ key, label, lowLabel, highLabel }) => (
          <div key={key} className="field">
            <label htmlFor={`checkin-${key}`}>{label}</label>
            <input
              id={`checkin-${key}`}
              className="slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={values[key]}
              aria-valuetext={`${values[key]} of 5`}
              onChange={(event) => setValues((prev) => ({ ...prev, [key]: Number(event.target.value) }))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-muted)' }}>
              <span>{lowLabel}</span>
              <span>{highLabel}</span>
            </div>
          </div>
        ))}
        <Button block type="submit">
          Save check-in
        </Button>
      </form>
    </Sheet>
  )
}

export default CheckInSheet
