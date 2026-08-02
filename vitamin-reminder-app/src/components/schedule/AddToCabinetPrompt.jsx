import Sheet from '../ui/Sheet'
import Button from '../ui/Button'

function AddToCabinetPrompt({ open, itemName, onClose, onConfirm }) {
  return (
    <Sheet open={open} onClose={onClose} title="Add to your cabinet?">
      <p style={{ margin: '0 0 var(--space-4)', fontSize: 14, color: 'var(--color-text-muted)' }}>
        Track servings and cost for {itemName} in your pantry so you know when to reorder.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Button block onClick={onConfirm}>
          Add to cabinet
        </Button>
        <Button block variant="secondary" onClick={onClose}>
          Not now
        </Button>
      </div>
    </Sheet>
  )
}

export default AddToCabinetPrompt
