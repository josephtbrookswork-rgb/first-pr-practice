function StatCard({ value, label, valueColor, onClick, ariaLabel, children }) {
  const Element = onClick ? 'button' : 'div'
  return (
    <Element
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={onClick ? (ariaLabel ?? `${value} ${label}`) : undefined}
      className="card card-sketch elev-sm"
      style={{
        flex: 1,
        background: 'var(--color-neutral-100)',
        padding: 'var(--space-4)',
        textAlign: 'left',
        font: 'inherit',
        cursor: onClick ? 'pointer' : 'default',
        color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 30, lineHeight: 1, color: valueColor }}>
          {value}
        </span>
        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{label}</span>
        {children}
      </div>
    </Element>
  )
}

export default StatCard
