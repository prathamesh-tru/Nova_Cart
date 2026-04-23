import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const addressSchema = z.object({
  line1: z.string().min(1, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  zip: z.string().min(1, 'Postal code is required'),
})

export const checkoutSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  shippingAddress: addressSchema,
  sameAsBilling: z.boolean().default(true),
  billingAddress: addressSchema.optional(),
  shippingMethod: z.string().min(1, 'Please select a shipping method'),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(1, 'Title is required').max(100),
  body: z.string().min(10, 'Review must be at least 10 characters').max(2000),
})

export const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
})

export const couponSchema = z.object({
  code: z.string().min(3, 'Code too short').toUpperCase(),
})

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message too short'),
})

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type CouponInput = z.infer<typeof couponSchema>
export type ContactInput = z.infer<typeof contactSchema>
