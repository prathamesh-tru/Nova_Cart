import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; href: string }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      {icon && <div className="mb-4 text-muted-foreground opacity-40">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>}
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
