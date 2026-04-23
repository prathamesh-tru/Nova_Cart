import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'usedCount', 'isActive'],
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.toUpperCase() : value)],
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed' },
        { label: 'Free Shipping', value: 'freeShipping' },
      ],
    },
    { name: 'value', type: 'number', min: 0 },
    { name: 'minOrderValue', type: 'number', defaultValue: 0 },
    { name: 'maxUses', type: 'number' },
    { name: 'usedCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'usedBy', type: 'relationship', relationTo: 'users', hasMany: true },
    { name: 'expiresAt', type: 'date' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
  ],
}
