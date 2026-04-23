export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, User } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { getPayload } from '@/lib/payload'
import { calculateReadTime } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog' }

export default async function BlogPage() {
  let posts: any[] = []
  let pageTitle = 'Style Journal'
  let pageDescription = 'Fashion tips, trends, and inspiration from our style experts'
  let featuredLabel = 'Featured'

  try {
    const payload = await getPayload()
    const [blogPageData, postsResult] = await Promise.all([
      payload.findGlobal({ slug: 'blog-page', depth: 0 }).catch(() => null) as any,
      payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 12, sort: '-publishedAt', depth: 1 }).catch(() => ({ docs: [] })),
    ])

    if (blogPageData) {
      pageTitle = blogPageData.pageTitle ?? pageTitle
      pageDescription = blogPageData.pageDescription ?? pageDescription
      featuredLabel = blogPageData.featuredLabel ?? featuredLabel
    }

    posts = postsResult.docs.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage?.url ?? null,
      author: p.author ? `${p.author.firstName} ${p.author.lastName}` : 'NovaCart Team',
      publishedAt: p.publishedAt ?? p.createdAt,
      readTime: calculateReadTime(JSON.stringify(p.content ?? '') + (p.excerpt ?? '')),
    }))
  } catch {}

  return (
    <div className="container py-8">
      <Breadcrumb items={[{ label: 'Blog' }]} className="mb-6" />
      <div className="mb-10">
        <h1 className="text-4xl font-sans font-bold mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground text-lg">{pageDescription}</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl font-semibold mb-2">No posts yet</p>
          <p className="text-sm">Check back soon for style tips and inspiration.</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          <Link href={`/blog/${posts[0].slug}`} className="group block mb-10 rounded-3xl overflow-hidden border hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto bg-gray-100">
                {posts[0].coverImage ? (
                  <Image src={posts[0].coverImage} alt={posts[0].title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600" />
                )}
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-xs font-medium text-black uppercase tracking-wider mb-3">{featuredLabel}</span>
                <h2 className="text-2xl md:text-3xl font-sans font-bold mb-3 group-hover:underline leading-tight">{posts[0].title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{posts[0].author}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{posts[0].readTime} min read</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Grid */}
          {posts.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.slice(1).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-500" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-2">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <h3 className="font-semibold leading-tight mb-2 group-hover:underline line-clamp-2">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
