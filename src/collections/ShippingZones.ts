import type { CollectionConfig } from 'payload'

export const ShippingZones: CollectionConfig = {
  slug: 'shipping-zones',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'countries'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'countries',
      type: 'array',
      fields: [{ name: 'country', type: 'text', admin: { description: 'ISO 3166-1 alpha-2' } }],
    },
    {
      name: 'rates',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'price', type: 'number' },
        { name: 'minDays', type: 'number' },
        { name: 'maxDays', type: 'number' },
        { name: 'freeAbove', type: 'number' },
      ],
    },
  ],
}
