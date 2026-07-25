import { ChevronLeft } from 'lucide-react'

function StepHeader({ onBack, stepLabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginInline: 'calc(var(--space-2) * -1)' }}>
      <button type="button" className="btn btn-icon btn-ghost" aria-label="Back" onClick={onBack}>
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
      {stepLabel && (
        <span className="sr-only" role="status">
          {stepLabel}
        </span>
      )}
    </div>
  )
}

export default StepHeader
