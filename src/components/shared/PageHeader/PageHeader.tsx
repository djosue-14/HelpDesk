import type { ReactNode } from 'react'

export interface PageHeaderProps {
  label: string
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  titleClassName?: string
  className?: string
}

export default function PageHeader({ label, title, description, actions, titleClassName, className }: PageHeaderProps) {
  return (
    <div className={`flex items-start justify-between${className ? ` ${className}` : ''}`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">{label}</p>
        <h1 className={`text-[32px] leading-10 font-semibold text-on-surface${titleClassName ? ` ${titleClassName}` : ''}`}>{title}</h1>
        {description && (
          <p className="text-sm text-on-surface-variant mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">{actions}</div>
      )}
    </div>
  )
}
