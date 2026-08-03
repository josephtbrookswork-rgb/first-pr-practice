import { useRef, useState } from 'react'
import { GripVertical } from 'lucide-react'

/**
 * Pointer-based (not HTML5 drag-and-drop, which has unreliable touch support
 * in mobile Safari/WKWebView) drag-to-reorder list. Row rects are captured
 * once at drag start so the target slot is computed from the pointer's
 * offset against those fixed measurements — reordering the underlying array
 * only happens once, on release, instead of on every pointermove. That
 * avoids the invalidated-measurements/jump bugs that come from re-measuring
 * the DOM mid-drag after a live array mutation re-renders it.
 */
function SortableList({ items, getKey, onReorder, renderItem }) {
  const containerRef = useRef(null)
  const dragRef = useRef(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [dropIndex, setDropIndex] = useState(null)

  function handlePointerDown(event, index) {
    const container = containerRef.current
    if (!container) return
    const rows = Array.from(container.querySelectorAll('[data-sortable-row]'))
    // Prefer a row's [data-sortable-anchor] (its fixed-height header) over
    // its own rect — a row can expand to include variable-height content
    // (e.g. a checklist's items), which would otherwise skew its measured
    // center and throw off which slot a drag lands in.
    const rects = rows.map((row) => (row.querySelector('[data-sortable-anchor]') ?? row).getBoundingClientRect())

    dragRef.current = {
      pointerId: event.pointerId,
      index,
      startClientY: event.clientY,
      centers: rects.map((rect) => rect.top + rect.height / 2),
      height: rects[index].height,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragIndex(index)
    setDragOffset(0)
    setDropIndex(index)
  }

  function handlePointerMove(event) {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return

    const deltaY = event.clientY - drag.startClientY
    setDragOffset(deltaY)

    // Where the dragged row's center currently sits, then find which
    // original slot's center it's now closest to.
    const draggedCenter = drag.centers[drag.index] + deltaY
    let nextIndex = 0
    let smallestDistance = Infinity
    drag.centers.forEach((center, i) => {
      const distance = Math.abs(center - draggedCenter)
      if (distance < smallestDistance) {
        smallestDistance = distance
        nextIndex = i
      }
    })
    setDropIndex(nextIndex)
  }

  function handlePointerUp() {
    const drag = dragRef.current
    if (!drag) return
    if (dropIndex !== null && dropIndex !== drag.index) {
      onReorder(drag.index, dropIndex)
    }
    dragRef.current = null
    setDragIndex(null)
    setDragOffset(0)
    setDropIndex(null)
  }

  return (
    <div ref={containerRef} role="list" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item, index) => {
        const isDragging = dragIndex === index
        const showDropLineAbove = dropIndex === index && dragIndex !== null && dragIndex > index
        const showDropLineBelow = dropIndex === index && dragIndex !== null && dragIndex < index
        return (
          <div
            key={getKey(item)}
            data-sortable-row
            role="listitem"
            style={{
              position: isDragging ? 'relative' : 'static',
              zIndex: isDragging ? 20 : 'auto',
              transform: isDragging ? `translateY(${dragOffset}px)` : 'none',
              boxShadow: isDragging ? 'var(--shadow-md)' : 'none',
              borderRadius: 'var(--radius-lg)',
              borderTop: showDropLineAbove ? '2px solid var(--color-accent-700)' : '2px solid transparent',
              borderBottom: showDropLineBelow ? '2px solid var(--color-accent-700)' : '2px solid transparent',
            }}
          >
            {renderItem(item, index, {
              dragHandleProps: {
                onPointerDown: (event) => handlePointerDown(event, index),
                onPointerMove: handlePointerMove,
                onPointerUp: handlePointerUp,
                onPointerCancel: handlePointerUp,
                style: { touchAction: 'none' },
              },
            })}
          </div>
        )
      })}
    </div>
  )
}

export function DragHandle({ style, ...rest }) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      {...rest}
      style={{
        width: 28,
        height: 28,
        minHeight: 28,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'grab',
        color: 'var(--color-text-muted)',
        ...style,
      }}
    >
      <GripVertical size={16} aria-hidden="true" />
    </button>
  )
}

export default SortableList
