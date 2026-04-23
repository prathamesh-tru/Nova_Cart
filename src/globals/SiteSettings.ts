import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Site Configuration' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'NovaCart' },
    { name: 'tagline', type: 'text', defaultValue: 'Discover Your Style' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'USD',
      options: ['USD', 'EUR', 'GBP', 'INR'].map((v) => ({ label: v, value: v })),
    },
    { name: 'timezone', type: 'text', defaultValue: 'UTC' },
    { name: 'supportEmail', type: 'email', defaultValue: 'support@novacart.demo' },
    { name: 'supportPhone', type: 'text', defaultValue: '+1 (800) 555-0100' },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    { name: 'maintenanceMode', type: 'checkbox', defaultValue: false },
    {
      name: 'announcement',
      type: 'text',
      defaultValue: '🎉 Free shipping on orders over $50 — Use code FREESHIP at checkout!',
    },
  ],
}
