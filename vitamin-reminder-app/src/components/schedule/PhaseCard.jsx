import { Plus, Pencil, X } from 'lucide-react'

function PhaseCard({ phase, items, onAdd, onEdit, onRemove }) {
  const { Icon, label, iconColor, iconBg } = phase

  return (
    <section className="card elev-sm" aria-labelledby={`phase-${phase.id}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="iconwrap" aria-hidden="true" style={{ width: 32, height: 32, background: iconBg, color: iconColor }}>
            <Icon size={16} strokeWidth={2.75} aria-hidden="true" />
          </div>
          <div>
            <h3 id={`phase-${phase.id}`} className="card-kicker" style={{ margin: 0 }}>
              {label}
            </h3>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              {items.length === 0 ? 'Nothing added yet' : `${items.length} you added`}
            </span>
          </div>
        </div>
        <button type="button" className="btn btn-icon btn-secondary" aria-label={`Add to ${label}`} onClick={onAdd}>
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>

      {items.length > 0 && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                background: 'var(--color-bg)',
                borderRadius: 999,
                fontSize: 13,
              }}
            >
              <span style={{ flex: 1 }}>
                {item.name}
                {item.dosageMg ? <span style={{ color: 'var(--color-text-muted)' }}> · {item.dosageMg}mg</span> : null}
                {item.anchor && <span style={{ color: 'var(--color-text-muted)' }}> · {item.anchor}</span>}
              </span>
              <button
                type="button"
                className="btn btn-icon btn-ghost"
                style={{ width: 40, height: 40, minHeight: 40 }}
                aria-label={`Edit ${item.name}`}
                onClick={() => onEdit(item)}
              >
                <Pencil size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="btn btn-icon btn-ghost"
                style={{ width: 40, height: 40, minHeight: 40 }}
                aria-label={`Remove ${item.name} from ${label}`}
                onClick={() => onRemove(item.id)}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PhaseCard
