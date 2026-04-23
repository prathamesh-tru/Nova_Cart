import type { CollectionConfig } from 'payload'

export const Cart: CollectionConfig = {
  slug: 'carts',
  admin: {
    defaultColumns: ['user', 'sessionId', 'updatedAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { 'user.value': { equals: req.user.id } }
    },
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'sessionId', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'variant', type: 'text' },
        { name: 'quantity', type: 'number', min: 1 },
        { name: 'addedAt', type: 'date' },
      ],
    },
    { name: 'coupon', type: 'relationship', relationTo: 'coupons' },
    { name: 'updatedAt', type: 'date' },
  ],
}
