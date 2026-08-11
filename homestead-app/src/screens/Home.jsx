import { CheckCircle2, Camera, ChevronRight, ShoppingCart, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressRing from '../components/ui/ProgressRing.jsx'
import Checkbox from '../components/ui/Checkbox.jsx'
import { useFamily } from '../context/FamilyContext.jsx'

const todayStr = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

const isToday = (due) => due.startsWith('Today')

export default function Home({ onNavigate }) {
  const { viewer, chores, groceries, events } = useFamily()

  if (viewer.role === 'kid') return <KidHome onNavigate={onNavigate} />
  if (viewer.role === 'teen') return <TeenHome onNavigate={onNavigate} />

  const todays = chores.filter((c) => isToday(c.due))
  const done = todays.filter((c) => c.status === 'completed').length
  const awaiting = chores.filter((c) => c.status === 'awaiting_approval')
  const pendingGroceries = groceries.filter((g) => g.status === 'pending_request')
  const nextEvent = events.find((e) => e.dayOffset === 0)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-6">
      <div>
        <p className="text-sm text-neutral-600">{todayStr}</p>
        <h2 className="text-xl font-bold text-neutral-900">Good afternoon, {viewer.name}</h2>
      </div>

      <Card className="flex items-center gap-4 p-4">
        <ProgressRing value={done} total={todays.length || 1} />
        <div>
          <p className="font-semibold text-neutral-900">Family today</p>
          <p className="text-sm text-neutral-600">
            {done} of {todays.length} chores done so far
          </p>
        </div>
      </Card>

      {awaiting.length > 0 && (
        <section>
          <SectionHeader label="Needs your approval" count={awaiting.length} />
          <div className="flex flex-col gap-2">
            {awaiting.map((c) => (
              <ApprovalCard key={c.id} chore={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader label="Today across the family" />
        <Card className="divide-y divide-neutral-100 p-1">
          <MemberProgressRows chores={todays} />
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pendingGroceries.length > 0 && (
          <LinkCard
            icon={<ShoppingCart size={18} />}
            tone="amber"
            title="Grocery requests"
            subtitle={`${pendingGroceries.length} item${pendingGroceries.length > 1 ? 's' : ''} waiting on you`}
            onClick={() => onNavigate('grocery')}
          />
        )}
        {nextEvent && (
          <LinkCard
            icon={<Sparkles size={18} />}
            tone="slate"
            title="Up next"
            subtitle={`${nextEvent.title} · ${nextEvent.time}`}
            onClick={() => onNavigate('calendar')}
          />
        )}
      </div>
    </div>
  )
}

function TeenHome({ onNavigate }) {
  const { viewer, chores, completeChore } = useFamily()
  const mine = chores.filter((c) => c.assignedTo === viewer.id && isToday(c.due))

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-6">
      <div>
        <p className="text-sm text-neutral-600">{todayStr}</p>
        <h2 className="text-xl font-bold text-neutral-900">Hey {viewer.name}</h2>
      </div>

      <Card className="flex items-center gap-4 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-800">
          <Sparkles size={24} />
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{viewer.stars} stars</p>
          <p className="text-sm text-neutral-600">{viewer.streak}-day streak — keep it going</p>
        </div>
      </Card>

      <section>
        <SectionHeader label="Your tasks today" />
        <div className="flex flex-col gap-2">
          {mine.length === 0 && <EmptyRow text="Nothing due today. Nice." />}
          {mine.map((c) => (
            <Card key={c.id} className="flex items-center gap-3 p-3">
              <Checkbox
                checked={c.status !== 'pending'}
                onChange={() => c.status === 'pending' && completeChore(c.id)}
                aria-label={`Mark ${c.title} done`}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate font-medium ${c.status === 'completed' ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}
                >
                  {c.title}
                </p>
                <p className="text-xs text-neutral-500">{c.due}</p>
              </div>
              {c.status === 'awaiting_approval' && <Badge tone="amber">Waiting on approval</Badge>}
            </Card>
          ))}
        </div>
      </section>

      <LinkCard
        icon={<ShoppingCart size={18} />}
        tone="sage"
        title="Need something from the store?"
        subtitle="Add it to the family grocery list"
        onClick={() => onNavigate('grocery')}
      />
    </div>
  )
}

function KidHome({ onNavigate }) {
  const { viewer, chores, completeChore } = useFamily()
  const mine = chores.filter((c) => c.assignedTo === viewer.id && isToday(c.due))

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 pb-6 text-center">
      <Avatar member={viewer} size="lg" />
      <h2 className="text-2xl font-extrabold text-neutral-900">Hi {viewer.name}! ⭐</h2>
      <Card className="flex items-center gap-3 px-5 py-3">
        <Sparkles size={22} className="text-amber-600" />
        <span className="text-2xl font-extrabold text-neutral-900">{viewer.stars}</span>
        <span className="text-sm text-neutral-600">stars earned</span>
      </Card>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {mine.length === 0 && <EmptyRow text="All done for today! 🎉" />}
        {mine.map((c) => {
          const complete = c.status !== 'pending'
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => !complete && completeChore(c.id)}
              className={`flex flex-col items-center gap-2 rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)] transition-colors ${
                complete ? 'bg-sage-100' : 'bg-white active:bg-sage-50'
              }`}
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full ${complete ? 'bg-sage-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}
              >
                <CheckCircle2 size={32} />
              </span>
              <span className="text-lg font-bold text-neutral-900">{c.title}</span>
              <span className="text-sm text-neutral-500">+{c.points} stars</span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onNavigate('grocery')}
        className="text-sm font-semibold text-slate-600"
      >
        Ask for something at the store →
      </button>
    </div>
  )
}

function SectionHeader({ label, count }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{label}</h3>
      {count != null && <Badge tone="amber">{count}</Badge>}
    </div>
  )
}

function ApprovalCard({ chore }) {
  const { memberById, approveChore, declineChore } = useFamily()
  const member = memberById[chore.assignedTo]
  return (
    <Card className="flex items-center gap-3 p-3">
      {member && <Avatar member={member} size="sm" />}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-900">{chore.title}</p>
        <p className="flex items-center gap-1 text-xs text-neutral-500">
          {chore.requiresPhoto && <Camera size={12} />}
          {member?.name} · {chore.due}
        </p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={() => declineChore(chore.id)}
          className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600"
        >
          Redo
        </button>
        <button
          type="button"
          onClick={() => approveChore(chore.id)}
          className="rounded-full bg-sage-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Approve
        </button>
      </div>
    </Card>
  )
}

function MemberProgressRows({ chores }) {
  const { members } = useFamily()
  const withChores = members.filter((m) => chores.some((c) => c.assignedTo === m.id))

  if (withChores.length === 0) return <EmptyRow text="No chores scheduled for today." padded />

  return withChores.map((m) => {
    const mine = chores.filter((c) => c.assignedTo === m.id)
    const done = mine.filter((c) => c.status !== 'pending').length
    return (
      <div key={m.id} className="flex items-center gap-3 p-2.5">
        <Avatar member={m} size="sm" />
        <span className="flex-1 text-sm font-medium text-neutral-900">{m.name}</span>
        <span className="text-sm text-neutral-500">
          {done}/{mine.length}
        </span>
        <ChevronRight size={16} className="text-neutral-300" />
      </div>
    )
  })
}

function LinkCard({ icon, title, subtitle, onClick, tone }) {
  const tones = {
    amber: 'bg-amber-100 text-amber-800',
    slate: 'bg-slate-100 text-slate-700',
    sage: 'bg-sage-100 text-sage-700',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[var(--radius-md)] bg-white p-4 text-left shadow-[var(--shadow-card)]"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tones[tone]}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-neutral-900">{title}</span>
        <span className="block truncate text-xs text-neutral-500">{subtitle}</span>
      </span>
      <ChevronRight size={16} className="shrink-0 text-neutral-300" />
    </button>
  )
}

function EmptyRow({ text, padded }) {
  return <p className={`text-sm text-neutral-500 ${padded ? 'p-3' : ''}`}>{text}</p>
}
