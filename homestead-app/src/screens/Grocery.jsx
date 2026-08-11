import { useState } from 'react'
import { Plus, X, Check, Trash2 } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Checkbox from '../components/ui/Checkbox.jsx'
import { useFamily } from '../context/FamilyContext.jsx'
import { AISLES, FREQUENT_ITEMS } from '../data/mockData.js'

export default function Grocery() {
  const {
    groceries,
    memberById,
    viewerIsManager,
    addGroceryItem,
    toggleGroceryItem,
    clearCheckedGroceries,
    approveGroceryRequest,
    declineGroceryRequest,
  } = useFamily()
  const [newItem, setNewItem] = useState('')
  const [newAisle, setNewAisle] = useState(AISLES[0])

  const active = groceries.filter((g) => g.status === 'active')
  const requests = groceries.filter((g) => g.status === 'pending_request')
  const hasChecked = active.some((g) => g.checked)

  function handleAdd(e) {
    e.preventDefault()
    if (!newItem.trim()) return
    addGroceryItem(newItem, newAisle)
    setNewItem('')
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 pb-2">
      {requests.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {viewerIsManager ? 'Requests to approve' : 'Your pending requests'}
          </h3>
          <div className="flex flex-col gap-2">
            {requests.map((item) => {
              const requester = memberById[item.requestedBy]
              return (
                <Card key={item.id} className="flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.aisle}
                      {requester ? ` · requested by ${requester.name}` : ''}
                    </p>
                  </div>
                  {viewerIsManager ? (
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => declineGroceryRequest(item.id)}
                        aria-label="Decline"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500"
                      >
                        <X size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => approveGroceryRequest(item.id)}
                        aria-label="Approve"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-600 text-white"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <Badge tone="amber">Waiting</Badge>
                  )}
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {AISLES.map((aisle) => {
        const items = active.filter((g) => g.aisle === aisle)
        if (items.length === 0) return null
        return (
          <section key={aisle}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              {aisle}
            </h3>
            <Card className="divide-y divide-neutral-100 p-1">
              {items.map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-2.5">
                  <Checkbox
                    checked={Boolean(item.checked)}
                    onChange={() => toggleGroceryItem(item.id)}
                    size={22}
                    aria-label={item.name}
                  />
                  <span
                    className={`text-sm ${item.checked ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}
                  >
                    {item.name}
                  </span>
                </label>
              ))}
            </Card>
          </section>
        )
      })}

      {hasChecked && (
        <button
          type="button"
          onClick={clearCheckedGroceries}
          className="flex items-center justify-center gap-2 self-start text-sm font-medium text-neutral-500"
        >
          <Trash2 size={14} /> Clear checked items
        </button>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Frequently bought
        </h3>
        <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1">
          {FREQUENT_ITEMS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => addGroceryItem(name)}
              className="flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-[var(--shadow-card)]"
            >
              <Plus size={13} /> {name}
            </button>
          ))}
        </div>
      </section>

      <form
        onSubmit={handleAdd}
        className="safe-bottom sticky bottom-0 -mx-5 flex gap-2 border-t border-neutral-200 bg-neutral-100/95 px-5 py-3 backdrop-blur"
      >
        <select
          value={newAisle}
          onChange={(e) => setNewAisle(e.target.value)}
          className="rounded-[var(--radius-md)] border border-neutral-200 bg-white px-2 text-sm text-neutral-700"
          aria-label="Aisle"
        >
          {AISLES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={viewerIsManager ? 'Add an item…' : 'Request an item…'}
          className="flex-1 rounded-[var(--radius-md)] border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-slate-400"
        />
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-slate-600 text-white"
          aria-label="Add item"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  )
}
