import Sheet from './Sheet'
import Button from './Button'

function TutorialSheet({ open, onClose, tutorial }) {
  if (!tutorial) return null

  return (
    <Sheet open={open} onClose={onClose} title={tutorial.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {tutorial.steps.map(({ Icon, text }, index) => (
          <div key={index} className="rowcard" style={{ padding: 'var(--space-3)', background: 'var(--color-bg)' }}>
            <div
              className="iconwrap"
              aria-hidden="true"
              style={{ width: 38, height: 38, background: 'var(--color-accent-100)', color: 'var(--color-accent-700)' }}
            >
              <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <p style={{ flex: 1, margin: 0, fontSize: 13.5, lineHeight: 1.4 }}>{text}</p>
          </div>
        ))}
      </div>
      <Button onClick={onClose}>Got it</Button>
    </Sheet>
  )
}

export default TutorialSheet
