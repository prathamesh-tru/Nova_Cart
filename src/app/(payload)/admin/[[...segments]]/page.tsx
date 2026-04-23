import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '@payload-config'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export async function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata({ config: configPromise, params, searchParams })
}

export default async function Page({ params, searchParams }: Args) {
  return RootPage({ config: configPromise, importMap, params, searchParams })
}
