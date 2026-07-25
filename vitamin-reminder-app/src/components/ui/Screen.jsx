import { ChevronLeft } from 'lucide-react'

function Screen({ title, onBack, trailing, children, background }) {
  return (
    <div className="screen-viewport" style={background ? { background } : undefined}>
      {(title || onBack) && (
        <header className="screen-header">
          {onBack ? (
            <button type="button" className="btn btn-icon btn-secondary" aria-label="Back" onClick={onBack}>
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
          ) : (
            <span style={{ width: 44 }} aria-hidden="true" />
          )}
          {title && <h1 className="screen-title">{title}</h1>}
          {trailing ?? <span style={{ width: 44 }} aria-hidden="true" />}
        </header>
      )}
      <div className="screen-main">{children}</div>
    </div>
  )
}

export default Screen
