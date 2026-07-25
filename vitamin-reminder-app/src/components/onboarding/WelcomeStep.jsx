import { Sun } from 'lucide-react'
import Button from '../ui/Button'

function WelcomeStep({ headingRef, onNext }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <div className="mark" style={{ width: 64, height: 64 }} aria-hidden="true">
          <Sun size={32} strokeWidth={2.75} />
        </div>
        <h1 ref={headingRef} tabIndex={-1} style={{ fontSize: 28 }}>
          Welcome to Solaris
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-muted)', maxWidth: 260 }}>
          Your day has a rhythm. Solaris times your vitamins to it — and tracks what's in your
          cabinet along the way.
        </p>
      </div>
      <Button block onClick={onNext}>
        Get started
      </Button>
    </>
  )
}

export default WelcomeStep
