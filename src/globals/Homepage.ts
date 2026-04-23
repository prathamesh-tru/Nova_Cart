import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: { group: 'Site Configuration' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Discover Your Perfect Style' },
        { name: 'subheading', type: 'text', defaultValue: 'Curated fashion for the modern lifestyle. Premium quality, unbeatable prices.' },
        { name: 'ctaText', type: 'text', defaultValue: 'Shop Now' },
        { name: 'ctaLink', type: 'text', defaultValue: '/shop' },
        { name: 'secondaryCtaText', type: 'text', defaultValue: 'Our Story' },
        { name: 'secondaryCtaLink', type: 'text', defaultValue: '/about' },
        { name: 'bgImage', type: 'upload', relationTo: 'media' },
        {
          name: 'stats',
          type: 'array',
          admin: { description: 'Stats shown below hero buttons (e.g. "10k+ Products")' },
          fields: [
            { name: 'value', type: 'text' },
            { name: 'label', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'featuredCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      maxRows: 6,
      admin: { description: 'Select up to 6 categories to show in the homepage grid' },
    },
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 12,
      admin: { description: 'Hand-pick products for the Featured carousel. Leave empty to show latest products.' },
    },
    {
      name: 'promoBanners',
      type: 'array',
      maxRows: 2,
      admin: { description: 'Side-by-side promotional banners (max 2)' },
      fields: [
        { name: 'label', type: 'text', admin: { description: 'Small label above title, e.g. "New In"' } },
        { name: 'title', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text' },
      ],
    },
    {
      name: 'trustBadges',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Trust badges shown below promo banners' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Truck (Shipping)', value: 'truck' },
            { label: 'Refresh (Returns)', value: 'refresh' },
            { label: 'Shield (Security)', value: 'shield' },
            { label: 'Headphones (Support)', value: 'headphones' },
          ],
        },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'text' },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Get 10% Off Your First Order' },
        { name: 'subheading', type: 'text', defaultValue: 'Subscribe to our newsletter and unlock exclusive deals, early access to sales, and style inspiration.' },
      ],
    },
  ],
}
