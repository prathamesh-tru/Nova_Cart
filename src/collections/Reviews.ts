import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'rating', 'product', 'user', 'isApproved'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { isApproved: { equals: true } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    { name: 'isVerified', type: 'checkbox', defaultValue: false },
    { name: 'isApproved', type: 'checkbox', defaultValue: false },
    { name: 'reply', type: 'textarea' },
  ],
}
