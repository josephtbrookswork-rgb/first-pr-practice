import { useState } from 'react'
import { Wifi, Phone, Stethoscope, PawPrint, KeyRound, Eye, EyeOff } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Sheet from '../components/ui/Sheet.jsx'
import { INFO_CARDS } from '../data/mockData.js'

const ICONS = { Wifi, Phone, Stethoscope, PawPrint, KeyRound }

export default function Hub() {
  const [openCard, setOpenCard] = useState(null)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-2 pb-6">
      <p className="mb-2 text-sm text-neutral-600">
        Quick reference for anyone looking after the house.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {INFO_CARDS.map((card) => {
          const Icon = ICONS[card.icon]
          return (
            <Card
              as="button"
              key={card.id}
              onClick={() => setOpenCard(card)}
              className="flex flex-col items-start gap-3 p-4 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Icon size={18} />
              </span>
              <span className="font-semibold text-neutral-900">{card.title}</span>
            </Card>
          )
        })}
      </div>

      <Sheet open={Boolean(openCard)} onClose={() => setOpenCard(null)} title={openCard?.title ?? ''}>
        {openCard && (
          <ul className="flex flex-col divide-y divide-neutral-100">
            {openCard.fields.map((f, i) => (
              <InfoField key={i} field={f} sensitive={openCard.sensitive} />
            ))}
          </ul>
        )}
      </Sheet>
    </div>
  )
}

function InfoField({ field, sensitive }) {
  const [revealed, setRevealed] = useState(false)
  const isSecret = sensitive && field.label.toLowerCase().includes('password')

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-xs text-neutral-500">{field.label}</p>
        <p className="truncate font-medium text-neutral-900">
          {isSecret && !revealed ? '••••••••••' : field.value}
        </p>
      </div>
      {isSecret && (
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? 'Hide password' : 'Reveal password'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600"
        >
          {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </li>
  )
}
