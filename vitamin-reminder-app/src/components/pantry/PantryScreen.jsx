import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAppState } from '../../state/AppStateContext'
import PantryItemRow from './PantryItemRow'
import AddPantrySheet from './AddPantrySheet'
import ItemDetailScreen from './ItemDetailScreen'
import Button from '../ui/Button'

function PantryScreen() {
  const { pantryItems, addPantryItem, updatePantryItem, removePantryItem } = useAppState()
  const [addOpen, setAddOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  const selectedItem = pantryItems.find((item) => item.id === selectedId) ?? null

  if (selectedItem) {
    return (
      <div key="detail" className="page-transition" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <ItemDetailScreen
          item={selectedItem}
          onBack={() => setSelectedId(null)}
          onEdit={() => setEditingItem(selectedItem)}
          onRemove={(id) => {
            removePantryItem(id)
            setSelectedId(null)
          }}
        />
        <AddPantrySheet
          open={editingItem !== null}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(payload) => {
            updatePantryItem(editingItem.id, payload)
            setEditingItem(null)
          }}
        />
      </div>
    )
  }

  return (
    <div key="list" className="page-transition" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Pantry</h1>
        <button type="button" className="btn btn-icon btn-secondary" aria-label="Add pantry item" onClick={() => setAddOpen(true)}>
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>

      {pantryItems.length === 0 ? (
        <div
          className="card"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-3)',
            textAlign: 'center',
            padding: 'var(--space-8)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>Your cabinet is empty</p>
          <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>
            Add a bottle to start tracking servings and cost.
          </p>
          <Button onClick={() => setAddOpen(true)}>+ Add item</Button>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {pantryItems.map((item) => (
            <li key={item.id}>
              <PantryItemRow item={item} onSelect={setSelectedId} />
            </li>
          ))}
        </ul>
      )}

      <AddPantrySheet open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addPantryItem} />
    </div>
  )
}

export default PantryScreen
