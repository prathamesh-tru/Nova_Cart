'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  min?: number
  max?: number
  onChange: (val: number) => void
  className?: string
  size?: 'sm' | 'md'
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
  size = 'md',
}: QuantityStepperProps) {
  const btnClass = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'
  const inputClass = size === 'sm' ? 'h-7 w-10 text-xs' : 'h-9 w-12 text-sm'

  return (
    <div className={cn('flex items-center border rounded-lg overflow-hidden', className)}>
      <button
        className={cn('flex items-center justify-center transition-colors hover:bg-muted disabled:opacity-40', btnClass)}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className={cn('flex items-center justify-center font-medium border-x', inputClass)}>
        {value}
      </span>
      <button
        className={cn('flex items-center justify-center transition-colors hover:bg-muted disabled:opacity-40', btnClass)}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}
