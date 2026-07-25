import { useState } from 'react'
import { useAppState } from '../../state/AppStateContext'
import { PHASES } from '../../utils/phaseMeta'
import Button from '../ui/Button'
import PhaseCard from './PhaseCard'
import AddItemSheet from './AddItemSheet'

function ScheduleScreen() {
  const { scheduleItems, addScheduleItem, removeScheduleItem } = useAppState()
  const [addPhase, setAddPhase] = useState(null)

  const itemsByPhase = (phaseId) => scheduleItems.filter((item) => item.phase === phaseId)

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
            onRemove={removeScheduleItem}
          />
        ))
      )}

      <AddItemSheet
        open={addPhase !== null}
        phase={addPhase}
        onClose={() => setAddPhase(null)}
        onSubmit={addScheduleItem}
      />
    </>
  )
}

export default ScheduleScreen
