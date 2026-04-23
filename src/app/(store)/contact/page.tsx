export const dynamic = 'force-dynamic'

import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ContactForm } from './ContactForm'
import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

async function getContactData() {
  try {
    const payload = await getPayload()
    return await payload.findGlobal({ slug: 'contact-page', depth: 0 }) as any
  } catch {
    return null
  }
}

export default async function ContactPage() {
  const data = await getContactData()

  const pageTitle = data?.pageTitle ?? 'Get in Touch'
  const pageDescription = data?.pageDescription ?? "We'd love to hear from you. Send us a message and we'll respond within 24 hours."
  const contactInfo = data?.contactInfo ?? {}
  const email = contactInfo.email ?? 'support@novacart.demo'
  const phone = contactInfo.phone ?? '+1 (800) 555-0100'
  const address = contactInfo.address ?? '123 Fashion Ave, New York, NY 10001'
  const hours = contactInfo.hours ?? 'Mon–Fri: 9AM–6PM EST'
  const faq: { question: string; answer: string }[] = data?.faq ?? [
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-7 business days. Express shipping takes 1-2 business days.' },
    { question: 'What is your return policy?', answer: 'We offer a 30-day hassle-free return policy for all unused items in original condition.' },
    { question: 'Do you ship internationally?', answer: 'Yes! We ship to 50+ countries worldwide. Shipping costs and times vary by location.' },
  ]

  const contactItems = [
    { icon: Mail, label: 'Email', value: email },
    { icon: Phone, label: 'Phone', value: phone },
    { icon: MapPin, label: 'Address', value: address },
    { icon: Clock, label: 'Hours', value: hours },
  ]

  return (
    <div className="container py-8">
      <Breadcrumb items={[{ label: 'Contact' }]} className="mb-6" />
      <div className="mb-10">
        <h1 className="text-4xl font-sans font-bold mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground text-lg">{pageDescription}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2 bg-card rounded-2xl border p-8">
          <ContactForm />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border p-6 space-y-4">
            {contactItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {faq.length > 0 && (
            <div className="bg-card rounded-2xl border p-6">
              <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faq.map(({ question, answer }) => (
                  <div key={question}>
                    <p className="text-sm font-medium mb-1">{question}</p>
                    <p className="text-xs text-muted-foreground">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
