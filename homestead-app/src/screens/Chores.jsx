import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import ChoreRow from '../components/chores/ChoreRow.jsx'
import ChoreDetailSheet from '../components/chores/ChoreDetailSheet.jsx'
import AddChoreSheet from '../components/chores/AddChoreSheet.jsx'
import { useFamily } from '../context/FamilyContext.jsx'
import { PAGE_COLOR } from '../lib/colors.js'

const color = PAGE_COLOR.chores

export default function Chores({ autoOpenAdd, onAutoOpenHandled }) {
  const { chores, viewer, viewerIsManager, completeChore, claimChore } = useFamily()
  const [openChoreId, setOpenChoreId] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const openChore = chores.find((c) => c.id === openChoreId) ?? null

  useEffect(() => {
    if (autoOpenAdd) {
      if (viewerIsManager) setAddOpen(true)
      onAutoOpenHandled?.()
    }
  }, [autoOpenAdd, viewerIsManager, onAutoOpenHandled])

  function quickComplete(chore) {
    if (chore.status !== 'pending') return
    if (chore.assignedTo === 'open') {
      claimChore(chore.id)
      return
    }
    if (chore.requiresPhoto) {
      setOpenChoreId(chore.id)
      return
    }
    completeChore(chore.id)
  }

  const awaiting = chores.filter((c) => c.status === 'awaiting_approval')
  const open = chores.filter((c) => c.assignedTo === 'open' && c.status === 'pending')
  const completed = chores.filter((c) => c.status === 'completed')

  const mine = chores.filter((c) => c.assignedTo === viewer.id && c.status === 'pending')
  const everyoneElsePending = chores.filter(
    (c) => c.status === 'pending' && c.assignedTo !== 'open' && c.assignedTo !== viewer.id,
  )

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 pb-6">
      {viewerIsManager && (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className={`flex items-center justify-center gap-2 self-start rounded-[var(--radius-pill)] px-4 py-2.5 text-sm font-semibold ${color.solid} ${color.solidText}`}
        >
          <Plus size={16} /> New chore
        </button>
      )}

      {awaiting.length > 0 && (
        <Section label="Awaiting approval">
          {awaiting.map((c) => (
            <ChoreRow key={c.id} chore={c} onOpen={(c) => setOpenChoreId(c.id)} onQuickComplete={quickComplete} />
          ))}
        </Section>
      )}

      <Section label={viewerIsManager ? "Today's chores" : 'Your chores'}>
        {(viewerIsManager ? [...mine, ...everyoneElsePending] : mine).length === 0 && (
          <EmptyText>Nothing pending — nice work.</EmptyText>
        )}
        {(viewerIsManager ? [...mine, ...everyoneElsePending] : mine).map((c) => (
          <ChoreRow key={c.id} chore={c} onOpen={(c) => setOpenChoreId(c.id)} onQuickComplete={quickComplete} />
        ))}
      </Section>

      {open.length > 0 && (
        <Section label="Open to claim">
          {open.map((c) => (
            <ChoreRow key={c.id} chore={c} onOpen={(c) => setOpenChoreId(c.id)} onQuickComplete={quickComplete} />
          ))}
        </Section>
      )}

      {completed.length > 0 && (
        <Section label="Completed">
          {completed.map((c) => (
            <ChoreRow key={c.id} chore={c} onOpen={(c) => setOpenChoreId(c.id)} onQuickComplete={quickComplete} />
          ))}
        </Section>
      )}

      <ChoreDetailSheet
        key={openChore?.id ?? 'none'}
        chore={openChore}
        onClose={() => setOpenChoreId(null)}
      />
      <AddChoreSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}

function Section({ label, children }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

function EmptyText({ children }) {
  return <p className="text-sm text-neutral-500">{children}</p>
}
