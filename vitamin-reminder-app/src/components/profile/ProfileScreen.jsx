import { useState } from 'react'
import { MapPin, MapPinOff, Check, HelpCircle, ChevronRight } from 'lucide-react'
import { useAppState } from '../../state/AppStateContext'
import Field from '../ui/Field'
import Button from '../ui/Button'
import ReminderSettings from './ReminderSettings'
import TutorialWalkthrough from '../tutorial/TutorialWalkthrough'

const THEME_OPTIONS = [
  { id: 'default', label: 'Default', swatch: '#c67139' },
  { id: 'pink', label: 'Pink', swatch: '#c06d95' },
  { id: 'blue', label: 'Blue', swatch: '#6690d2' },
  { id: 'purple', label: 'Purple', swatch: '#9270cb' },
]

function ProfileScreen() {
  const { profile, updateProfile, resetOnboarding, theme, setTheme } = useAppState()
  const [name, setName] = useState(profile?.name ?? '')
  const [age, setAge] = useState(profile?.age != null ? String(profile.age) : '')
  const [saved, setSaved] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [tutorialOpen, setTutorialOpen] = useState(false)

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

  if (tutorialOpen) {
    return <TutorialWalkthrough onClose={() => setTutorialOpen(false)} />
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

      <button type="button" className="rowcard" onClick={() => setTutorialOpen(true)}>
        <div
          className="iconwrap"
          aria-hidden="true"
          style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-700)' }}
        >
          <HelpCircle size={18} aria-hidden="true" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>How to Use Solaris</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Revisit the quick tips for each screen</div>
        </div>
        <ChevronRight size={18} aria-hidden="true" style={{ color: 'var(--color-text-muted)' }} />
      </button>

      <ReminderSettings />

      <div className="card" style={{ gap: 'var(--space-3)' }}>
        <div className="card-title">Theme</div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className="chip"
              aria-pressed={theme === option.id}
              onClick={() => setTheme(option.id)}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: option.swatch,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {theme === option.id && <Check size={10} strokeWidth={3} color="#fff" />}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

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
