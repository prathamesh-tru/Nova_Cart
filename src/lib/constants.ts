export const SITE_NAME = 'NovaCart'
export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
export const CURRENCY = 'USD'

export const NAV_LINKS = [
  { label: 'Shop', link: '/shop' },
  { label: 'Categories', link: '/categories' },
  { label: 'Blog', link: '/blog' },
  { label: 'About', link: '/about' },
  { label: 'Contact', link: '/contact' },
]

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
}

export const TRENDING_SEARCHES = [
  'Summer Dress',
  'Running Shoes',
  'Leather Bag',
  'Wireless Earbuds',
  'Skincare Kit',
]

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
}
