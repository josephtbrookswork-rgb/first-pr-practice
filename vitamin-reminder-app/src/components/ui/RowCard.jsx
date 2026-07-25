function RowCard({ onClick, className = '', children, ...rest }) {
  const Element = onClick ? 'button' : 'div'
  return (
    <Element type={onClick ? 'button' : undefined} onClick={onClick} className={`rowcard ${className}`} {...rest}>
      {children}
    </Element>
  )
}

export default RowCard
