import type { GlobalConfig } from 'payload'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'pageTitle', type: 'text', defaultValue: 'Style Journal' },
    { name: 'pageDescription', type: 'text', defaultValue: 'Fashion tips, trends, and inspiration from our style experts' },
    { name: 'featuredLabel', type: 'text', defaultValue: 'Featured', admin: { description: 'Label shown on the first (featured) post' } },
  ],
}
