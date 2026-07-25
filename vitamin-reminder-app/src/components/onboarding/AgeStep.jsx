import { useState } from 'react'
import Button from '../ui/Button'
import Field from '../ui/Field'
import StepHeader from './StepHeader'

const MIN_AGE = 1
const MAX_AGE = 119

function AgeStep({ headingRef, age, onChangeAge, onBack, onNext }) {
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const parsed = Number(age)
    if (age.trim() === '' || !Number.isInteger(parsed) || parsed < MIN_AGE || parsed > MAX_AGE) {
      setError(`Enter a whole number between ${MIN_AGE} and ${MAX_AGE}.`)
      return
    }
    setError('')
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 'var(--space-4)' }}>
      <StepHeader onBack={onBack} stepLabel="Step 3 of 4: your age" />
      <div>
        <h2 ref={headingRef} tabIndex={-1} style={{ marginBottom: 4 }}>
          How old are you?
        </h2>
        <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
          Nutrient needs shift with age — this tunes your recommendations.
        </p>
      </div>
      <Field label="Age" error={error}>
        {(fieldProps) => (
          <input
            {...fieldProps}
            className="input"
            type="number"
            inputMode="numeric"
            min={MIN_AGE}
            max={MAX_AGE}
            placeholder="34"
            value={age}
            onChange={(event) => onChangeAge(event.target.value)}
          />
        )}
      </Field>
      <div style={{ flex: 1 }} />
      <Button block type="submit">
        Continue
      </Button>
    </form>
  )
}

export default AgeStep
