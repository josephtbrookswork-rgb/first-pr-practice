function IconWrap({ background, color, size = 38, className = '', children }) {
  return (
    <div
      className={`iconwrap ${className}`}
      style={{ width: size, height: size, background, color }}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}

export default IconWrap
