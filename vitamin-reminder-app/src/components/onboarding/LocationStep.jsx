import { useState } from 'react'
import { MapPin } from 'lucide-react'
import Button from '../ui/Button'
import StepHeader from './StepHeader'

function LocationStep({ headingRef, onBack, onDecision }) {
  const [status, setStatus] = useState('idle') // idle | requesting | error

  function handleAllow() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      onDecision(false, null)
      return
    }
    setStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onDecision(true, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        setStatus('error')
      },
      { timeout: 10_000 },
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <StepHeader onBack={onBack} stepLabel="Step 4 of 4: location access" />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <div className="mark mark-2" style={{ width: 64, height: 64 }} aria-hidden="true">
          <MapPin size={32} strokeWidth={2.75} />
        </div>
        <h2 ref={headingRef} tabIndex={-1} style={{ margin: 0 }}>
          Enable location
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', maxWidth: 260 }}>
          Solaris reads local UV index to time sun-dependent vitamins like D3. We never share your
          location.
        </p>
        {status === 'error' && (
          <p role="alert" className="field-error">
            We couldn't get your location. You can still continue — UV timing just won't be
            available.
          </p>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Button block onClick={handleAllow} disabled={status === 'requesting'}>
          {status === 'requesting' ? 'Requesting…' : 'Allow location'}
        </Button>
        <Button block variant="ghost" onClick={() => onDecision(false, null)}>
          Not now
        </Button>
      </div>
    </div>
  )
}

export default LocationStep
