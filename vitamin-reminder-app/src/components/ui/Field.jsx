import { useId } from 'react'

function Field({ label, hint, error, children }) {
  const generatedId = useId()

  return (
    <div className="field">
      <label htmlFor={generatedId}>{label}</label>
      {children({
        id: generatedId,
        'aria-describedby': hint ? `${generatedId}-hint` : error ? `${generatedId}-error` : undefined,
        'aria-invalid': error ? 'true' : undefined,
      })}
      {hint && !error && (
        <p id={`${generatedId}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${generatedId}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default Field
