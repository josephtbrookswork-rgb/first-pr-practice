function IconButton({ label, className = '', children, ...rest }) {
  return (
    <button type="button" aria-label={label} className={`btn btn-icon btn-secondary ${className}`} {...rest}>
      {children}
    </button>
  )
}

export default IconButton
