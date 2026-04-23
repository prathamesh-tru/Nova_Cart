import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface PriceDisplayProps {
  price: number
  comparePrice?: number
  currency?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showBadge?: boolean
  className?: string
}

export function PriceDisplay({
  price,
  comparePrice,
  currency = 'USD',
  size = 'md',
  showBadge = true,
  className,
}: PriceDisplayProps) {
  const hasDiscount = comparePrice && comparePrice > price
  const discountPct = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

  const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl', xl: 'text-3xl' }

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('font-bold text-primary-800', textSizes[size])}>
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn('text-muted-foreground line-through', size === 'xl' ? 'text-xl' : 'text-sm')}>
            {formatPrice(comparePrice, currency)}
          </span>
          {showBadge && (
            <Badge variant="destructive" className="text-xs">
              -{discountPct}%
            </Badge>
          )}
        </>
      )}
    </div>
  )
}
