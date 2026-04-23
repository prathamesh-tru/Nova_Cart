import type { CollectionConfig } from 'payload'

export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  admin: {
    defaultColumns: ['user', 'name', 'isPublic'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { 'user.value': { equals: req.user.id } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'name', type: 'text', defaultValue: 'My Wishlist' },
    { name: 'isPublic', type: 'checkbox', defaultValue: false },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'addedAt', type: 'date' },
      ],
    },
  ],
}
