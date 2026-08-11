import { useState } from 'react'
import { Camera, Repeat, CalendarClock } from 'lucide-react'
import Sheet from '../ui/Sheet.jsx'
import Avatar from '../ui/Avatar.jsx'
import Badge from '../ui/Badge.jsx'
import Checkbox from '../ui/Checkbox.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'

export default function ChoreDetailSheet({ chore, onClose }) {
  const {
    memberById,
    viewer,
    viewerIsManager,
    claimChore,
    toggleSubtask,
    completeChore,
    reopenChore,
    approveChore,
    declineChore,
  } = useFamily()
  const [photoPreview, setPhotoPreview] = useState(null)

  if (!chore) return null

  const member = chore.assignedTo === 'open' ? null : memberById[chore.assignedTo]
  const isMine = chore.assignedTo === viewer.id
  const canAct = isMine || viewerIsManager
  const photoReady = !chore.requiresPhoto || photoPreview || chore.photoSubmitted

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (file) setPhotoPreview(URL.createObjectURL(file))
  }

  function handleComplete() {
    completeChore(chore.id, { photoSubmitted: Boolean(photoPreview) })
    onClose()
  }

  return (
    <Sheet open={Boolean(chore)} onClose={onClose} title={chore.title}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {member ? (
            <span className="flex items-center gap-1.5 text-sm text-neutral-700">
              <Avatar member={member} size="sm" /> {member.name}
            </span>
          ) : (
            <Badge tone="slate">Open to claim</Badge>
          )}
          <Badge tone="neutral">
            <CalendarClock size={12} /> {chore.due}
          </Badge>
          {chore.recurring !== 'none' && (
            <Badge tone="neutral">
              <Repeat size={12} /> {chore.recurring}
            </Badge>
          )}
          <Badge tone="amber">+{chore.points} pts</Badge>
        </div>

        {chore.subtasks.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Steps
            </p>
            {chore.subtasks.map((s) => (
              <label key={s.id} className="flex items-center gap-3">
                <Checkbox
                  checked={s.done}
                  onChange={() => toggleSubtask(chore.id, s.id)}
                  size={20}
                  aria-label={s.title}
                />
                <span className={s.done ? 'text-neutral-400 line-through' : 'text-neutral-800'}>
                  {s.title}
                </span>
              </label>
            ))}
          </div>
        )}

        {chore.requiresPhoto && chore.status === 'pending' && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Photo confirmation required
            </p>
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Completion proof"
                className="h-32 w-32 rounded-[var(--radius-md)] object-cover"
              />
            ) : (
              <label className="flex h-24 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-neutral-300 text-sm text-neutral-500">
                <Camera size={18} /> Add photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhoto}
                />
              </label>
            )}
          </div>
        )}

        {chore.status === 'awaiting_approval' && (
          <div className="rounded-[var(--radius-md)] bg-amber-100 p-3 text-sm text-amber-800">
            Waiting for approval{member && !viewerIsManager ? '' : ` from a parent`}.
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {chore.assignedTo === 'open' && (
            <button
              type="button"
              onClick={() => {
                claimChore(chore.id)
                onClose()
              }}
              className="flex-1 rounded-[var(--radius-pill)] bg-slate-600 py-3 text-center text-sm font-semibold text-white"
            >
              Claim this chore
            </button>
          )}

          {chore.assignedTo !== 'open' && chore.status === 'pending' && canAct && (
            <button
              type="button"
              disabled={!photoReady}
              onClick={handleComplete}
              className="flex-1 rounded-[var(--radius-pill)] bg-sage-600 py-3 text-center text-sm font-semibold text-white disabled:opacity-40"
            >
              Mark complete
            </button>
          )}

          {chore.status === 'awaiting_approval' && viewerIsManager && (
            <>
              <button
                type="button"
                onClick={() => {
                  declineChore(chore.id)
                  onClose()
                }}
                className="flex-1 rounded-[var(--radius-pill)] border border-neutral-200 py-3 text-center text-sm font-semibold text-neutral-600"
              >
                Send back
              </button>
              <button
                type="button"
                onClick={() => {
                  approveChore(chore.id)
                  onClose()
                }}
                className="flex-1 rounded-[var(--radius-pill)] bg-sage-600 py-3 text-center text-sm font-semibold text-white"
              >
                Approve
              </button>
            </>
          )}

          {chore.status === 'completed' && viewerIsManager && (
            <button
              type="button"
              onClick={() => {
                reopenChore(chore.id)
                onClose()
              }}
              className="flex-1 rounded-[var(--radius-pill)] border border-neutral-200 py-3 text-center text-sm font-semibold text-neutral-600"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </Sheet>
  )
}
