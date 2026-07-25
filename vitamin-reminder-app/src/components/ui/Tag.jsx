const VARIANT_CLASS = {
  accent: 'tag-accent',
  accent2: 'tag-accent-2',
  neutral: 'tag-neutral',
  outline: 'tag-outline',
  warn: 'tag-warn',
  danger: 'tag-danger',
}

function Tag({ variant = 'neutral', as = 'span', className = '', children, ...rest }) {
  const classes = ['tag', VARIANT_CLASS[variant], as === 'button' ? 'tag-btn' : '', className]
    .filter(Boolean)
    .join(' ')

  if (as === 'button') {
    return (
      <button type="button" className={classes} {...rest}>
        {children}
      </button>
    )
  }

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}

export default Tag
