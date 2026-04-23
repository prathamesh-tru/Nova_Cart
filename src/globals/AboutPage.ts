import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'Our Story' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'missionTitle', type: 'text', defaultValue: 'Fashion That Empowers' },
    { name: 'missionText', type: 'textarea', defaultValue: 'Founded in 2020, NovaCart was born from a simple belief: everyone deserves to feel confident in what they wear. We curate premium fashion from around the world, making style accessible without compromising quality.' },
    { name: 'missionText2', type: 'textarea', defaultValue: 'Today, we serve over 50,000 customers across 50+ countries, offering everything from everyday essentials to luxury statement pieces — all carefully selected by our team of fashion experts.' },
    { name: 'missionImage', type: 'upload', relationTo: 'media' },
    {
      name: 'stats',
      type: 'array',
      admin: { description: 'Key metrics shown in the stats row' },
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    { name: 'teamHeading', type: 'text', defaultValue: 'Meet Our Team' },
    {
      name: 'team',
      type: 'array',
      admin: { description: 'Team members shown on the about page' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'ctaTitle', type: 'text', defaultValue: 'Ready to Elevate Your Style?' },
    { name: 'ctaText', type: 'textarea', defaultValue: 'Join thousands of fashion-forward shoppers discovering their perfect look.' },
    { name: 'ctaLink', type: 'text', defaultValue: '/shop' },
    { name: 'ctaButtonText', type: 'text', defaultValue: 'Shop Now' },
  ],
}
