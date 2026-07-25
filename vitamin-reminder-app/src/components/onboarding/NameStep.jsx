import { useState } from 'react'
import Button from '../ui/Button'
import Field from '../ui/Field'
import StepHeader from './StepHeader'

function NameStep({ headingRef, name, onChangeName, onBack, onNext }) {
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Tell us what to call you.')
      return
    }
    setError('')
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 'var(--space-4)' }}>
      <StepHeader onBack={onBack} stepLabel="Step 2 of 4: your name" />
      <div>
        <h2 ref={headingRef} tabIndex={-1} style={{ marginBottom: 4 }}>
          What should we call you?
        </h2>
        <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
          We'll use this to greet you each morning.
        </p>
      </div>
      <Field label="First name" error={error}>
        {(fieldProps) => (
          <input
            {...fieldProps}
            className="input"
            type="text"
            autoComplete="given-name"
            placeholder="Sam"
            value={name}
            onChange={(event) => onChangeName(event.target.value)}
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

export default NameStep
