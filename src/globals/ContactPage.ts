import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'pageTitle', type: 'text', defaultValue: 'Get in Touch' },
    { name: 'pageDescription', type: 'textarea', defaultValue: "We'd love to hear from you. Send us a message and we'll respond within 24 hours." },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        { name: 'email', type: 'text', defaultValue: 'support@novacart.demo' },
        { name: 'phone', type: 'text', defaultValue: '+1 (800) 555-0100' },
        { name: 'address', type: 'text', defaultValue: '123 Fashion Ave, New York, NY 10001' },
        { name: 'hours', type: 'text', defaultValue: 'Mon–Fri: 9AM–6PM EST' },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      admin: { description: 'Frequently asked questions shown on the contact page' },
      fields: [
        { name: 'question', type: 'text' },
        { name: 'answer', type: 'textarea' },
      ],
    },
  ],
}
