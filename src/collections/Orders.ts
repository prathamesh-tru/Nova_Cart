import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'total', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { 'user.value': { equals: req.user.id } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && !data?.orderNumber) {
          const now = new Date()
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
          const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
          data!.orderNumber = `ORD-${dateStr}-${rand}`
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'orderNumber', type: 'text', unique: true, admin: { readOnly: true } },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'variantLabel', type: 'text' },
        { name: 'quantity', type: 'number', min: 1 },
        { name: 'unitPrice', type: 'number' },
        { name: 'totalPrice', type: 'number' },
        { name: 'snapshot', type: 'json' },
      ],
    },
    { name: 'subtotal', type: 'number' },
    { name: 'discount', type: 'number', defaultValue: 0 },
    { name: 'tax', type: 'number', defaultValue: 0 },
    { name: 'shippingCost', type: 'number', defaultValue: 0 },
    { name: 'total', type: 'number' },
    { name: 'coupon', type: 'relationship', relationTo: 'coupons' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'zip', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        {
          name: 'provider',
          type: 'select',
          options: ['stripe', 'paypal', 'cod'].map((v) => ({ label: v.toUpperCase(), value: v })),
        },
        { name: 'stripePaymentIntentId', type: 'text' },
        { name: 'stripeChargeId', type: 'text' },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: ['pending', 'paid', 'failed', 'refunded'].map((v) => ({ label: v, value: v })),
        },
        { name: 'paidAt', type: 'date' },
      ],
    },
    {
      name: 'shippingInfo',
      type: 'group',
      fields: [
        { name: 'carrier', type: 'text' },
        { name: 'trackingNumber', type: 'text' },
        { name: 'estimatedDelivery', type: 'date' },
        { name: 'shippedAt', type: 'date' },
        { name: 'deliveredAt', type: 'date' },
      ],
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'statusHistory',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        { name: 'status', type: 'text' },
        { name: 'note', type: 'text' },
        { name: 'updatedAt', type: 'date' },
      ],
    },
  ],
}
