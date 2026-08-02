import { useState } from 'react'
import { useAppState } from '../../state/AppStateContext'
import { PHASES } from '../../utils/phaseMeta'
import Button from '../ui/Button'
import PhaseCard from './PhaseCard'
import AddItemSheet from './AddItemSheet'
import AddToCabinetPrompt from './AddToCabinetPrompt'
import AddPantrySheet from '../pantry/AddPantrySheet'

function ScheduleScreen() {
  const { scheduleItems, addScheduleItem, updateScheduleItem, removeScheduleItem, addPantryItem } = useAppState()
  const [addPhase, setAddPhase] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [cabinetPrompt, setCabinetPrompt] = useState(null)
  const [cabinetPrefill, setCabinetPrefill] = useState(null)

  const itemsByPhase = (phaseId) => scheduleItems.filter((item) => item.phase === phaseId)

  function handleCloseSheet() {
    setAddPhase(null)
    setEditingItem(null)
  }

  function handleSubmit(payload) {
    if (editingItem) {
      updateScheduleItem(editingItem.id, payload)
    } else {
      addScheduleItem(payload)
      setCabinetPrompt({ name: payload.name, dosageMg: payload.dosageMg })
    }
  }

  return (
    <>
      <h1 style={{ fontSize: 22 }}>My Schedule</h1>

      {scheduleItems.length === 0 ? (
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
          <p style={{ margin: 0, fontWeight: 600 }}>Nothing added yet</p>
          <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>
            Build your stack around dawn, midday and dusk.
          </p>
          <Button onClick={() => setAddPhase('dawn')}>+ Add supplement</Button>
        </div>
      ) : (
        PHASES.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            items={itemsByPhase(phase.id)}
            onAdd={() => setAddPhase(phase.id)}
            onEdit={(item) => setEditingItem(item)}
            onRemove={removeScheduleItem}
          />
        ))
      )}

      <AddItemSheet
        open={addPhase !== null || editingItem !== null}
        phase={editingItem?.phase ?? addPhase}
        item={editingItem}
        onClose={handleCloseSheet}
        onSubmit={handleSubmit}
      />

      <AddToCabinetPrompt
        open={cabinetPrompt !== null}
        itemName={cabinetPrompt?.name}
        onClose={() => setCabinetPrompt(null)}
        onConfirm={() => {
          setCabinetPrefill(cabinetPrompt)
          setCabinetPrompt(null)
        }}
      />

      <AddPantrySheet
        open={cabinetPrefill !== null}
        prefill={cabinetPrefill}
        onClose={() => setCabinetPrefill(null)}
        onSubmit={(payload) => {
          addPantryItem(payload)
          setCabinetPrefill(null)
        }}
      />
    </>
  )
}

export default ScheduleScreen
