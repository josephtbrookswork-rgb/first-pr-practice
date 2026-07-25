import { useEffect, useRef } from 'react'
import { Sun } from 'lucide-react'
import Button from '../ui/Button'

const AUTO_ADVANCE_MS = 2200

function SplashStep({ headingRef, onFinish }) {
  const finishRef = useRef(onFinish)
  finishRef.current = onFinish

  useEffect(() => {
    const timeoutId = setTimeout(() => finishRef.current(), AUTO_ADVANCE_MS)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
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
      <div className="mark splash-mark" style={{ width: 88, height: 88 }} aria-hidden="true">
        <Sun size={44} strokeWidth={2.5} />
      </div>
      <div>
        <h1 ref={headingRef} tabIndex={-1} style={{ fontSize: 26 }}>
          You're all set
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-muted)', margin: 0 }}>Your Solaris begins.</p>
      </div>
      <Button variant="ghost" onClick={onFinish}>
        Enter Solaris
      </Button>
    </div>
  )
}

export default SplashStep
