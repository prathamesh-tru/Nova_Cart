import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    create: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Vendor', value: 'vendor' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'customer',
      required: true,
      saveToJWT: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'loyaltyPoints',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'isEmailVerified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'zip', type: 'text' },
        { name: 'isDefault', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
