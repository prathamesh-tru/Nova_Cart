import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { trusearchPlugin } from '@trusearch/payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Colors } from './collections/Colors'
import { Orders } from './collections/Orders'
import { Cart } from './collections/Cart'
import { Reviews } from './collections/Reviews'
import { Coupons } from './collections/Coupons'
import { Posts } from './collections/Posts'
import { Notifications } from './collections/Notifications'

import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { Homepage } from './globals/Homepage'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { CartPage } from './globals/CartPage'
import { OrderSuccess } from './globals/OrderSuccess'
import { BlogPage } from './globals/BlogPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const trusearchOptions = {
  engine: {
    baseUrl: process.env.TRUSEARCH_ENGINE_URL,
    apiKey: process.env.TRUSEARCH_API_KEY,
  },
  defaultIndexId: 'novacart',
  collections: [
    {
      slug: 'products',
      titleField: 'name',
      bodyField: 'shortDesc',
      urlField: (doc: any) => `/shop/${doc.slug}`,
      includeFields: ['slug', 'pricing', 'categories', 'ratings', 'inventory', 'status', 'images'],
      excludeFields: ['description', 'specs', 'variants'],
    },
    {
      slug: 'posts',
      titleField: 'title',
      bodyField: 'excerpt',
      urlField: (doc: any) => `/blog/${doc.slug}`,
      includeFields: ['slug', 'category', 'tags', 'readTime', 'status'],
    },
    {
      slug: 'categories',
      titleField: 'name',
      bodyField: 'description',
      urlField: (doc: any) => `/shop?category=${doc.slug}`,
      includeFields: ['slug'],
    },
    {
      slug: 'orders',
      titleField: 'orderNumber',
      bodyField: 'status',
      urlField: (doc: any) => `/account/orders/${doc.id}`,
      includeFields: ['status', 'user', 'total', 'createdAt'],
      excludeFields: ['items'],
    },
    {
      slug: 'reviews',
      titleField: 'title',
      bodyField: 'body',
      urlField: (doc: any) => `/shop/${(doc.product as any)?.slug ?? ''}#reviews`,
      includeFields: ['rating', 'isApproved', 'isVerified', 'product'],
      excludeFields: ['images', 'reply'],
    },
    {
      slug: 'coupons',
      titleField: 'code',
      bodyField: 'type',
      urlField: () => '/admin/collections/coupons',
      includeFields: ['type', 'value', 'isActive', 'expiresAt', 'minOrderValue'],
    },
    {
      slug: 'notifications',
      titleField: 'title',
      bodyField: 'message',
      urlField: (doc: any) => (doc.link as string) ?? '/account',
      includeFields: ['type', 'isRead', 'user', 'link'],
    },
    {
      slug: 'carts',
      titleField: 'sessionId',
      bodyField: 'sessionId',
      urlField: (doc: any) => `/account/cart/${doc.id}`,
      includeFields: ['user', 'coupon', 'updatedAt'],
      excludeFields: ['items'],
    },
    {
      slug: 'brands',
      titleField: 'name',
      bodyField: 'description',
      urlField: (doc: any) => `/shop?brand=${doc.slug}`,
      includeFields: ['slug', 'description', 'logo'],
    },
    {
      slug: 'colors',
      titleField: 'name',
      bodyField: 'name',
      urlField: (doc: any) => `/shop?color=${doc.slug}`,
      includeFields: ['slug', 'hex'],
    },
    {
      slug: 'media',
      titleField: 'alt',
      bodyField: 'alt',
      urlField: (doc: any) => (doc.url as string) ?? '',
      includeFields: ['url', 'alt', 'mimeType', 'filename'],
    },
  ],
  excludeCollections: ['users'],
  batch: { size: 50, flushIntervalMs: 2000 },
  settingsGlobal: { adminGroup: 'TruSearch' },
}

const payloadConfig = buildConfig({
  plugins: [
    trusearchPlugin(trusearchOptions) as any,
  ],
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'NovaCart Admin',
      description: 'NovaCart CMS Admin Panel',
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  cors: [
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    'http://localhost:3000',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    'http://localhost:3000',
  ],
  collections: [
    Users,
    Media,
    Products,
    Categories,
    Brands,
    Colors,
    Orders,
    Cart,
    Reviews,
    Coupons,
    Posts,
    Notifications,
  ],
  globals: [SiteSettings, Navigation, Homepage, AboutPage, ContactPage, CartPage, OrderSuccess, BlogPage],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? 'postgres://novacart:novacart123@localhost:5432/novacart',
    },
  }),
  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
  localization: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  secret: process.env.PAYLOAD_SECRET ?? 'fallback-secret-change-in-production',
})
;(payloadConfig as any).trusearchOptions = trusearchOptions
export default payloadConfig
