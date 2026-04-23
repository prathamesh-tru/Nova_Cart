import { Badge } from '@/components/ui/badge'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = ORDER_STATUS_LABELS[status] ?? status
  const colorClass = ORDER_STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-800'
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colorClass, className)}>
      {label}
    </span>
  )
}
