import { Check } from 'lucide-react'
import Sheet from '../ui/Sheet.jsx'
import Avatar from '../ui/Avatar.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'
import { ROLE_LABEL } from '../../data/mockData.js'

export default function ProfileSwitcher({ open, onClose }) {
  const { members, viewer, setViewerId } = useFamily()

  return (
    <Sheet open={open} onClose={onClose} title="Viewing as">
      <p className="mb-4 -mt-2 text-sm text-neutral-600">
        Prototype tool — switch who you're signed in as to see each family member's view.
      </p>
      <ul className="flex flex-col gap-1">
        {members.map((m) => {
          const isCurrent = m.id === viewer.id
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  setViewerId(m.id)
                  onClose()
                }}
                className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] p-3 text-left transition-colors ${
                  isCurrent ? 'bg-slate-50' : 'active:bg-neutral-100'
                }`}
              >
                <Avatar member={m} />
                <span className="flex-1">
                  <span className="block font-semibold text-neutral-900">{m.name}</span>
                  <span className="block text-xs text-neutral-600">{ROLE_LABEL[m.role]}</span>
                </span>
                {isCurrent && <Check size={18} className="text-slate-600" />}
              </button>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
