import { useState } from 'react'
import { Pencil } from 'lucide-react'
import Screen from '../ui/Screen'
import Button from '../ui/Button'
import ProgressRing from './ProgressRing'
import { getPantryStatus } from '../../utils/pantry'

function ItemDetailScreen({ item, onBack, onEdit, onRemove }) {
  const [reorderStatus, setReorderStatus] = useState('idle')
  const status = getPantryStatus(item)

  return (
    <Screen
      title="Item detail"
      onBack={onBack}
      trailing={
        <button type="button" className="btn btn-icon btn-secondary" aria-label={`Edit ${item.name}`} onClick={onEdit}>
          <Pencil size={16} aria-hidden="true" />
        </button>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-3) 0' }}>
        <ProgressRing percent={status.percentLeft} label={`${status.percentLeft} percent remaining`} />
      </div>
      <h2 style={{ textAlign: 'center', margin: '0 0 var(--space-2)' }}>{item.name}</h2>

      {item.dosageMg ? (
        <div className="rowcard" style={{ justifyContent: 'space-between' }}>
          <span>Dosage</span>
          <span style={{ fontWeight: 600 }}>{item.dosageMg}mg</span>
        </div>
      ) : null}
      <div className="rowcard" style={{ justifyContent: 'space-between' }}>
        <span>Cost/serving</span>
        <span style={{ fontWeight: 600 }}>{item.costPerServing > 0 ? `$${item.costPerServing.toFixed(2)}` : '—'}</span>
      </div>
      <div className="rowcard" style={{ justifyContent: 'space-between' }}>
        <span>Servings left</span>
        <span style={{ fontWeight: 600 }}>
          {item.servingsLeft} / {item.totalServings}
        </span>
      </div>
      <div className="rowcard" style={{ justifyContent: 'space-between' }}>
        <span>Runs out</span>
        <span style={{ fontWeight: 600 }}>{status.daysLeft !== null ? `~${status.daysLeft} days` : '—'}</span>
      </div>

      <div style={{ flex: 1 }} />

      <p role="status" aria-live="polite" style={{ fontSize: 13, color: 'var(--color-accent-2-text)', textAlign: 'center', minHeight: 20 }}>
        {reorderStatus === 'done' ? "Marked for reorder — we'll remind you when it ships." : ''}
      </p>
      <Button block onClick={() => setReorderStatus('done')} disabled={reorderStatus === 'done'}>
        {reorderStatus === 'done' ? 'Reorder requested' : 'Reorder'}
      </Button>
      <Button block variant="secondary" onClick={() => onRemove(item.id)}>
        Remove from pantry
      </Button>
    </Screen>
  )
}

export default ItemDetailScreen
