import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugifyFn from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function slugify(text: string): string {
  return slugifyFn(text, { lower: true, strict: true })
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '…'
}

export function calculateReadTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  return `${base}${path}`
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`
  return `${count} ${plural ?? singular + 's'}`
}
