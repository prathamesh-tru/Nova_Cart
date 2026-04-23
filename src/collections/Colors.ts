import type { CollectionConfig } from 'payload'
import slugifyFn from 'slugify'

export const Colors: CollectionConfig = {
  slug: 'colors',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'hex', 'slug'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data.slug) {
          data.slug = slugifyFn(data.name, { lower: true, strict: true })
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'hex',
      type: 'text',
      required: true,
      admin: {
        description: 'Hex code shown as a colour swatch, e.g. #FF5733',
        placeholder: '#000000',
      },
    },
  ],
}
