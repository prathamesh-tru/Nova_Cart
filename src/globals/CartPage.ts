import type { GlobalConfig } from 'payload'

export const CartPage: GlobalConfig = {
  slug: 'cart-page',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'upsellHeading',
      type: 'text',
      defaultValue: 'You Might Also Like',
      admin: { description: 'Heading for the upsell section below the cart' },
    },
    {
      name: 'upsellProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 4,
      admin: { description: 'Hand-pick products shown in "You Might Also Like" on the cart page' },
    },
  ],
}
