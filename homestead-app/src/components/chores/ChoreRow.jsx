import { Camera, Repeat, ListChecks } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Avatar from '../ui/Avatar.jsx'
import Badge from '../ui/Badge.jsx'
import Checkbox from '../ui/Checkbox.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'

export default function ChoreRow({ chore, onOpen, onQuickComplete }) {
  const { memberById } = useFamily()
  const member = chore.assignedTo === 'open' ? null : memberById[chore.assignedTo]
  const subtaskDone = chore.subtasks.filter((s) => s.done).length

  return (
    <Card className="flex w-full items-center gap-3 p-3">
      <Checkbox
        checked={chore.status !== 'pending'}
        onChange={() => onQuickComplete(chore)}
        aria-label={`Mark ${chore.title} done`}
      />

      <button
        type="button"
        onClick={() => onOpen(chore)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p
            className={`truncate font-medium ${
              chore.status === 'completed' ? 'text-neutral-400 line-through' : 'text-neutral-900'
            }`}
          >
            {chore.title}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500">
            <span>{chore.due}</span>
            {chore.recurring !== 'none' && (
              <span className="flex items-center gap-0.5">
                <Repeat size={11} /> {chore.recurring}
              </span>
            )}
            {chore.requiresPhoto && (
              <span className="flex items-center gap-0.5">
                <Camera size={11} /> photo
              </span>
            )}
            {chore.subtasks.length > 0 && (
              <span className="flex items-center gap-0.5">
                <ListChecks size={11} /> {subtaskDone}/{chore.subtasks.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {member ? <Avatar member={member} size="sm" /> : <Badge tone="slate">Open</Badge>}
          {chore.status === 'awaiting_approval' && <Badge tone="amber">Pending</Badge>}
        </div>
      </button>
    </Card>
  )
}
