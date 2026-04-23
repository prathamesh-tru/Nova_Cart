'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnnouncementBarProps {
  message?: string | null
}

export function AnnouncementBar({ message }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed || !message) return null
  return (
    <div className="relative bg-primary-800 text-white text-sm py-2.5 px-4 text-center font-medium">
      <span dangerouslySetInnerHTML={{ __html: message }} />
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
