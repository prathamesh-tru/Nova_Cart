import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import slugifyFn from 'slugify'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'pricing.price', 'inventory.stock', 'updatedAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'active' } }
    },
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
      name: 'description',
      type: 'richText',
      required: true,
      editor: lexicalEditor({}),
    },
    {
      name: 'shortDesc',
      type: 'textarea',
      admin: { description: 'Max 200 characters' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
    },
    {
      name: 'colors',
      type: 'relationship',
      relationTo: 'colors',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'altText', type: 'text' },
        { name: 'isPrimary', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        { name: 'price', type: 'number', required: true, min: 0 },
        { name: 'comparePrice', type: 'number', min: 0 },
        {
          name: 'costPrice',
          type: 'number',
          min: 0,
          admin: { condition: (_, siblingData) => siblingData?.role === 'admin' },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: ['USD', 'EUR', 'GBP', 'INR'].map((v) => ({ label: v, value: v })),
        },
      ],
    },
    {
      name: 'inventory',
      type: 'group',
      fields: [
        { name: 'trackStock', type: 'checkbox', defaultValue: true },
        { name: 'stock', type: 'number', defaultValue: 0 },
        { name: 'lowStockAlert', type: 'number', defaultValue: 5 },
        { name: 'sku', type: 'text', unique: true },
        { name: 'barcode', type: 'text' },
        { name: 'weight', type: 'number' },
        {
          name: 'dimensions',
          type: 'group',
          fields: [
            { name: 'length', type: 'number' },
            { name: 'width', type: 'number' },
            { name: 'height', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'price', type: 'number' },
            { name: 'stock', type: 'number' },
            { name: 'sku', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDesc', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'shipping',
      type: 'group',
      fields: [
        { name: 'isFreeShipping', type: 'checkbox', defaultValue: false },
        {
          name: 'shippingClass',
          type: 'select',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Express', value: 'express' },
            { label: 'Heavy', value: 'heavy' },
          ],
        },
      ],
    },
    { name: 'isDigital', type: 'checkbox', defaultValue: false },
    { name: 'digitalFile', type: 'upload', relationTo: 'media' },
    {
      name: 'specs',
      type: 'array',
      admin: { description: 'Product specifications shown in the Specifications tab' },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'value', type: 'text' },
      ],
    },
    {
      name: 'ratings',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'average', type: 'number', defaultValue: 0 },
        { name: 'count', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
