import { hdGetDept } from '@/data/seed'
import type { Person } from '@/data/types'

interface AvatarProps {
  user: Person | null | undefined
  size?: 'sm' | 'md' | 'lg'
}

const SIZE: Record<string, string> = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
}

export default function Avatar({ user, size = 'md' }: AvatarProps) {
  if (!user) {
    return (
      <span className={`${SIZE[size]} rounded-full bg-surface-container dark:bg-dark-surface-container flex items-center justify-center font-bold text-on-surface-variant dark:text-dark-on-surface-variant`}>
        —
      </span>
    )
  }
  const dept = hdGetDept(user.dept)
  const bg = dept?.color ?? '#6750A4'
  return (
    <span
      className={`${SIZE[size]} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ background: bg, color: 'white' }}
      title={user.name}
    >
      {user.initials}
    </span>
  )
}
