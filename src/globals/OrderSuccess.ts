import type { GlobalConfig } from 'payload'

export const OrderSuccess: GlobalConfig = {
  slug: 'order-success',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Order Confirmed!' },
    { name: 'subheading', type: 'text', defaultValue: 'Thank you for your purchase.' },
    { name: 'description', type: 'textarea', defaultValue: "You'll receive a confirmation email shortly with your order details and tracking information." },
    { name: 'stepsHeading', type: 'text', defaultValue: 'What happens next?' },
    {
      name: 'steps',
      type: 'array',
      admin: { description: 'Steps shown after a successful order' },
      fields: [
        { name: 'text', type: 'text' },
      ],
    },
  ],
}
