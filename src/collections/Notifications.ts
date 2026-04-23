import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    defaultColumns: ['user', 'type', 'title', 'isRead', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { 'user.value': { equals: req.user.id } }
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Order Update', value: 'order_update' },
        { label: 'Promotion', value: 'promotion' },
        { label: 'Stock Alert', value: 'stock_alert' },
        { label: 'Review Reply', value: 'review_reply' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'message', type: 'text' },
    { name: 'isRead', type: 'checkbox', defaultValue: false },
    { name: 'link', type: 'text' },
    { name: 'createdAt', type: 'date' },
  ],
}
