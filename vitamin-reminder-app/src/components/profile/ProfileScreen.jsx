import { useState } from 'react'
import { MapPin, MapPinOff } from 'lucide-react'
import { useAppState } from '../../state/AppStateContext'
import Field from '../ui/Field'
import Button from '../ui/Button'
import ReminderSettings from './ReminderSettings'

function ProfileScreen() {
  const { profile, updateProfile, resetOnboarding } = useAppState()
  const [name, setName] = useState(profile?.name ?? '')
  const [age, setAge] = useState(profile?.age != null ? String(profile.age) : '')
  const [saved, setSaved] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const parsedAge = Number(age)
    updateProfile({
      name: name.trim() || profile?.name,
      age: Number.isInteger(parsedAge) && parsedAge > 0 ? parsedAge : profile?.age,
    })
    setSaved(true)
  }

  function handleRequestLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) =>
        updateProfile({
          locationGranted: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => updateProfile({ locationGranted: false }),
    )
  }

  return (
    <>
      <h1 style={{ fontSize: 22 }}>Profile</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} noValidate>
        <Field label="First name">
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="input"
              type="text"
              autoComplete="given-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setSaved(false)
              }}
            />
          )}
        </Field>
        <Field label="Age">
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="input"
              type="number"
              inputMode="numeric"
              value={age}
              onChange={(event) => {
                setAge(event.target.value)
                setSaved(false)
              }}
            />
          )}
        </Field>
        <Button type="submit">Save changes</Button>
        <p role="status" aria-live="polite" style={{ fontSize: 13, color: 'var(--color-accent-2-text)', margin: 0, minHeight: 18 }}>
          {saved ? 'Saved.' : ''}
        </p>
      </form>

      <div className="rowcard">
        <div
          className="iconwrap"
          aria-hidden="true"
          style={{
            background: profile?.locationGranted ? 'var(--color-accent-2-100)' : 'var(--color-neutral-200)',
            color: profile?.locationGranted ? 'var(--color-accent-2-800)' : 'var(--color-neutral-700)',
          }}
        >
          {profile?.locationGranted ? <MapPin size={18} aria-hidden="true" /> : <MapPinOff size={18} aria-hidden="true" />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Location access</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {profile?.locationGranted ? 'Enabled for UV timing' : 'Disabled — UV timing unavailable'}
          </div>
        </div>
        {!profile?.locationGranted && (
          <Button variant="secondary" onClick={handleRequestLocation}>
            Enable
          </Button>
        )}
      </div>

      <ReminderSettings />

      <div style={{ flex: 1 }} />

      {confirmingReset ? (
        <div className="card" style={{ gap: 'var(--space-3)' }}>
          <p style={{ margin: 0, fontSize: 13 }}>
            This clears your profile and takes you back through onboarding. Your schedule and pantry stay saved.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="secondary" onClick={() => setConfirmingReset(false)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={resetOnboarding} style={{ flex: 1 }}>
              Restart
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setConfirmingReset(true)}>
          Restart onboarding
        </Button>
      )}
    </>
  )
}

export default ProfileScreen
