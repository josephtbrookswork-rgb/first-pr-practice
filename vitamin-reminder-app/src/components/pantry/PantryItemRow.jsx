import { Package } from 'lucide-react'
import { getPantryStatus } from '../../utils/pantry'
import RowCard from '../ui/RowCard'
import Tag from '../ui/Tag'

const LEVEL_VARIANT = { healthy: 'accent2', low: 'warn', critical: 'danger' }

function PantryItemRow({ item, onSelect }) {
  const status = getPantryStatus(item)

  return (
    <RowCard onClick={() => onSelect(item.id)}>
      <div
        className="iconwrap"
        aria-hidden="true"
        style={{ width: 34, height: 34, background: 'var(--color-neutral-200)', color: 'var(--color-neutral-700)' }}
      >
        <Package size={16} aria-hidden="true" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          {item.costPerServing > 0 ? `$${item.costPerServing.toFixed(2)}/serving` : 'Cost not set'}
        </div>
      </div>
      <Tag variant={LEVEL_VARIANT[status.level]}>{item.servingsLeft} left</Tag>
    </RowCard>
  )
}

export default PantryItemRow
