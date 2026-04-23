import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export function StarRating({ rating, max = 5, size = 'md', showValue, className }: StarRatingProps) {
  const sizes = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' }
  const iconSize = sizes[size]

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <Star
            key={i}
            className={cn(iconSize, filled ? 'fill-amber-400 text-amber-400' : partial ? 'fill-amber-200 text-amber-400' : 'fill-muted text-muted-foreground')}
          />
        )
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
