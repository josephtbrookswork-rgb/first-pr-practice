import { Check } from 'lucide-react'

export default function Checkbox({ checked, onChange, size = 24, 'aria-label': ariaLabel }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`flex shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        checked
          ? 'border-sage-600 bg-sage-600'
          : 'border-neutral-300 bg-white active:border-sage-500'
      }`}
      style={{ width: size, height: size }}
    >
      {checked && <Check size={size * 0.65} strokeWidth={3} className="text-white" />}
    </button>
  )
}
