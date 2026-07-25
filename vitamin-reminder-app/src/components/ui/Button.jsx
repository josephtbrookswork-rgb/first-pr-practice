const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

function Button({ variant = 'primary', block = false, className = '', children, ...rest }) {
  const classes = ['btn', VARIANT_CLASS[variant], block ? 'btn-block' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
