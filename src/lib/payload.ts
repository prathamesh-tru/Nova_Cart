import configPromise from '@payload-config'
import { getPayload as getPayloadInstance } from 'payload'
import { cache } from 'react'

export const getPayload = cache(async () => {
  return getPayloadInstance({ config: configPromise })
})
