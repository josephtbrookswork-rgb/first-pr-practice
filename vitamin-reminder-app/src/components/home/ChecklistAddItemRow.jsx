import { useState } from 'react'
import { Plus } from 'lucide-react'

function ChecklistAddItemRow({ onAdd }) {
  const [text, setText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 0' }}>
      <input
        className="input"
        type="text"
        placeholder="Add item"
        value={text}
        onChange={(event) => setText(event.target.value)}
        style={{ flex: 1, minHeight: 36, padding: '6px 12px' }}
      />
      <button
        type="submit"
        className="btn btn-icon btn-secondary"
        style={{ width: 36, height: 36, minHeight: 36 }}
        aria-label="Add item"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </form>
  )
}

export default ChecklistAddItemRow
