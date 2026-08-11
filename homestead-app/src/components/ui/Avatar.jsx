import { MEMBER_COLOR } from '../../lib/colors.js'

export default function Avatar({ member, size = 'md' }) {
  const palette = MEMBER_COLOR[member.color]
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${palette.bg} ${sizes[size]}`}
      aria-hidden="true"
    >
      {member.initials}
    </div>
  )
}
