import { Bell, BellOff } from 'lucide-react'
import { useAppState } from '../../state/AppStateContext'
import { PHASES } from '../../utils/phaseMeta'
import Switch from '../ui/Switch'

function ReminderSettings() {
  const { notificationsEnabled, setNotificationsEnabled, notificationPermission, reminders, updateReminder } = useAppState()

  const unsupported = notificationPermission === 'unsupported'
  const blocked = notificationPermission === 'denied'

  return (
    <section className="card card-sketch elev-sm" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} aria-label="Reminders">
      <div className="card-kicker">Reminders</div>

      <div className="rowcard" style={{ background: 'var(--color-bg)' }}>
        <div
          className="iconwrap"
          aria-hidden="true"
          style={{
            background: notificationsEnabled ? 'var(--color-accent-100)' : 'var(--color-neutral-200)',
            color: notificationsEnabled ? 'var(--color-accent-700)' : 'var(--color-neutral-700)',
          }}
        >
          {notificationsEnabled ? <Bell size={18} aria-hidden="true" /> : <BellOff size={18} aria-hidden="true" />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Vitamin reminders</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {unsupported
              ? 'Not supported in this browser'
              : blocked
                ? 'Blocked in your browser settings'
                : "Notify me when it's time to take my stack"}
          </div>
        </div>
        <Switch
          checked={notificationsEnabled}
          onChange={setNotificationsEnabled}
          label="Vitamin reminders"
          disabled={unsupported || blocked}
        />
      </div>

      {blocked && (
        <p className="field-error" role="alert" style={{ margin: 0 }}>
          Notifications are blocked for this site. Allow them in your browser's site settings, then turn this back on.
        </p>
      )}

      {notificationsEnabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {PHASES.map((phase) => {
            const reminder = reminders[phase.id]
            const Icon = phase.Icon
            return (
              <div key={phase.id} className="rowcard" style={{ background: 'var(--color-bg)' }}>
                <div
                  className="iconwrap"
                  aria-hidden="true"
                  style={{ width: 34, height: 34, background: phase.iconBg, color: phase.iconColor }}
                >
                  <Icon size={16} strokeWidth={2.75} aria-hidden="true" />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor={`reminder-time-${phase.id}`} style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    {phase.label}
                  </label>
                  <input
                    id={`reminder-time-${phase.id}`}
                    type="time"
                    className="input"
                    style={{ minHeight: 36, width: 130 }}
                    value={reminder.time}
                    disabled={!reminder.enabled}
                    onChange={(event) => updateReminder(phase.id, { time: event.target.value })}
                  />
                </div>
                <Switch
                  checked={reminder.enabled}
                  onChange={(enabled) => updateReminder(phase.id, { enabled })}
                  label={`${phase.label} reminder`}
                />
              </div>
            )
          })}
          <p className="field-hint" style={{ margin: 0 }}>
            Reminders fire only while Solaris is open in this browser tab, and only for phases with items still waiting.
          </p>
        </div>
      )}
    </section>
  )
}

export default ReminderSettings
