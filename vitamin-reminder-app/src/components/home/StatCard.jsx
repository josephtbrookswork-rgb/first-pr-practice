function StatCard({ value, label, valueColor, children }) {
  return (
    <div className="card card-sketch elev-sm" style={{ flex: 1, background: 'var(--color-neutral-100)', padding: 'var(--space-4)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 30, lineHeight: 1, color: valueColor }}>
          {value}
        </span>
        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{label}</span>
        {children}
      </div>
    </div>
  )
}

export default StatCard
