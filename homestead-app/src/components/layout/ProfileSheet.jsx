import Sheet from '../ui/Sheet.jsx'
import Avatar from '../ui/Avatar.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'
import { ROLE_LABEL } from '../../data/mockData.js'
import { clearProfile } from '../../lib/profileStorage.js'

export default function ProfileSheet({ open, onClose }) {
  const { viewer } = useFamily()

  return (
    <Sheet open={open} onClose={onClose} title="Your profile">
      <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-slate-50 p-3">
        <Avatar member={viewer} size="lg" />
        <span>
          <span className="block text-lg font-semibold text-neutral-900">{viewer.name}</span>
          <span className="block text-sm text-neutral-600">{ROLE_LABEL[viewer.role]}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          clearProfile()
          window.location.reload()
        }}
        className="mt-4 w-full rounded-[var(--radius-md)] border border-neutral-200 py-3 text-center text-sm font-semibold text-neutral-600"
      >
        Restart setup
      </button>
    </Sheet>
  )
}
