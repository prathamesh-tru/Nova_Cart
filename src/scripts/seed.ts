import { getPayload } from 'payload'
import configPromise from '../payload.config.js'
import https from 'https'
import http from 'http'
import path from 'path'

const CATEGORIES = [
  { name: 'Women', description: "Women's fashion collection", itemCount: '240+ styles', imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=95' },
  { name: 'Men', description: "Men's fashion collection", itemCount: '180+ styles', imageUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1200&q=95' },
  { name: 'Shoes', description: 'Footwear for all occasions', itemCount: '120+ pairs', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80' },
  { name: 'Bags', description: 'Handbags, backpacks & more', itemCount: '90+ bags', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80' },
  { name: 'Beauty', description: 'Skincare & beauty products', itemCount: '200+ products', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80' },
  { name: 'Home', description: 'Home décor & lifestyle', itemCount: '150+ items', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' },
  { name: 'Kids', description: "Children's clothing", itemCount: '80+ styles', imageUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80' },
  { name: 'Sports', description: 'Athletic & sportswear', itemCount: '100+ items', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80' },
]

// Image pools per category — all confirmed working Unsplash photo IDs
const IMG = {
  women: [
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=95', // silk wrap dress
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200&q=95', // floral maxi
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=95', // cashmere sweater
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=95', // linen blazer
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=95', // wide-leg jeans
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&q=95', // pleated skirt
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=95', // satin slip dress
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=95', // trench coat
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=95', // knit midi dress
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=95', // puff sleeve blouse
    'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=1200&q=95', // leather jacket
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=95', // bodycon evening dress
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=95', // linen co-ord set
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=95', // wrap midi skirt
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=95', // cable knit cardigan
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=95', // off-shoulder mini dress
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1200&q=95', // tailored trousers
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1200&q=95', // printed wrap blouse
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=95', // gold hoop earrings
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=95', // pearl earrings
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=95', // gold necklace
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200&q=95', // silk hair scarf
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=95', // hair accessories
    'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1200&q=95', // gold bracelet
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=95', // sunglasses
  ],
  men: [
    'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=1200&q=95', // oxford shirt
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=95', // chinos
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&q=95', // overcoat
    'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=1200&q=95', // denim jacket
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1200&q=95', // suit blazer
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&q=95', // cashmere crew neck
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&q=95', // linen summer shirt
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&q=95', // dress trousers
    'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1200&q=95', // puffer bomber
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1200&q=95', // polo shirt
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1200&q=95', // cargo trousers
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=95', // graphic tee
    'https://images.unsplash.com/photo-1580331451062-99ff652288d7?w=1200&q=95', // turtleneck sweater
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&q=95', // running shorts
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=95', // waterproof parka
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1200&q=95', // knit hoodie
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=95', // swim shorts
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=95', // leather wallet
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=95', // watch strap
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&q=95', // aviator sunglasses
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200&q=95', // silk knit tie
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200&q=95', // baseball cap
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80',
  ],
  bags: [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  ],
  home: [
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  ],
  kids: [
    'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  ],
}

// Pick image from pool by rotating index
function img(pool: string[], i: number) { return pool[i % pool.length] }

function richText(...paragraphs: string[]) {
  return {
    root: {
      type: 'root' as const,
      children: paragraphs.map(text => ({
        type: 'paragraph' as const,
        version: 1,
        children: [{ type: 'text' as const, text, version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function makeDesc(name: string, cat: string, shortDesc: string): ReturnType<typeof richText> {
  const map: Record<string, string[]> = {
    Women: [
      `${shortDesc} The ${name} is a modern wardrobe essential, designed to take you seamlessly from morning meetings to evening occasions without missing a beat.`,
      `Crafted from carefully selected premium fabric, every stitch and finish is executed with precision. The thoughtful cut provides a flattering silhouette across a range of body types, with just enough ease for all-day comfort and movement.`,
      `Style with strappy heels and minimal jewellery for an elevated evening look, or pair with white trainers and a crossbody bag for a chic daytime ensemble. The versatile tones integrate effortlessly into any existing wardrobe.`,
      `Care instructions: Machine wash cold on a gentle cycle, or hand wash. Lay flat to dry. Do not tumble dry. Cool iron if required. We recommend sizing up if between sizes for a more relaxed fit.`,
    ],
    Men: [
      `${shortDesc} A sophisticated addition to any modern gentleman's wardrobe, the ${name} brings understated elegance to both professional and casual settings.`,
      `Made from high-quality materials with meticulous attention to detail, this piece features clean lines, reinforced stitching, and considered construction that stands the test of time. The contemporary cut sits true to size with room for comfort.`,
      `Pair with tailored trousers and leather oxfords for a boardroom-ready look, or dress down with slim-fit chinos and suede loafers for smart-casual occasions. Effortlessly versatile across the dress code spectrum.`,
      `Care: Machine wash at 30°C on a gentle cycle. Reshape while damp and hang or lay flat to dry. Cool iron inside out. Store folded to maintain shape. Avoid bleach and fabric softeners.`,
    ],
    Shoes: [
      `${shortDesc} The ${name} combines expert craftsmanship with contemporary design to deliver footwear that performs beautifully whether you're navigating city streets or dressing up for a special occasion.`,
      `Constructed with premium upper materials and a durable rubber outsole, these shoes are built to last. The cushioned insole provides all-day support, while the carefully engineered silhouette ensures a comfortable fit from the very first wear.`,
      `An incredibly versatile style that works with everything from tailored suits and dresses to casual jeans and knitwear. A true wardrobe staple that bridges the gap between formal and relaxed dressing with effortless ease.`,
      `Care: Wipe clean with a soft damp cloth after each wear. Use a conditioner appropriate to the upper material regularly. Store with shoe trees to preserve shape. Avoid prolonged exposure to direct sunlight or moisture.`,
    ],
    Bags: [
      `${shortDesc} The ${name} is a considered design piece that marries form and function — thoughtfully organised to carry everything you need, while making a confident style statement wherever you go.`,
      `Constructed from premium materials with polished hardware throughout, every element of this bag is finished with precision. The structured silhouette holds its shape beautifully, while the quality lining protects your belongings in style.`,
      `Interior features include a main compartment, zip-secured pocket, and two open slip pockets for cards and essentials. The strap is designed for all-day wear comfort. Approximate dimensions: 28cm × 18cm × 10cm.`,
      `Care: Wipe the exterior with a clean, dry cloth to remove dust or light marks. Use leather conditioner to maintain the finish. Store in the provided dust bag when not in use. Avoid overfilling to preserve the shape.`,
    ],
    Beauty: [
      `${shortDesc} Formulated by expert dermatologists and beauty scientists, this product delivers visible results from the first use. Developed for the modern skincare and beauty enthusiast who demands both performance and luxury.`,
      `The advanced formula harnesses the power of clinically proven active ingredients combined with luxurious skin-feel textures. Free from harsh chemicals and unnecessary fillers — every ingredient serves a purpose. Dermatologist-tested and suitable for regular use.`,
      `To use: Apply a small amount to clean skin using gentle circular motions. For best results, use consistently morning and/or evening as directed. Layer under SPF in the morning. Start with a smaller amount and build up as needed.`,
      `Suitable for all skin types. Cruelty-free and formulated without parabens, sulphates, or artificial fragrances. Shelf life: 12 months after opening. Store in a cool, dry place away from direct sunlight.`,
    ],
    Home: [
      `${shortDesc} Designed to elevate your living space with considered style and premium materials, the ${name} is the kind of piece that makes a room feel instantly more curated and personal.`,
      `Crafted by skilled artisans using responsibly sourced materials, this piece demonstrates quality in every detail. The finish is refined and consistent, with the kind of tactile satisfaction that only premium homeware provides.`,
      `Designed to complement both modern minimalist and eclectic interior styles, this piece works as a standalone accent or as part of a layered home styling approach. Dimensions and set contents listed in the specifications tab.`,
      `Care: Follow specific care instructions per material. Most pieces are hand wash or wipe-clean recommended. Store away from direct sunlight to prevent fading. Packaging is designed for safe gifting and storage.`,
    ],
    Kids: [
      `${shortDesc} Designed with children's comfort, safety, and free movement in mind, the ${name} makes getting dressed a joy for both kids and parents alike.`,
      `Made from OEKO-TEX certified fabrics free from harmful substances, this garment meets the highest safety standards for children's clothing. Soft against sensitive skin with no irritating seams or tight elastic — built for active little ones.`,
      `Available in sizes 2–3Y through 6–7Y. The relaxed, easy-on fit is ideal for independent dressing and energetic play. Sizing runs generously — check the measurement guide to find the perfect fit for your child.`,
      `Care: Machine washable at 30°C for easy everyday laundering. Tumble dry on low. The colours and prints are designed to stay vibrant wash after wash. Avoid bleach. Iron on reverse if needed.`,
    ],
    Sports: [
      `${shortDesc} Engineered for athletes and active lifestyles, the ${name} delivers professional-level performance in a design that doesn't sacrifice style. From warm-ups to personal bests — built for serious movement.`,
      `The technical fabric features moisture-wicking and quick-dry properties that keep you cool and comfortable through intense sessions. Four-way stretch construction ensures unrestricted movement in every direction, while flatlock seams prevent chafing.`,
      `Ideal for running, gym training, yoga, cycling, or any activity that demands both performance and comfort. The design integrates seamlessly with other training essentials, from base layers to outerwear.`,
      `Care: Machine wash cold with similar colours. Do not use fabric softener — it degrades moisture-wicking properties. Tumble dry on low or air dry flat. Do not iron. Wash inside out to maintain the technical finish.`,
    ],
  }
  return richText(...(map[cat] ?? map['Women']))
}

function makeSpecs(cat: string, i: number): { label: string; value: string }[] {
  const idx = i % 5
  const map: Record<string, () => { label: string; value: string }[]> = {
    Women: () => ([
      { label: 'Material', value: ['100% Mulberry Silk', '95% Viscose, 5% Elastane', '100% Premium Linen', '80% Cotton, 20% Polyester', '100% Grade-A Cashmere'][idx] },
      { label: 'Fit', value: ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Oversized', 'Tailored Fit'][idx] },
      { label: 'Length', value: ['Midi Length', 'Maxi Length', 'Mini Length', 'Full Length', 'Knee Length'][idx] },
      { label: 'Neckline', value: ['V-Neck', 'Round Neck', 'Off-Shoulder', 'Square Neck', 'Cowl Neck'][idx] },
      { label: 'Care', value: 'Machine wash cold, gentle cycle. Do not bleach or tumble dry.' },
      { label: 'Country of Origin', value: ['Made in Portugal', 'Made in Italy', 'Made in India', 'Made in France', 'Made in Turkey'][idx] },
      { label: 'Sizes Available', value: 'XS, S, M, L, XL, XXL — True to size' },
      { label: 'Occasion', value: ['Casual', 'Formal', 'Smart-Casual', 'Evening', 'Everyday'][idx] },
    ]),
    Men: () => ([
      { label: 'Material', value: ['100% Merino Wool', '100% Premium Cotton', '98% Cotton, 2% Elastane', '100% Linen', 'Wool-Cashmere Blend'][idx] },
      { label: 'Fit', value: ['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Tailored Fit', 'Classic Fit'][idx] },
      { label: 'Collar Style', value: ['Classic Collar', 'Mandarin Collar', 'Spread Collar', 'Button-Down Collar', 'Crewneck'][idx] },
      { label: 'Sleeve', value: ['Long Sleeve', 'Short Sleeve', 'Long Sleeve', 'Short Sleeve', 'Long Sleeve'][idx] },
      { label: 'Care', value: 'Machine wash at 30°C, gentle cycle. Reshape and lay flat to dry.' },
      { label: 'Country of Origin', value: ['Made in Italy', 'Made in Portugal', 'Made in UK', 'Made in Spain', 'Made in Japan'][idx] },
      { label: 'Sizes Available', value: 'XS, S, M, L, XL, XXL — True to size' },
      { label: 'Occasion', value: ['Business Casual', 'Smart-Casual', 'Formal', 'Casual', 'Outdoor'][idx] },
    ]),
    Shoes: () => ([
      { label: 'Upper Material', value: ['Full-grain leather', 'Premium suede', 'Italian leather', 'Canvas & leather', 'Vegan leather'][idx] },
      { label: 'Sole', value: ['Natural rubber', 'TPR (thermoplastic rubber)', 'Leather with rubber heel', 'EVA foam', 'Crepe rubber'][idx] },
      { label: 'Closure', value: ['Lace-up', 'Slip-on', 'Side zip', 'Buckle strap', 'Pull-tab'][idx] },
      { label: 'Heel Height', value: ['Flat (1cm)', 'Block heel (5cm)', 'Kitten heel (4cm)', 'Platform (3cm)', 'Wedge (6cm)'][idx] },
      { label: 'Lining', value: 'Breathable leather or fabric lining with cushioned footbed' },
      { label: 'Sizing', value: 'True to size. Half sizes available. Wide fit on select styles.' },
      { label: 'Care', value: 'Wipe clean with damp cloth. Condition regularly. Store with shoe trees.' },
      { label: 'Country of Origin', value: ['Made in Spain', 'Made in Italy', 'Made in Portugal', 'Made in UK', 'Made in Brazil'][idx] },
    ]),
    Bags: () => ([
      { label: 'Material', value: ['Full-grain Italian leather', 'Premium pebbled leather', 'Canvas with leather trim', 'Nylon with leather detailing', 'Suede leather'][idx] },
      { label: 'Hardware', value: ['Gold-tone brass', 'Silver-tone zinc alloy', 'Antique brass', 'Palladium-plated', 'Gunmetal finish'][idx] },
      { label: 'Dimensions', value: ['28cm × 20cm × 10cm', '32cm × 26cm × 14cm', '22cm × 16cm × 8cm', '38cm × 30cm × 15cm', '25cm × 18cm × 8cm'][idx] },
      { label: 'Strap Drop', value: ['Adjustable 60–120cm', 'Fixed 55cm drop', 'Detachable & adjustable', 'Chain strap 50cm', 'Double handles + shoulder strap'][idx] },
      { label: 'Lining', value: ['Cotton canvas lining', 'Suede-effect lining', 'Grosgrain fabric lining', 'Metallic satin lining', 'Printed canvas lining'][idx] },
      { label: 'Closure', value: ['Magnetic snap', 'Top zip', 'Drawstring', 'Turn-lock', 'Press-stud'][idx] },
      { label: 'Interior Pockets', value: '1 zip compartment, 2 open slip pockets, 1 card slot' },
      { label: 'Care', value: 'Wipe clean with dry cloth. Condition leather regularly. Store in dust bag.' },
    ]),
    Beauty: () => ([
      { label: 'Size', value: ['50ml / 1.7 fl oz', '30ml / 1.0 fl oz', '100ml / 3.4 fl oz', '75ml / 2.5 fl oz', '15g / 0.5 oz'][idx] },
      { label: 'Skin Type', value: ['All skin types', 'Normal to dry skin', 'Oily & combination skin', 'Sensitive skin', 'Mature skin'][idx] },
      { label: 'Key Ingredients', value: ['Vitamin C (15%), Hyaluronic Acid, Niacinamide', 'Retinol (0.3%), Peptides, Ceramides', 'Salicylic Acid, Glycolic Acid, Zinc', 'Collagen, Marine Extracts, Sea Kelp', 'Bakuchiol, Rosehip Oil, Squalane'][idx] },
      { label: 'How to Use', value: ['Apply 3–4 drops morning and evening before moisturiser', 'Apply pea-sized amount in the evening only', 'Dispense 1–2 pumps and blend evenly', 'Apply thin layer, leave 10–15 min, rinse', 'Warm between fingertips, press onto skin'][idx] },
      { label: 'Shelf Life', value: '12 months after opening (PAO symbol)' },
      { label: 'Formulation', value: ['Water-based serum', 'Oil-based treatment', 'Gel-cream', 'Emulsion', 'Balm'][idx] },
      { label: 'Cruelty-Free', value: 'Yes — certified by Leaping Bunny' },
      { label: 'Country of Origin', value: ['South Korea', 'France', 'USA', 'UK', 'Japan'][idx] },
    ]),
    Home: () => ([
      { label: 'Material', value: ['100% Natural Soy Wax', '100% Belgian Linen', 'Hand-thrown stoneware', 'Rattan & seagrass', 'Fine bone china'][idx] },
      { label: 'Dimensions', value: ['Set of 3: 8cm × 10cm each', 'Set of 2: 50cm × 50cm', '12cm × 12cm × 14cm', '35cm × 35cm each', '10cm × 8cm'][idx] },
      { label: 'Scent / Colour', value: ['Vanilla & Cedarwood', 'Rose & Oud', 'Bergamot & Vetiver', 'Sea Salt & Driftwood', 'Jasmine & White Tea'][idx] },
      { label: 'Set Includes', value: ['3 candles in gift box', '2 pillowcases + 1 throw', '4 mugs with saucers', '4 coasters in gift box', '3 sticks + glass vessel + 100ml reed oil'][idx] },
      { label: 'Burn Time', value: ['45 hours per candle', '60 hours per candle', '35 hours per candle', '50 hours per candle', '30 hours per candle'][idx] },
      { label: 'Care', value: 'Hand wash recommended. Keep away from direct sunlight to prevent fading.' },
      { label: 'Country of Origin', value: ['USA', 'Belgium', 'Portugal', 'Indonesia', 'UK'][idx] },
      { label: 'Gift Ready', value: 'Yes — comes in premium gift packaging' },
    ]),
    Kids: () => ([
      { label: 'Material', value: ['100% GOTS-certified organic cotton', '95% Cotton, 5% Elastane', '100% Recycled polyester', '80% Cotton, 20% Polyamide', '100% Pre-washed cotton'][idx] },
      { label: 'Age Range', value: ['2–3 years', '3–4 years', '4–5 years', '5–6 years', '6–7 years'][idx] },
      { label: 'Available Sizes', value: 'Age 2, 3, 4, 5, 6, 7' },
      { label: 'Safety Certification', value: ['OEKO-TEX Standard 100 certified', 'EN 71 Safety tested, non-toxic dyes', 'GOTS certified organic', 'REACH compliant, allergen-free', 'EU toy & clothing regulations compliant'][idx] },
      { label: 'Care', value: 'Machine wash at 30°C. Tumble dry low. Iron on reverse.' },
      { label: 'Country of Origin', value: ['Portugal', 'India', 'Turkey', 'Bangladesh', 'Spain'][idx] },
      { label: 'Closure', value: ['Poppers', 'Elastic waist', 'Zip + snap', 'Hook & eye', 'Pull-on'][idx] },
    ]),
    Sports: () => ([
      { label: 'Material', value: ['88% Polyester, 12% Elastane', '92% Nylon, 8% Lycra', '100% Recycled polyester', '78% Polyester, 18% Nylon, 4% Elastane', '85% Polyester, 15% Spandex'][idx] },
      { label: 'Technology', value: ['Moisture-wicking DryFit', 'Compression 4-way stretch', 'UPF 40+ sun protection', 'Thermal regulation + mesh panels', 'Anti-odour, quick-dry'][idx] },
      { label: 'Fit', value: ['Athletic Fit', 'Compression Fit', 'Relaxed Performance Fit', 'Body-Mapped Fit', 'Standard Active Fit'][idx] },
      { label: 'Best For', value: ['Running, gym, cycling', 'Yoga, Pilates, barre', 'HIIT, CrossFit, strength training', 'Swimming, watersports', 'Tennis, padel, court sports'][idx] },
      { label: 'Care', value: 'Machine wash cold. No fabric softener. Air dry or tumble dry low.' },
      { label: 'Country of Origin', value: ['Made in Vietnam', 'Made in China', 'Made in Cambodia', 'Made in Sri Lanka', 'Made in Indonesia'][idx] },
      { label: 'Available Sizes', value: 'XS, S, M, L, XL, XXL' },
      { label: 'Certification', value: ['ISO 105-C06', 'OEKO-TEX Performance', 'GRS Recycled certified', 'bluesign® certified', 'Nordic Swan Ecolabel'][idx] },
    ]),
  }
  return (map[cat] ?? map['Women'])()
}

const REVIEWERS = [
  { firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.m@review.demo' },
  { firstName: 'Emma', lastName: 'Thompson', email: 'emma.t@review.demo' },
  { firstName: 'James', lastName: 'Harrison', email: 'james.h@review.demo' },
  { firstName: 'Olivia', lastName: 'Parker', email: 'olivia.p@review.demo' },
  { firstName: 'Liam', lastName: 'Anderson', email: 'liam.a@review.demo' },
  { firstName: 'Ava', lastName: 'Williams', email: 'ava.w@review.demo' },
  { firstName: 'Noah', lastName: 'Bennett', email: 'noah.b@review.demo' },
  { firstName: 'Isabella', lastName: 'Chen', email: 'isabella.c@review.demo' },
  { firstName: 'Mason', lastName: 'Roberts', email: 'mason.r@review.demo' },
  { firstName: 'Sophia', lastName: 'Garcia', email: 'sophia.g@review.demo' },
  { firstName: 'Ethan', lastName: 'Kim', email: 'ethan.k@review.demo' },
  { firstName: 'Charlotte', lastName: 'Davis', email: 'charlotte.d@review.demo' },
]

const REVIEW_POOL: Record<string, { rating: number; title: string; body: string }[]> = {
  Women: [
    { rating: 5, title: 'Absolutely stunning — exceeded my expectations!', body: 'I ordered this for a special event and received so many compliments. The fabric quality is exceptional — it drapes beautifully and feels incredibly luxurious against the skin. The fit was spot-on using the size guide and the colour is even more beautiful in person than in the photos. Will definitely be ordering more pieces from this collection.' },
    { rating: 5, title: 'Perfect for day to evening', body: 'Wore this to a rooftop event and felt completely confident all night. The construction is solid and the details are lovely — you can tell real care has gone into the design. Sizing was true and the fabric keeps its shape beautifully. Already planning my next order.' },
    { rating: 4, title: 'Beautiful piece, great quality', body: 'Really happy with this purchase. The material feels premium and the finish is clean and professional. I sized up as recommended and it fits perfectly with a little room to breathe. The colour is slightly different in certain lighting but overall it is a beautiful piece I have gotten so many wears from.' },
    { rating: 5, title: 'Best quality I have found at this price', body: 'I was honestly surprised at the level of quality for the price. The stitching is immaculate, the fabric is substantial without being heavy, and it arrived beautifully packaged. I have worn it three times already and it still looks brand new. This is now my go-to brand for smart wardrobe pieces.' },
    { rating: 4, title: 'Elegant and versatile', body: 'This has quickly become one of my most-worn pieces. It transitions effortlessly from casual daywear to smart evening looks. The fabric is soft and comfortable — I can wear it all day without any discomfort. My one note is that it is delicate so I hand wash to be safe.' },
    { rating: 5, title: 'Gorgeous, will buy again', body: 'Impeccable quality and the fit is exactly as described. Arrived quickly and beautifully packaged. I have already recommended it to three friends who have all since ordered. The colour is rich and the fabric has a wonderful texture.' },
    { rating: 3, title: 'Nice but runs slightly small', body: 'The quality is good and the design is lovely, but it runs a little small compared to my usual size. I would recommend sizing up. Once I exchanged for a larger size it fits perfectly and looks great. Customer service was very helpful throughout.' },
    { rating: 5, title: 'A true wardrobe staple', body: 'I have been wearing this on repeat since it arrived. The fabric is breathable yet structured enough to hold a beautiful shape. I have washed it several times now and it has maintained its colour and form perfectly. Absolute staple.' },
  ],
  Men: [
    { rating: 5, title: 'Sharp, well-made and versatile', body: 'This has quickly become the most complimented item in my wardrobe. The fit is excellent — tailored enough to look sharp but with enough ease to be comfortable all day. The material has a real premium hand feel. Highly recommended.' },
    { rating: 5, title: 'Exactly as described — excellent quality', body: 'I was impressed from the moment I opened the package. The attention to detail is evident — well-finished seams, quality buttons, and fabric that feels substantial. It fits true to size. This is the kind of piece you keep for years.' },
    { rating: 4, title: 'Great everyday piece', body: 'Bought this for work and it has been fantastic. Looks professional but is comfortable enough to wear all day. The fabric handles wear well and does not wrinkle too badly. I have already bought it in a second colour.' },
    { rating: 5, title: 'Premium quality at a fair price', body: 'I have spent a lot more money on similar items from other brands and this is genuinely as good. The construction is solid, the materials are high quality, and the fit is excellent. Will definitely be a returning customer.' },
    { rating: 4, title: 'Smart and comfortable', body: 'Exactly what I was looking for. The slim fit is just right — not too tight but nicely tailored. The fabric is soft and has a good weight to it. Works equally well dressed up and casually. Size guide was accurate.' },
    { rating: 5, title: 'My new favourite', body: 'Replaced three similar items in my wardrobe with this one purchase. The quality is noticeably better — the material hangs properly, the fit is consistent, and it has held up brilliantly through regular washing. Zero regrets.' },
    { rating: 3, title: 'Good quality but sizing is generous', body: 'The quality is definitely there but I found the fit to be a bit roomier than expected. Worth sizing down. Once I got the right size it looked great and the material is genuinely excellent.' },
    { rating: 5, title: 'Excellent everyday essential', body: 'This is the kind of well-made, no-fuss piece every wardrobe needs. Works for everything from smart meetings to weekend errands. The fabric is soft, the finish is clean, and it looks as good after ten washes as on day one.' },
  ],
  Shoes: [
    { rating: 5, title: 'Comfortable from the first wear', body: 'Most shoes need a breaking-in period but these were immediately comfortable. The cushioning is excellent and the upper material is soft and well-finished. I have worn them all day with no blisters or discomfort. They also look stunning — many compliments.' },
    { rating: 5, title: 'Exceptional quality and style', body: 'The leather quality is immediately apparent — these are genuinely well-crafted shoes. The sole is sturdy, the hardware is quality, and the overall construction is impressive. They look far more expensive than they are and elevate any outfit instantly.' },
    { rating: 4, title: 'Great shoes, size up slightly', body: 'Lovely shoes that are well made and comfortable. I found them very slightly narrow so would recommend going up half a size if you have a wider foot. The colour is exactly as shown and the finish is beautiful. Very happy overall.' },
    { rating: 5, title: 'Perfect addition to my collection', body: 'Exactly what I wanted. They are versatile enough to wear with everything from jeans to occasion dresses. The heel height is comfortable and I can walk long distances in them without any issues. Beautiful packaging too.' },
    { rating: 4, title: 'Smart and sturdy', body: 'These shoes are well constructed and look very polished. They have held up excellently through regular wear and still look almost new after several months. They take a few wears to fully break in but are then incredibly comfortable.' },
    { rating: 5, title: 'My most-worn pair', body: 'I reach for these constantly because they work with so many outfits. They are comfortable, stylish, and the quality is genuine. The leather has developed a beautiful patina with wear. Easily the best footwear purchase I have made this year.' },
    { rating: 5, title: 'Spot on', body: 'These are exactly what they look like in the photos — well-made, good-looking shoes with real quality materials. The fit was true to size, the packaging was lovely, and they arrived quickly. I have already recommended them to friends.' },
    { rating: 4, title: 'Love the style, comfort is good', body: 'Visually these are beautiful — exactly the style I was looking for. Comfort is good but a small insole helps for all-day wear. The quality of the upper material is excellent and they have maintained their appearance through regular use.' },
  ],
  Bags: [
    { rating: 5, title: 'Perfect everyday bag', body: 'This bag has been on my arm every single day since it arrived. The leather is supple and beautiful, the hardware is quality, and the interior is perfectly organised. It fits everything I need without being bulky. Genuinely one of the best purchases I have made.' },
    { rating: 5, title: 'Stunning quality — looks twice the price', body: 'The photos do not do this justice. In person the leather is rich and textured, the hardware is weighty and well-finished, and the overall construction is exceptional. I have received countless compliments and several people have asked where I bought it.' },
    { rating: 4, title: 'Beautiful bag, slightly smaller than expected', body: 'The quality is genuinely excellent — the leather, the stitching, the hardware — all very well done. It is slightly smaller than I expected from the photos so worth checking the measurements before ordering. As a daily bag for essentials it is perfect.' },
    { rating: 5, title: 'Goes with everything', body: 'I was looking for a versatile bag that would work dressed up or down and this is exactly that. The colour is neutral and elegant, the size is practical, and the quality is impressive. I have used it for work, evenings out, and travel.' },
    { rating: 5, title: 'Well-made and thoughtfully designed', body: 'The interior organisation is exactly right — pockets where you actually need them and a main compartment that holds everything neatly. The strap is comfortable and adjustable. The leather has a beautiful texture and the overall finish is premium.' },
    { rating: 4, title: 'Great quality bag', body: 'Very pleased with this purchase. The leather is genuine quality and has a lovely feel. The hardware is solid and the lining is well-finished. The strap could be slightly longer for taller people but overall this is a great bag with real longevity.' },
    { rating: 5, title: 'The bag I have been looking for', body: 'After searching for months for the right everyday bag, this is it. The proportions are perfect, the quality is excellent, and it holds everything I need. It comes in beautiful packaging and would make a perfect gift. Already considering a second colour.' },
    { rating: 3, title: 'Nice quality but colour was different', body: 'The quality of the leather and construction is genuinely good. However the colour was noticeably different to the photos — slightly darker in real life. Still a beautiful bag. The interior is well designed and the strap is excellent.' },
  ],
  Beauty: [
    { rating: 5, title: 'Transformed my skin in weeks', body: 'I have tried a lot of serums and nothing has worked as quickly or as noticeably as this. Within two weeks my skin looked visibly brighter and more even-toned. Within a month my texture had significantly improved. The formula absorbs beautifully and layers perfectly under moisturiser. This has earned a permanent place in my routine.' },
    { rating: 5, title: 'Worth every penny', body: 'I was hesitant about the price but this product has genuinely delivered results I cannot argue with. My skin has never looked better — the tone is more even, the texture is smoother, and my pores appear smaller. The packaging is beautiful and a little goes a long way.' },
    { rating: 4, title: 'Noticeable results, great texture', body: 'I have been using this for about six weeks now and I can genuinely see a difference. My skin looks more radiant and the fine lines around my eyes appear softer. The texture is lovely — not sticky or heavy, just sinks in nicely. I would buy again.' },
    { rating: 5, title: 'My skin has never looked this good', body: 'I cannot overstate how much I love this product. My colleagues have started asking what I have done differently. The formula is gentle enough for sensitive skin but powerful enough to deliver real results. Absolutely recommend.' },
    { rating: 4, title: 'Great product, lovely scent', body: 'Really effective and the scent is subtle and pleasant — not overwhelming at all. I use it morning and evening and my skin has noticeably improved in terms of radiance and hydration. The bottle dispenses the perfect amount each time.' },
    { rating: 5, title: 'Repurchased three times', body: 'That says it all. I have been through three bottles now and my skin looks consistently better than it ever has. Friends have commented on how glowing my complexion looks. I will not stop using this.' },
    { rating: 3, title: 'Good but took longer to see results', body: 'The quality is clearly there — the packaging is premium and the formula feels lovely on skin. I did not see dramatic results at the 4-week mark but around week eight things started to improve noticeably. Worth being patient with it.' },
    { rating: 5, title: 'A genuine game-changer', body: 'I do not often write reviews but this product deserves it. My skin has genuinely transformed since I started using it. The dullness I had been fighting for years is gone and I regularly wake up to skin that looks hydrated and bright. Cannot recommend it enough.' },
  ],
  Home: [
    { rating: 5, title: 'Elevated my entire living space', body: 'I ordered these for a home refresh and the quality far exceeded my expectations. The craftsmanship is beautiful — clearly made by people who care about the details. The colour and texture look even better in real life than in the photos. My living room feels transformed.' },
    { rating: 5, title: 'Perfect gift — beautifully packaged', body: 'Bought this as a gift and the recipient was absolutely delighted. The packaging is premium and gift-ready — no extra wrapping needed. The product quality is genuinely impressive and feels luxurious. Will definitely return for all future gifting.' },
    { rating: 4, title: 'Beautiful quality, great addition to the home', body: 'Really pleased with this purchase. The quality is evident immediately — the materials are premium and the finish is clean and considered. It has become one of my favourite pieces in the room. Only four stars because delivery took slightly longer than expected.' },
    { rating: 5, title: 'The scent fills the room beautifully', body: 'Everything about this is perfect. The quality of the materials, the design, the scent — all excellent. It fills the room with exactly the right ambience without being overpowering. I have bought multiples to give as gifts and everyone has been thrilled.' },
    { rating: 5, title: 'Exactly what my home needed', body: 'I had been looking for something like this for months and finally found it here. The quality is genuine — not just attractive but actually made to last. It has held up perfectly since purchase and looks as good now as the day it arrived. Exceptional value.' },
    { rating: 4, title: 'Stylish and well made', body: 'A lovely piece that adds real warmth and character to the room. The materials are quality and the design is considered. My only note is that the dimensions are slightly smaller than I imagined but it is still perfect and I would buy again.' },
    { rating: 5, title: 'Guests always comment on it', body: 'Without fail, everyone who comes to the house asks about this. It has become a real conversation piece. The quality is obvious and it adds so much to the space. I am now planning to order more pieces from the same range.' },
    { rating: 5, title: 'Premium quality, fast delivery', body: 'Arrived quickly and in perfect condition with beautiful packaging. The quality is exceptional — this is clearly a well-made product from premium materials. It looks stunning in the space.' },
  ],
  Kids: [
    { rating: 5, title: 'Perfect for my little one', body: 'My daughter absolutely loves wearing this and I love how well it is made. The fabric is soft against her skin and has washed beautifully — no pilling or fading after multiple washes. The sizing was accurate and it has plenty of room to grow into. We have had so many compliments.' },
    { rating: 5, title: 'Great quality kids clothing', body: 'Really impressed with the quality. The stitching is robust, the fabric is soft and comfortable, and it has held up well through energetic wear and many washes. My son refuses to take it off which is the ultimate endorsement. Already looking at other pieces from the range.' },
    { rating: 4, title: 'Lovely, runs a little big', body: 'The quality is genuinely excellent — soft, well-made, and beautifully designed. It does run slightly large so worth bearing that in mind. My four-year-old is wearing the 3–4 size perfectly. Very happy with the purchase overall and would buy again.' },
    { rating: 5, title: 'My kid lives in this', body: 'Best purchase I have made in a while. It is comfortable enough for everyday wear, looks great, and has survived everything my energetic toddler can throw at it. The colours are vibrant and have not faded. We will absolutely be buying more.' },
    { rating: 5, title: 'Beautiful and practical', body: 'So many children\'s clothes look cute but fall apart after a few washes. This is the opposite — it has only improved with wear. The fabric remains soft, the colours stay vibrant, and the construction has held up to very enthusiastic use. Highly recommend.' },
    { rating: 4, title: 'Good quality, nice design', body: 'Very pleased with this. The fabric is soft and the design is lovely. My daughter chose it herself and has been wearing it constantly. The washing instructions are straightforward and it has held up well. Delivery was fast and packaging was nice.' },
    { rating: 5, title: 'Excellent in every way', body: 'From the packaging to the quality of the item, everything about this purchase has been excellent. The fabric is certified safe for children, it is well-made, and the design is genuinely appealing. My children have fought over who gets to wear it.' },
    { rating: 3, title: 'Nice but check sizing carefully', body: 'The quality is good and the design is lovely but the sizing is quite different to other brands — my usual size was too small. Once I found the right size it fitted perfectly and looked great. Just worth reading the size guide carefully before ordering.' },
  ],
  Sports: [
    { rating: 5, title: 'The best kit I have ever trained in', body: 'I train five days a week and have been through a lot of activewear. This is genuinely the best I have found. The moisture-wicking is exceptional — I stay dry even in intense HIIT sessions. The fabric does not stretch out over time and maintains its shape wash after wash.' },
    { rating: 5, title: 'Performance and style in one', body: 'Finally found activewear that does not make me choose between looking good and performing well. The compression support is excellent without being restrictive, the fabric is breathable, and it stays in place through squats, lunges, jumps — everything. I have bought in three colours.' },
    { rating: 4, title: 'Great quality, runs slightly small', body: 'Excellent quality activewear that performs really well. The fabric is technical and handles sweat effectively. I found the sizing runs slightly small so I would recommend going up a size, especially if you prefer a relaxed fit. Once sized correctly it is very comfortable.' },
    { rating: 5, title: 'My new gym essential', body: 'I wore these for the first time at a 90-minute session and was amazed at how comfortable they were throughout. No riding up, no discomfort, excellent moisture management. They look great too which is a bonus. I have been telling everyone at the gym about them.' },
    { rating: 5, title: 'Top quality for serious training', body: 'I have tried a lot of activewear at various price points and this is up there with the best. The technical properties are genuine — it really does wick moisture effectively — and the construction is sturdy enough to handle frequent, intense use. Excellent.' },
    { rating: 4, title: 'Love it for yoga', body: 'Perfect for my yoga practice. The fabric has great stretch and recovery, the waistband stays put through inversions, and the fit is flattering without being restrictive. First impressions are excellent and it has held up well through regular washing.' },
    { rating: 5, title: 'Does exactly what it says', body: 'No gimmicks, just really well-made, functional activewear that performs brilliantly. The moisture-wicking works, the fit is comfortable, and it looks great. I have washed it many times now and the quality has not degraded at all. Excellent product.' },
    { rating: 3, title: 'Good quality but check lighter colours', body: 'The quality of the fabric and construction is good and it performs well technically. However the lighter colour option is more transparent than expected. The darker colours are perfect. The fit is excellent and the waistband is very comfortable.' },
  ],
}

const PRODUCTS: { name: string; category: string; price: number; comparePrice?: number; stock: number; desc: string; imageUrl: string }[] = [
  // ── WOMEN (25) ──────────────────────────────────────────────
  { name: 'Silk Wrap Dress',            category: 'Women', price: 189, comparePrice: 249, stock: 12, desc: '100% mulberry silk wrap dress with an adjustable waist tie and flowing silhouette.', imageUrl: IMG.women[0] },
  { name: 'Floral Maxi Dress',          category: 'Women', price: 115, comparePrice: 155, stock: 20, desc: 'Vibrant floral-print maxi dress in breathable chiffon with a V-neckline.', imageUrl: IMG.women[1] },
  { name: 'Cashmere V-Neck Sweater',    category: 'Women', price: 275, comparePrice: 350, stock: 6,  desc: 'Ultra-soft 100% Grade-A cashmere V-neck sweater in timeless neutral tones.', imageUrl: IMG.women[2] },
  { name: 'Oversized Linen Blazer',     category: 'Women', price: 145, comparePrice: 195, stock: 10, desc: 'Italian linen blazer with a relaxed oversized cut, ideal for smart-casual dressing.', imageUrl: IMG.women[3] },
  { name: 'High-Waist Wide-Leg Jeans',  category: 'Women', price: 95,  comparePrice: 125, stock: 18, desc: 'High-rise wide-leg denim in a clean indigo wash — the modern power trouser.', imageUrl: IMG.women[4] },
  { name: 'Pleated Midi Skirt',         category: 'Women', price: 79,  stock: 25,                    desc: 'Flowy pleated midi skirt in satin-finish fabric, pairs beautifully with fitted tops.', imageUrl: IMG.women[5] },
  { name: 'Satin Slip Dress',           category: 'Women', price: 125, comparePrice: 165, stock: 14, desc: 'Minimalist satin slip dress with adjustable spaghetti straps — effortlessly elegant.', imageUrl: IMG.women[6] },
  { name: 'Classic Trench Coat',        category: 'Women', price: 289, comparePrice: 369, stock: 7,  desc: 'Double-breasted gabardine trench coat with epaulettes and a belted waist.', imageUrl: IMG.women[7] },
  { name: 'Ribbed Knit Midi Dress',     category: 'Women', price: 99,  stock: 16,                    desc: 'Form-flattering ribbed knit dress with long sleeves and a midi-length hem.', imageUrl: IMG.women[8] },
  { name: 'Puff Sleeve Blouse',         category: 'Women', price: 65,  comparePrice: 85,  stock: 22, desc: 'Romantic cotton blouse with voluminous puff sleeves and a relaxed boxy fit.', imageUrl: IMG.women[9] },
  { name: 'Cropped Leather Jacket',     category: 'Women', price: 220, comparePrice: 290, stock: 8,  desc: 'Smooth vegan leather moto jacket with zip detailing and a fitted waist.', imageUrl: IMG.women[10] },
  { name: 'Bodycon Evening Dress',      category: 'Women', price: 149, comparePrice: 199, stock: 11, desc: 'Stretch-crepe bodycon dress with a sweetheart neckline, perfect for evenings out.', imageUrl: IMG.women[11] },
  { name: 'Linen Co-ord Set',           category: 'Women', price: 135, comparePrice: 175, stock: 13, desc: 'Matching linen blazer and wide-leg trouser set in a relaxed summer palette.', imageUrl: IMG.women[12] },
  { name: 'Wrap Midi Skirt',            category: 'Women', price: 69,  stock: 30,                    desc: 'Adjustable wrap midi skirt with a side slit, available in rich jewel tones.', imageUrl: IMG.women[13] },
  { name: 'Cable Knit Cardigan',        category: 'Women', price: 89,  stock: 20,                    desc: 'Chunky cable-knit open-front cardigan in oatmeal, caramel, and sage.', imageUrl: IMG.women[14] },
  { name: 'Off-Shoulder Mini Dress',    category: 'Women', price: 95,  comparePrice: 125, stock: 15, desc: 'Ruffled off-shoulder mini dress in polished cotton — daytime chic.', imageUrl: IMG.women[15] },
  { name: 'Tailored Straight Trousers', category: 'Women', price: 105, comparePrice: 139, stock: 17, desc: 'Precision-tailored straight-leg trousers with a flat front and clean break hem.', imageUrl: IMG.women[16] },
  { name: 'Printed Wrap Blouse',        category: 'Women', price: 72,  stock: 28,                    desc: 'Lightweight wrap blouse in an abstract print — wear open or tied at the waist.', imageUrl: IMG.women[17] },
  { name: 'Gold Hoop Earrings',         category: 'Women', price: 45,  stock: 40,                    desc: '18k gold-plated oversized hoop earrings — a wardrobe essential.', imageUrl: IMG.women[18] },
  { name: 'Pearl Drop Earrings',        category: 'Women', price: 58,  stock: 35,                    desc: 'Freshwater pearl drop earrings set in sterling silver — timeless and versatile.', imageUrl: IMG.women[19] },
  { name: 'Delicate Gold Necklace',     category: 'Women', price: 65,  stock: 45,                    desc: 'Minimalist 18k gold-plated layering necklace with a thin chain and tiny pendant.', imageUrl: IMG.women[20] },
  { name: 'Silk Hair Scarf',            category: 'Women', price: 55,  stock: 38,                    desc: 'Pure silk square scarf — wear in your hair, around your neck, or on your bag.', imageUrl: IMG.women[21] },
  { name: 'Claw Clip Hair Set',         category: 'Women', price: 24,  stock: 60,                    desc: 'Set of 6 acetate claw clips in mixed neutral shades — the everyday essential.', imageUrl: IMG.women[22] },
  { name: 'Gold Chain Bracelet',        category: 'Women', price: 48,  stock: 42,                    desc: 'Chunky 18k gold-plated chain bracelet — stacks beautifully with other pieces.', imageUrl: IMG.women[23] },
  { name: 'Oversized Sunglasses',       category: 'Women', price: 52,  comparePrice: 68,  stock: 33, desc: 'Retro-inspired oversized frames with UV400 lenses in tortoiseshell and black.', imageUrl: IMG.women[24] },

  // ── MEN (22) ────────────────────────────────────────────────
  { name: 'Classic Oxford Shirt',       category: 'Men',   price: 85,  stock: 30,                    desc: 'Tailored cotton Oxford shirt with a button-down collar — the cornerstone of menswear.', imageUrl: IMG.men[0] },
  { name: 'Slim-Fit Chinos',            category: 'Men',   price: 75,  comparePrice: 95,  stock: 24, desc: 'Stretch cotton-blend chinos with a slim taper, available in stone, navy, and khaki.', imageUrl: IMG.men[1] },
  { name: 'Merino Wool Overcoat',       category: 'Men',   price: 320, comparePrice: 420, stock: 5,  desc: 'Luxurious 80% merino wool overcoat with a notch lapel and button front.', imageUrl: IMG.men[2] },
  { name: 'Indigo Denim Jacket',        category: 'Men',   price: 110, stock: 18,                    desc: 'Classic indigo-washed denim jacket with a slim fit and chest pockets.', imageUrl: IMG.men[3] },
  { name: 'Tailored Suit Blazer',       category: 'Men',   price: 275, comparePrice: 349, stock: 7,  desc: 'Single-breasted two-button suit blazer in Italian wool — sharp and refined.', imageUrl: IMG.men[4] },
  { name: 'Cashmere Crew-Neck Sweater', category: 'Men',   price: 235, comparePrice: 299, stock: 9,  desc: 'Pure Grade-A cashmere crew-neck in classic colours — the ultimate in warmth and softness.', imageUrl: IMG.men[5] },
  { name: 'Linen Summer Shirt',         category: 'Men',   price: 70,  stock: 28,                    desc: 'Lightweight 100% linen shirt with a relaxed fit — ideal for warm-weather dressing.', imageUrl: IMG.men[6] },
  { name: 'Tapered Dress Trousers',     category: 'Men',   price: 95,  stock: 20,                    desc: 'Sharply cut tapered trousers in stretch-wool blend — versatile and polished.', imageUrl: IMG.men[7] },
  { name: 'Puffer Bomber Jacket',       category: 'Men',   price: 165, comparePrice: 210, stock: 12, desc: 'Lightweight down-filled bomber with a water-resistant outer shell.', imageUrl: IMG.men[8] },
  { name: 'Slim-Fit Polo Shirt',        category: 'Men',   price: 65,  stock: 32,                    desc: 'Cotton-piqué polo shirt with a three-button placket — classic weekend dressing.', imageUrl: IMG.men[9] },
  { name: 'Cargo Utility Trousers',     category: 'Men',   price: 88,  comparePrice: 110, stock: 19, desc: 'Multi-pocket cargo trousers in durable ripstop cotton — functional and stylish.', imageUrl: IMG.men[10] },
  { name: 'Oversized Graphic Tee',      category: 'Men',   price: 38,  stock: 40,                    desc: 'Premium heavyweight cotton tee with an artistic graphic print.', imageUrl: IMG.men[11] },
  { name: 'Turtleneck Knit Sweater',    category: 'Men',   price: 120, comparePrice: 155, stock: 14, desc: 'Merino-blend ribbed turtleneck — elegant layering piece for autumn and winter.', imageUrl: IMG.men[12] },
  { name: 'Technical Running Shorts',   category: 'Men',   price: 55,  stock: 26,                    desc: 'Lightweight 4-way stretch running shorts with an inner brief and reflective trim.', imageUrl: IMG.men[13] },
  { name: 'Waterproof Parka',           category: 'Men',   price: 195, comparePrice: 249, stock: 8,  desc: '10,000mm waterproof-rated parka with a detachable fleece lining.', imageUrl: IMG.men[14] },
  { name: 'Knit Hoodie',                category: 'Men',   price: 95,  stock: 22,                    desc: 'Garment-dyed French terry hoodie with kangaroo pocket — relaxed weekend essential.', imageUrl: IMG.men[15] },
  { name: 'Swim Shorts',                category: 'Men',   price: 55,  comparePrice: 70,  stock: 25, desc: 'Quick-dry swim shorts with an adjustable waist and side pockets.', imageUrl: IMG.men[16] },
  { name: 'Leather Bifold Wallet',      category: 'Men',   price: 68,  stock: 50,                    desc: 'Slim full-grain leather bifold wallet with 6 card slots and a banknote section.', imageUrl: IMG.men[17] },
  { name: 'Leather Watch Strap',        category: 'Men',   price: 45,  stock: 40,                    desc: 'Hand-stitched Italian leather watch strap in tan, black, and brown.', imageUrl: IMG.men[18] },
  { name: 'Classic Aviator Sunglasses', category: 'Men',   price: 89,  comparePrice: 115, stock: 28, desc: 'Metal-frame aviators with UV400 gradient lenses — the timeless pilot style.', imageUrl: IMG.men[19] },
  { name: 'Silk Knit Tie',              category: 'Men',   price: 75,  stock: 22,                    desc: 'Woven silk tie in micro-check and stripe patterns — refined boardroom elegance.', imageUrl: IMG.men[20] },
  { name: 'Canvas Baseball Cap',        category: 'Men',   price: 35,  stock: 45,                    desc: 'Unstructured canvas baseball cap with a tonal embroidered logo.', imageUrl: IMG.men[21] },

  // ── SHOES (20) ──────────────────────────────────────────────
  { name: 'White Leather Sneakers',     category: 'Shoes', price: 95,  comparePrice: 130, stock: 22, desc: 'Clean-profile white leather low-top sneakers with a cushioned EVA sole.', imageUrl: img(IMG.shoes, 0) },
  { name: 'Suede Chelsea Boots',        category: 'Shoes', price: 165, comparePrice: 210, stock: 14, desc: 'Premium suede Chelsea boots with elastic side panels and a stacked leather heel.', imageUrl: img(IMG.shoes, 1) },
  { name: 'Brogue Oxford Shoes',        category: 'Shoes', price: 145, stock: 16,                    desc: 'Full-grain leather brogues with traditional Goodyear welt construction.', imageUrl: img(IMG.shoes, 2) },
  { name: 'Chunky Platform Loafers',    category: 'Shoes', price: 125, comparePrice: 159, stock: 18, desc: 'Leather-upper loafers with a chunky rubber platform sole — effortlessly cool.', imageUrl: img(IMG.shoes, 2) },
  { name: 'Performance Running Shoes',  category: 'Shoes', price: 130, comparePrice: 165, stock: 20, desc: 'Carbon-plate running shoes with responsive foam midsole for race-day performance.', imageUrl: img(IMG.shoes, 0) },
  { name: 'Canvas Hi-Top Sneakers',     category: 'Shoes', price: 79,  comparePrice: 99,  stock: 28, desc: 'Classic canvas hi-top sneakers with a vulcanised rubber sole in 12 colourways.', imageUrl: img(IMG.shoes, 0) },
  { name: 'Block Heel Sandals',         category: 'Shoes', price: 110, comparePrice: 145, stock: 15, desc: 'Strappy block-heel sandals with adjustable ankle strap — day-to-night versatility.', imageUrl: img(IMG.shoes, 1) },
  { name: 'Kitten Heel Pumps',          category: 'Shoes', price: 135, comparePrice: 169, stock: 12, desc: 'Pointed-toe kitten heel pumps in patent leather — polished and professional.', imageUrl: img(IMG.shoes, 2) },
  { name: 'Leather Chelsea Boots',      category: 'Shoes', price: 180, comparePrice: 229, stock: 10, desc: 'Full-grain leather Chelsea boots with a Cuban heel and elasticated side gussets.', imageUrl: img(IMG.shoes, 1) },
  { name: 'Slip-On Leather Loafers',    category: 'Shoes', price: 105, stock: 20,                    desc: 'Tassel-detail leather loafers with a leather-lined interior and rubber sole.', imageUrl: img(IMG.shoes, 2) },
  { name: 'Lace-Up Knee-High Boots',    category: 'Shoes', price: 220, comparePrice: 279, stock: 8,  desc: 'Leather lace-up knee-high boots with a modest block heel and almond toe.', imageUrl: img(IMG.shoes, 1) },
  { name: 'Espadrille Wedges',          category: 'Shoes', price: 89,  stock: 22,                    desc: 'Jute-wrapped espadrille wedges with leather upper and ankle tie — summer staple.', imageUrl: img(IMG.shoes, 2) },
  { name: 'Classic Ballet Flats',       category: 'Shoes', price: 75,  comparePrice: 95,  stock: 30, desc: 'Leather ballet flats with a cushioned insole and flexible rubber sole.', imageUrl: img(IMG.shoes, 0) },
  { name: 'Chunky Dad Sneakers',        category: 'Shoes', price: 115, comparePrice: 149, stock: 17, desc: 'Retro-inspired dad sneakers with a chunky multi-layer sole and mesh upper.', imageUrl: img(IMG.shoes, 0) },
  { name: 'Leather Derby Shoes',        category: 'Shoes', price: 155, stock: 13,                    desc: 'Open-lacing Derby shoes in calf leather with a Dainite rubber sole.', imageUrl: img(IMG.shoes, 2) },
  { name: 'Over-Knee Suede Boots',      category: 'Shoes', price: 265, comparePrice: 339, stock: 6,  desc: 'Stretch-suede over-the-knee boots with a low block heel — statement luxury.', imageUrl: img(IMG.shoes, 1) },
  { name: 'Woven Leather Sandals',      category: 'Shoes', price: 85,  stock: 24,                    desc: 'Hand-woven leather flat sandals with a toe post and contoured footbed.', imageUrl: img(IMG.shoes, 2) },
  { name: 'Ankle Strap Heels',          category: 'Shoes', price: 125, comparePrice: 159, stock: 14, desc: 'Slender stiletto heels with adjustable ankle strap in satin and nubuck.', imageUrl: img(IMG.shoes, 1) },
  { name: 'Trail Running Shoes',        category: 'Shoes', price: 135, comparePrice: 169, stock: 18, desc: 'All-terrain trail shoes with protective rock plate and grippy Vibram outsole.', imageUrl: img(IMG.shoes, 0) },
  { name: 'Boat Shoes',                 category: 'Shoes', price: 95,  stock: 20,                    desc: 'Hand-sewn moccasin boat shoes in oiled nubuck with non-marking siping outsole.', imageUrl: img(IMG.shoes, 2) },

  // ── BAGS (18) ───────────────────────────────────────────────
  { name: 'Italian Leather Crossbody',  category: 'Bags',  price: 220, stock: 15,                    desc: 'Structured Italian calf-leather crossbody with gold-tone hardware and zip closure.', imageUrl: img(IMG.bags, 0) },
  { name: 'Structured Tote Bag',        category: 'Bags',  price: 195, stock: 11,                    desc: 'Premium structured tote in vegan leather with open interior and zip pocket.', imageUrl: img(IMG.bags, 1) },
  { name: 'Canvas & Leather Backpack',  category: 'Bags',  price: 110, comparePrice: 140, stock: 20, desc: 'Heavy-duty waxed canvas backpack with full-grain leather trims and laptop sleeve.', imageUrl: img(IMG.bags, 2) },
  { name: 'Quilted Chain Bag',          category: 'Bags',  price: 175, comparePrice: 225, stock: 12, desc: 'Diamond-quilted lambskin bag with interlocking chain strap — timeless sophistication.', imageUrl: img(IMG.bags, 0) },
  { name: 'Bucket Bag',                 category: 'Bags',  price: 155, comparePrice: 195, stock: 14, desc: 'Buttery-soft leather bucket bag with a drawstring closure and detachable pouch.', imageUrl: img(IMG.bags, 0) },
  { name: 'Baguette Bag',               category: 'Bags',  price: 145, comparePrice: 185, stock: 16, desc: 'Slim baguette bag with flap closure and shoulder chain — the iconic French shape.', imageUrl: img(IMG.bags, 1) },
  { name: 'Oversized Canvas Shopper',   category: 'Bags',  price: 65,  stock: 30,                    desc: 'Extra-large canvas tote with leather handles and interior zip pocket.', imageUrl: img(IMG.bags, 1) },
  { name: 'Mini Shoulder Bag',          category: 'Bags',  price: 125, comparePrice: 155, stock: 18, desc: 'Compact pebbled-leather mini bag with a top handle and detachable crossbody strap.', imageUrl: img(IMG.bags, 0) },
  { name: 'Patent Leather Clutch',      category: 'Bags',  price: 85,  stock: 22,                    desc: 'Patent leather envelope clutch with a fold-over magnetic closure.', imageUrl: img(IMG.bags, 1) },
  { name: 'Nylon Belt Bag',             category: 'Bags',  price: 75,  comparePrice: 95,  stock: 25, desc: 'Lightweight nylon belt bag with multiple compartments and an adjustable strap.', imageUrl: img(IMG.bags, 2) },
  { name: 'Leather Laptop Messenger',   category: 'Bags',  price: 165, comparePrice: 210, stock: 10, desc: 'Full-grain leather messenger bag with padded 15" laptop compartment.', imageUrl: img(IMG.bags, 2) },
  { name: 'Suede Pouch Bag',            category: 'Bags',  price: 95,  stock: 18,                    desc: 'Gathered suede pouch bag with a gold-tone clasp and shoulder chain.', imageUrl: img(IMG.bags, 0) },
  { name: 'Straw Raffia Bag',           category: 'Bags',  price: 75,  stock: 20,                    desc: 'Hand-woven natural raffia tote with leather handles — the summer beach essential.', imageUrl: img(IMG.bags, 1) },
  { name: 'Sports Duffel Bag',          category: 'Bags',  price: 110, comparePrice: 139, stock: 16, desc: 'Spacious gym duffel in water-resistant nylon with a ventilated shoe compartment.', imageUrl: img(IMG.bags, 2) },
  { name: 'Velvet Top Handle Bag',      category: 'Bags',  price: 135, comparePrice: 169, stock: 12, desc: 'Jewel-toned velvet bag with gold-tone top handles and a removable chain strap.', imageUrl: img(IMG.bags, 0) },
  { name: 'Wicker Basket Bag',          category: 'Bags',  price: 85,  stock: 22,                    desc: 'Handcrafted wicker basket bag with a leather top handle and cotton lining.', imageUrl: img(IMG.bags, 1) },
  { name: 'Fanny Pack',                 category: 'Bags',  price: 55,  stock: 28,                    desc: 'Compact leather fanny pack with adjustable belt strap — wearable around waist or chest.', imageUrl: img(IMG.bags, 2) },
  { name: 'Evening Metallic Clutch',    category: 'Bags',  price: 95,  comparePrice: 120, stock: 14, desc: 'Pleated metallic fabric clutch with a hinged frame closure — made for special occasions.', imageUrl: img(IMG.bags, 0) },

  // ── BEAUTY (15) ─────────────────────────────────────────────
  { name: 'Signature Eau de Parfum',    category: 'Beauty', price: 120, comparePrice: 150, stock: 30, desc: 'Layered floral and woody fragrance — top notes of bergamot, heart of rose, base of sandalwood.', imageUrl: img(IMG.beauty, 0) },
  { name: 'Complete Skincare Kit',      category: 'Beauty', price: 89,  stock: 25,                    desc: '5-piece routine set: cleanser, toner, serum, moisturiser, and SPF — everything you need.', imageUrl: img(IMG.beauty, 1) },
  { name: 'Vitamin C Brightening Serum',category: 'Beauty', price: 79,  comparePrice: 99,  stock: 28, desc: '20% L-ascorbic acid serum with niacinamide and ferulic acid — for radiant, even skin.', imageUrl: img(IMG.beauty, 1) },
  { name: 'Hydrating Clay Mask Set',    category: 'Beauty', price: 55,  stock: 32,                    desc: 'Set of 3 clay masks: pore-refining, brightening, and hydrating — one for every skin need.', imageUrl: img(IMG.beauty, 1) },
  { name: '20-Pan Eyeshadow Palette',   category: 'Beauty', price: 65,  comparePrice: 82,  stock: 22, desc: 'Professional eyeshadow palette with mattes, shimmers, and glitters in a neutral-to-smoky range.', imageUrl: img(IMG.beauty, 2) },
  { name: 'Satin Matte Lipstick Set',   category: 'Beauty', price: 55,  stock: 35,                    desc: 'Set of 5 long-wearing matte lipsticks in berry, nude, red, coral, and plum.', imageUrl: img(IMG.beauty, 2) },
  { name: 'Dewy Foundation Stick',      category: 'Beauty', price: 45,  stock: 40,                    desc: 'Buildable coverage foundation stick with hyaluronic acid for a natural, dewy finish.', imageUrl: img(IMG.beauty, 2) },
  { name: 'Luminous Highlighter Duo',   category: 'Beauty', price: 50,  stock: 28,                    desc: 'Duo compact with a blinding-highlight powder and a subtle bronzer — mix and layer freely.', imageUrl: img(IMG.beauty, 2) },
  { name: 'Precision Brow Kit',         category: 'Beauty', price: 38,  stock: 45,                    desc: 'Brow pencil, micro-blading pen, and setting gel — for sharp, defined brows all day.', imageUrl: img(IMG.beauty, 2) },
  { name: 'Fix & Set Spray',            category: 'Beauty', price: 32,  stock: 50,                    desc: 'Alcohol-free setting spray that locks makeup for 24 hours with a dewy finish.', imageUrl: img(IMG.beauty, 1) },
  { name: 'K-Beauty Sheet Mask Bundle', category: 'Beauty', price: 35,  comparePrice: 45,  stock: 40, desc: 'Bundle of 10 Korean sheet masks targeting glow, hydration, firming, and barrier repair.', imageUrl: img(IMG.beauty, 1) },
  { name: 'Rose Water Face Mist',       category: 'Beauty', price: 28,  stock: 55,                    desc: 'Pure Bulgarian rose water mist — refresh, tone, and prime skin throughout the day.', imageUrl: img(IMG.beauty, 1) },
  { name: 'Coffee Body Scrub',          category: 'Beauty', price: 35,  stock: 38,                    desc: 'Natural coffee and coconut oil body scrub that exfoliates and nourishes in one step.', imageUrl: img(IMG.beauty, 0) },
  { name: 'Dry Shampoo Spray',          category: 'Beauty', price: 25,  stock: 60,                    desc: 'Invisible dry shampoo that absorbs oil and adds volume without any white residue.', imageUrl: img(IMG.beauty, 2) },
  { name: 'Tinted Lip Balm Set',        category: 'Beauty', price: 30,  stock: 48,                    desc: 'Set of 4 tinted SPF15 lip balms in MLBB shades — moisture and colour in one.', imageUrl: img(IMG.beauty, 0) },

  // ── HOME (15) ───────────────────────────────────────────────
  { name: 'Aromatherapy Candle Set',    category: 'Home',  price: 55,  stock: 40,                    desc: 'Set of 3 hand-poured soy-wax candles in lavender, sandalwood, and eucalyptus.', imageUrl: img(IMG.home, 0) },
  { name: 'Linen Throw Pillow Set',     category: 'Home',  price: 45,  stock: 35,                    desc: 'Set of 2 stonewashed linen throw pillows with hidden zip — machine washable.', imageUrl: img(IMG.home, 1) },
  { name: 'Chunky Knit Throw Blanket',  category: 'Home',  price: 89,  comparePrice: 115, stock: 18, desc: 'Artisan-crafted oversized knit throw in merino blend — cosy, textured, and gorgeous.', imageUrl: img(IMG.home, 1) },
  { name: 'Reed Diffuser & Refill Set', category: 'Home',  price: 55,  stock: 28,                    desc: 'Premium reed diffuser with 100ml fragrance oil and 10 natural rattan reeds.', imageUrl: img(IMG.home, 0) },
  { name: 'Handmade Ceramic Mug Set',   category: 'Home',  price: 65,  comparePrice: 82,  stock: 20, desc: 'Set of 4 hand-thrown stoneware mugs with a speckled glaze — oven and dishwasher safe.', imageUrl: img(IMG.home, 1) },
  { name: 'Terrazzo Coaster Set',       category: 'Home',  price: 40,  stock: 32,                    desc: 'Set of 4 terrazzo-effect resin coasters in blush, sage, navy, and black.', imageUrl: img(IMG.home, 0) },
  { name: 'Marble Serving Board',       category: 'Home',  price: 75,  comparePrice: 95,  stock: 14, desc: 'Italian Carrara marble serving board with leather strap — for cheese, charcuterie, and more.', imageUrl: img(IMG.home, 1) },
  { name: 'Waffle Cotton Towel Set',    category: 'Home',  price: 55,  stock: 25,                    desc: 'Set of 3 organic-cotton waffle towels (bath, hand, face) in 8 muted tones.', imageUrl: img(IMG.home, 1) },
  { name: 'Botanical Art Print Set',    category: 'Home',  price: 65,  stock: 22,                    desc: 'Set of 3 A3 botanical illustration prints — archival giclée print on 310gsm paper.', imageUrl: img(IMG.home, 0) },
  { name: 'Bamboo Desk Organiser',      category: 'Home',  price: 45,  stock: 30,                    desc: 'Sustainable bamboo desk tidy with 6 compartments — keeps your workspace clutter-free.', imageUrl: img(IMG.home, 1) },
  { name: 'Scented Soy Wax Melts',      category: 'Home',  price: 28,  stock: 50,                    desc: 'Pack of 8 highly scented soy wax melt bars in seasonal fragrance collections.', imageUrl: img(IMG.home, 0) },
  { name: 'Speckled Ceramic Plant Pot', category: 'Home',  price: 35,  stock: 38,                    desc: 'Hand-painted speckled stoneware plant pot with drainage hole and matching saucer.', imageUrl: img(IMG.home, 0) },
  { name: 'Linen Napkin Set',           category: 'Home',  price: 38,  stock: 28,                    desc: 'Set of 6 stonewashed linen napkins with a whip-stitched hem in six muted tones.', imageUrl: img(IMG.home, 1) },
  { name: 'Rattan Photo Frame Set',     category: 'Home',  price: 50,  stock: 24,                    desc: 'Set of 3 rattan-wrapped photo frames in 4×6, 5×7, and 8×10 — natural and boho.', imageUrl: img(IMG.home, 1) },
  { name: 'Macrame Wall Hanging',       category: 'Home',  price: 75,  comparePrice: 95,  stock: 16, desc: 'Hand-knotted macrame wall hanging in cotton rope — adds texture to any wall.', imageUrl: img(IMG.home, 0) },

  // ── KIDS (15) ───────────────────────────────────────────────
  { name: 'Princess Tulle Dress',       category: 'Kids',  price: 55,  stock: 18,                    desc: 'Layered tulle party dress with satin bodice and ribbon waist tie — for ages 2–10.', imageUrl: img(IMG.kids, 0) },
  { name: 'Denim Dungarees',            category: 'Kids',  price: 48,  comparePrice: 62,  stock: 24, desc: 'Adjustable-strap denim dungarees with embroidered pockets — cute and durable.', imageUrl: img(IMG.kids, 0) },
  { name: 'Animal Print Tee Set',       category: 'Kids',  price: 36,  stock: 30,                    desc: 'Set of 3 fun animal-print cotton T-shirts in bold colours — comfy and easy-care.', imageUrl: img(IMG.kids, 0) },
  { name: 'Waterproof Raincoat',        category: 'Kids',  price: 65,  comparePrice: 82,  stock: 20, desc: 'Fully seam-sealed waterproof jacket with hood and reflective strips — for ages 2–12.', imageUrl: img(IMG.kids, 0) },
  { name: 'Light-Up Canvas Sneakers',   category: 'Kids',  price: 42,  stock: 28,                    desc: 'LED light-up canvas sneakers with velcro strap — guaranteed to be a hit.', imageUrl: img(IMG.kids, 1) },
  { name: 'Floral Leggings & Top Set',  category: 'Kids',  price: 34,  stock: 32,                    desc: 'Matching floral-print leggings and long-sleeve crop top set in soft jersey fabric.', imageUrl: img(IMG.kids, 0) },
  { name: 'Puffer Winter Jacket',       category: 'Kids',  price: 78,  comparePrice: 98,  stock: 14, desc: 'Insulated puffer jacket with detachable hood and reflective zip pulls — toasty and bright.', imageUrl: img(IMG.kids, 0) },
  { name: 'Swim Set with UPF50',        category: 'Kids',  price: 42,  stock: 22,                    desc: 'Two-piece rash-guard swim set with UPF50+ protection in fun printed designs.', imageUrl: img(IMG.kids, 0) },
  { name: 'Kids School Backpack',       category: 'Kids',  price: 48,  comparePrice: 60,  stock: 26, desc: 'Ergonomic padded backpack with pencil case, side bottle pocket, and reflective strip.', imageUrl: img(IMG.kids, 2) },
  { name: 'Cozy Pajama Set',            category: 'Kids',  price: 38,  stock: 34,                    desc: 'Super-soft fleece pajama set with all-over star print — machine washable, sizes 1–12.', imageUrl: img(IMG.kids, 0) },
  { name: 'Velcro Strap Sandals',       category: 'Kids',  price: 36,  comparePrice: 48,  stock: 28, desc: 'Adjustable triple-velcro sandals with cushioned footbed and anti-slip sole.', imageUrl: img(IMG.kids, 1) },
  { name: 'Hoodie & Jogger Set',        category: 'Kids',  price: 52,  stock: 26,                    desc: 'Matching cotton-fleece hoodie and jogger set — cosy enough for lounging, cool enough for school.', imageUrl: img(IMG.kids, 0) },
  { name: 'Beanie & Mitten Set',        category: 'Kids',  price: 28,  stock: 40,                    desc: 'Ribbed knit beanie and mitten set with fleece lining — warm, stretchy, and washable.', imageUrl: img(IMG.kids, 0) },
  { name: 'Waterproof Rain Boots',      category: 'Kids',  price: 48,  stock: 22,                    desc: 'Rubber wellington boots with a non-slip sole and easy-pull handles — great for puddles.', imageUrl: img(IMG.kids, 2) },
  { name: 'Sun Dress & Sun Hat Set',    category: 'Kids',  price: 48,  comparePrice: 62,  stock: 20, desc: 'Matching smock dress and wide-brim sun hat in a tropical print — UPF50+ hat.', imageUrl: img(IMG.kids, 0) },

  // ── SPORTS (20) ─────────────────────────────────────────────
  { name: 'Performance Running Shoes',  category: 'Sports', price: 125, comparePrice: 159, stock: 20, desc: 'Carbon-fibre plate running shoes with nitrogen-infused foam for maximum energy return.', imageUrl: img(IMG.sports, 2) },
  { name: 'High-Waist Yoga Leggings',   category: 'Sports', price: 65,  comparePrice: 85,  stock: 28, desc: '4-way stretch high-waist leggings with hidden waistband pocket — squat-proof fabric.', imageUrl: img(IMG.sports, 1) },
  { name: 'Racerback Sports Bra',       category: 'Sports', price: 45,  stock: 32,                    desc: 'Medium-impact racerback bra with moulded cups and moisture-wicking fabric.', imageUrl: img(IMG.sports, 1) },
  { name: 'Quick-Dry Running Shorts',   category: 'Sports', price: 50,  comparePrice: 65,  stock: 25, desc: '3" split-hem running shorts with laser-cut ventilation and inner brief.', imageUrl: img(IMG.sports, 0) },
  { name: 'Zip-Up Training Hoodie',     category: 'Sports', price: 85,  comparePrice: 110, stock: 18, desc: 'Full-zip fleece-backed training hoodie with thumbhole cuffs and kangaroo pocket.', imageUrl: img(IMG.sports, 0) },
  { name: 'Compression Running Tights', category: 'Sports', price: 70,  comparePrice: 90,  stock: 22, desc: 'Full-length graduated-compression tights with muscle-support panels and ankle zip.', imageUrl: img(IMG.sports, 1) },
  { name: 'Lightweight Running Jacket', category: 'Sports', price: 110, comparePrice: 139, stock: 14, desc: 'Packable wind-and-water-resistant jacket with underarm ventilation and reflective trim.', imageUrl: img(IMG.sports, 0) },
  { name: 'Cross-Training Shoes',       category: 'Sports', price: 120, comparePrice: 155, stock: 16, desc: 'Wide-base training shoes with lateral support strap and sticky rubber outsole.', imageUrl: img(IMG.sports, 2) },
  { name: 'Resistance Band Set',        category: 'Sports', price: 35,  stock: 45,                    desc: 'Set of 5 fabric resistance bands in increasing tension — from light to extra-heavy.', imageUrl: img(IMG.sports, 1) },
  { name: 'Non-Slip Yoga Mat',          category: 'Sports', price: 55,  comparePrice: 70,  stock: 30, desc: 'TPE eco-friendly yoga mat (6mm) with alignment lines and carrying strap.', imageUrl: img(IMG.sports, 1) },
  { name: 'Insulated Water Bottle',     category: 'Sports', price: 40,  stock: 50,                    desc: 'Triple-wall vacuum-insulated stainless steel bottle — cold 24h, hot 12h.', imageUrl: img(IMG.sports, 0) },
  { name: 'Outdoor Running Vest',       category: 'Sports', price: 55,  comparePrice: 70,  stock: 20, desc: 'Technical running vest with front storage pockets and reflective 360° print.', imageUrl: img(IMG.sports, 0) },
  { name: 'Tennis Polo Shirt',          category: 'Sports', price: 65,  stock: 22,                    desc: 'Breathable micro-piqué polo with UPF30 protection — made for the court and beyond.', imageUrl: img(IMG.sports, 0) },
  { name: 'Basketball Shorts',          category: 'Sports', price: 48,  stock: 28,                    desc: 'Mesh basketball shorts with 11" inseam and drawcord waist — for the court or the street.', imageUrl: img(IMG.sports, 0) },
  { name: 'Gym Training Gloves',        category: 'Sports', price: 30,  stock: 40,                    desc: 'Padded palm training gloves with wrist wrap support and anti-slip grip.', imageUrl: img(IMG.sports, 1) },
  { name: 'Speed Jump Rope',            category: 'Sports', price: 28,  stock: 45,                    desc: 'Ball-bearing speed rope with aluminium handles and adjustable PVC cable.', imageUrl: img(IMG.sports, 0) },
  { name: 'Sports Headband Set',        category: 'Sports', price: 22,  stock: 55,                    desc: 'Pack of 4 wide terrycloth sweat-wicking headbands in neutral colourways.', imageUrl: img(IMG.sports, 1) },
  { name: 'Cushioned Crew Socks 5-Pack',category: 'Sports', price: 28,  stock: 60,                    desc: 'Five pairs of arch-support cushioned crew socks in moisture-wicking merino blend.', imageUrl: img(IMG.sports, 2) },
  { name: 'Trail Running Backpack',     category: 'Sports', price: 95,  comparePrice: 120, stock: 15, desc: '10L trail pack with hydration-bladder sleeve, trekking-pole loops, and emergency whistle.', imageUrl: img(IMG.sports, 2) },
  { name: 'Swim Goggles',               category: 'Sports', price: 35,  comparePrice: 45,  stock: 30, desc: 'Anti-fog UV400 swim goggles with adjustable nose bridge and silicone seal.', imageUrl: img(IMG.sports, 0) },
]

const BLOG_POSTS = [
  { title: '10 Must-Have Wardrobe Essentials for 2025', slug: 'wardrobe-essentials-2025', excerpt: 'Build a timeless capsule wardrobe with these key pieces that never go out of style.', status: 'published' as const, publishedAt: new Date('2025-03-15').toISOString() },
  { title: 'The Art of Mixing Patterns Like a Pro', slug: 'mixing-patterns-guide', excerpt: 'Learn the golden rules of pattern mixing and create outfits that turn heads wherever you go.', status: 'published' as const, publishedAt: new Date('2025-02-28').toISOString() },
  { title: 'Sustainable Fashion: Making Conscious Choices', slug: 'sustainable-fashion', excerpt: 'How to build a stylish wardrobe while minimizing your environmental footprint.', status: 'published' as const, publishedAt: new Date('2025-02-10').toISOString() },
]

// Download a URL and return a Buffer + filename
function downloadImage(url: string): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject)
      }
      const chunks: Buffer[] = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const ext = (res.headers['content-type'] ?? 'image/jpeg').includes('png') ? 'png' : 'jpg'
        const slug = url.split('/').pop()?.split('?')[0] ?? 'image'
        resolve({ buffer, filename: `${slug}.${ext}`, mimeType: res.headers['content-type'] ?? 'image/jpeg' })
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

// Upload an image URL to Payload Media and return the created media ID
async function uploadMedia(payload: any, imageUrl: string, alt: string): Promise<string | null> {
  try {
    const { buffer, filename, mimeType } = await downloadImage(imageUrl)
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        mimetype: mimeType,
        name: filename,
        size: buffer.length,
      },
    })
    return String(media.id)
  } catch (err) {
    console.warn(`  ⚠ Could not upload image for "${alt}":`, (err as Error).message)
    return null
  }
}

async function seed() {
  const payload = await getPayload({ config: configPromise })
  console.log('\n🌱 Starting seed...\n')

  // Admin user
  const existingAdmin = await payload.find({ collection: 'users', where: { email: { equals: 'admin@store.com' } }, limit: 1 })
  let adminUser: any
  if (!existingAdmin.docs.length) {
    adminUser = await payload.create({
      collection: 'users',
      data: { firstName: 'Admin', lastName: 'User', email: 'admin@store.com', password: 'Admin@123456', role: 'admin' } as any,
    })
    console.log('✅ Admin user created: admin@store.com / Admin@123456')
  } else {
    adminUser = existingAdmin.docs[0]
    console.log('⏭  Admin user already exists')
  }

  // Categories — upload image to Media, then attach to category
  const catMap: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    const existing = await payload.find({ collection: 'categories', where: { name: { equals: cat.name } }, limit: 1 })
    if (!existing.docs.length) {
      console.log(`  ↑ Uploading image for category: ${cat.name}`)
      const mediaId = await uploadMedia(payload, cat.imageUrl, cat.name)
      const created = await payload.create({
        collection: 'categories',
        data: { name: cat.name, description: cat.description, itemCount: cat.itemCount, ...(mediaId ? { image: Number(mediaId) } : {}) } as any,
      })
      catMap[cat.name] = String(created.id)
      console.log(`✅ Category: ${cat.name}`)
    } else {
      catMap[cat.name] = String(existing.docs[0].id)
      console.log(`⏭  Category exists: ${cat.name}`)
    }
  }

  // Products — upload image to Media, then attach to product
  for (let pi = 0; pi < PRODUCTS.length; pi++) {
    const p = PRODUCTS[pi]
    const existing = await payload.find({ collection: 'products', where: { name: { equals: p.name } }, limit: 1 })
    if (!existing.docs.length) {
      console.log(`  ↑ Uploading image for product: ${p.name}`)
      const mediaId = await uploadMedia(payload, p.imageUrl, p.name)
      const sku = `${p.name.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 10)}-${String(pi + 1).padStart(3, '0')}`
      await payload.create({
        collection: 'products',
        data: {
          name: p.name,
          shortDesc: p.desc,
          description: makeDesc(p.name, p.category, p.desc),
          status: 'active',
          categories: catMap[p.category] ? [Number(catMap[p.category])] : [],
          ...(mediaId ? { images: [{ image: Number(mediaId), altText: p.name, isPrimary: true }] } : {}),
          pricing: { price: p.price, comparePrice: p.comparePrice, currency: 'USD' },
          inventory: { trackStock: true, stock: p.stock, lowStockAlert: 5, sku },
          specs: makeSpecs(p.category, pi),
          ratings: { average: 4.5, count: 0 },
          variants: [{ name: 'Size', options: [{ label: 'S' }, { label: 'M' }, { label: 'L' }, { label: 'XL' }] }],
        } as any,
      })
      console.log(`✅ Product: ${p.name}`)
    } else {
      console.log(`⏭  Product exists: ${p.name}`)
    }
  }

  // Blog posts
  for (const post of BLOG_POSTS) {
    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: post.slug } }, limit: 1 })
    if (!existing.docs.length) {
      await payload.create({
        collection: 'posts',
        data: { ...post, author: adminUser.id, content: { root: { type: 'root', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: post.excerpt, version: 1 }] }], direction: 'ltr', format: '', indent: 0, version: 1 } } } as any,
      })
      console.log(`✅ Post: ${post.title}`)
    } else {
      console.log(`⏭  Post exists: ${post.title}`)
    }
  }

  // Reviewer users
  console.log('\n👥 Creating reviewer accounts...')
  const reviewerIds: string[] = []
  for (const reviewer of REVIEWERS) {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: reviewer.email } }, limit: 1 })
    if (existing.docs.length) {
      reviewerIds.push(String(existing.docs[0].id))
    } else {
      const created = await payload.create({
        collection: 'users',
        data: { ...reviewer, password: 'Review@123456', role: 'customer' } as any,
      })
      reviewerIds.push(String(created.id))
    }
  }
  console.log(`✅ ${reviewerIds.length} reviewer accounts ready`)

  // Reviews — 3–5 per product, approved, verified
  console.log('\n⭐ Seeding reviews...')
  const catIdToName: Record<string, string> = {}
  for (const [name, id] of Object.entries(catMap)) { catIdToName[String(id)] = name }

  const allProds = await payload.find({ collection: 'products', limit: 200, depth: 1 })
  let reviewTotal = 0
  for (let pi = 0; pi < allProds.docs.length; pi++) {
    const prod = allProds.docs[pi] as any
    const firstCatId = typeof prod.categories?.[0] === 'object' ? String(prod.categories[0].id) : String(prod.categories?.[0] ?? '')
    const catName = catIdToName[firstCatId] ?? 'Women'
    const pool = REVIEW_POOL[catName] ?? REVIEW_POOL['Women']
    const count = 3 + (pi % 3) // 3, 4, or 5 reviews per product

    const already = await payload.find({ collection: 'reviews', where: { product: { equals: prod.id } }, limit: 1 })
    if (already.docs.length) { console.log(`⏭  Reviews exist: ${prod.name}`); continue }

    const ratings: number[] = []
    for (let ri = 0; ri < count; ri++) {
      const review = pool[(pi * 3 + ri) % pool.length]
      const userId = reviewerIds[(pi * 5 + ri) % reviewerIds.length]
      await payload.create({
        collection: 'reviews',
        data: {
          product: Number(prod.id),
          user: Number(userId),
          rating: review.rating,
          title: review.title,
          body: review.body,
          isVerified: true,
          isApproved: true,
        } as any,
      })
      ratings.push(review.rating)
      reviewTotal++
    }

    const avg = Math.round((ratings.reduce((s, r) => s + r, 0) / ratings.length) * 10) / 10
    await payload.update({
      collection: 'products',
      id: prod.id,
      data: { ratings: { average: avg, count: ratings.length } } as any,
    })
    console.log(`✅ ${count} reviews → ${prod.name} (avg ${avg})`)
  }
  console.log(`\n✅ ${reviewTotal} total reviews seeded`)

  // Upload about-page images
  console.log('\n  Uploading About page images...')
  const [aboutHeroId, aboutMissionId, team1Id, team2Id, team3Id] = await Promise.all([
    uploadMedia(payload, 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80', 'About NovaCart'),
    uploadMedia(payload, 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80', 'Our Story'),
    uploadMedia(payload, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', 'Alexandra Chen'),
    uploadMedia(payload, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', 'Marcus Williams'),
    uploadMedia(payload, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', 'Sofia Garcia'),
  ])

  // Globals
  await payload.updateGlobal({ slug: 'site-settings', data: { siteName: 'NovaCart', tagline: 'Discover Your Style. Premium products curated for discerning shoppers.', announcement: '🎉 Free shipping on orders over $50 — Use code FREESHIP!', supportEmail: 'support@novacart.demo', supportPhone: '+1 (800) 555-0100', currency: 'USD' } as any })
  await payload.updateGlobal({
    slug: 'navigation', data: {
      navItems: [{ label: 'Shop', link: '/shop' }, { label: 'Blog', link: '/blog' }, { label: 'About', link: '/about' }, { label: 'Contact', link: '/contact' }],
      footerLinks: [
        { heading: 'Shop', links: [{ label: 'All Products', href: '/shop' }, { label: 'New Arrivals', href: '/shop?sort=newest' }, { label: 'Sale', href: '/shop?sort=price_asc' }, { label: 'Blog', href: '/blog' }] },
        { heading: 'Support', links: [{ label: 'Contact Us', href: '/contact' }, { label: 'FAQ', href: '/contact#faq' }, { label: 'Shipping Info', href: '/about' }, { label: 'Returns', href: '/about' }] },
        { heading: 'Company', links: [{ label: 'About Us', href: '/about' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }] },
      ],
    } as any,
  })
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        heading: 'Discover Your Perfect Style',
        subheading: 'Curated fashion for the modern lifestyle. Premium quality, unbeatable prices.',
        ctaText: 'Shop Now', ctaLink: '/shop',
        secondaryCtaText: 'Our Story', secondaryCtaLink: '/about',
        stats: [{ value: '10k+', label: 'Products' }, { value: '50k+', label: 'Happy Customers' }, { value: '4.9★', label: 'Rating' }],
      },
      trustBadges: [
        { icon: 'truck', title: 'Free Shipping', description: 'On orders over $50' },
        { icon: 'refresh', title: 'Easy Returns', description: '30-day hassle-free returns' },
        { icon: 'shield', title: 'Secure Payment', description: 'SSL encrypted checkout' },
        { icon: 'headphones', title: '24/7 Support', description: 'Always here to help' },
      ],
      newsletter: { heading: 'Get 10% Off Your First Order', subheading: 'Subscribe to our newsletter and unlock exclusive deals, early access to sales, and style inspiration.' },
    } as any,
  })
  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      heroTitle: 'Our Story',
      ...(aboutHeroId ? { heroImage: Number(aboutHeroId) } : {}),
      missionTitle: 'Fashion That Empowers',
      missionText: 'Founded in 2020, NovaCart was born from a simple belief: everyone deserves to feel confident in what they wear. We curate premium fashion from around the world, making style accessible without compromising quality.',
      missionText2: 'Today, we serve over 50,000 customers across 50+ countries, offering everything from everyday essentials to luxury statement pieces — all carefully selected by our team of fashion experts.',
      ...(aboutMissionId ? { missionImage: Number(aboutMissionId) } : {}),
      stats: [{ value: '50K+', label: 'Happy Customers' }, { value: '10K+', label: 'Premium Products' }, { value: '4.9★', label: 'Average Rating' }, { value: '50+', label: 'Countries Served' }],
      teamHeading: 'Meet Our Team',
      team: [
        { name: 'Alexandra Chen', role: 'Founder & CEO', ...(team1Id ? { image: Number(team1Id) } : {}) },
        { name: 'Marcus Williams', role: 'Head of Design', ...(team2Id ? { image: Number(team2Id) } : {}) },
        { name: 'Sofia Garcia', role: 'Brand Director', ...(team3Id ? { image: Number(team3Id) } : {}) },
      ],
      ctaTitle: 'Ready to Elevate Your Style?',
      ctaText: 'Join thousands of fashion-forward shoppers discovering their perfect look.',
      ctaLink: '/shop',
      ctaButtonText: 'Shop Now',
    } as any,
  })
  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      pageTitle: 'Get in Touch',
      pageDescription: "We'd love to hear from you. Send us a message and we'll respond within 24 hours.",
      contactInfo: { email: 'support@novacart.demo', phone: '+1 (800) 555-0100', address: '123 Fashion Ave, New York, NY 10001', hours: 'Mon–Fri: 9AM–6PM EST' },
      faq: [
        { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-7 business days. Express shipping takes 1-2 business days.' },
        { question: 'What is your return policy?', answer: 'We offer a 30-day hassle-free return policy for all unused items in original condition.' },
        { question: 'Do you ship internationally?', answer: 'Yes! We ship to 50+ countries worldwide. Shipping costs and times vary by location.' },
      ],
    } as any,
  })
  await payload.updateGlobal({
    slug: 'order-success',
    data: {
      heading: 'Order Confirmed!',
      subheading: 'Thank you for your purchase.',
      description: "You'll receive a confirmation email shortly with your order details and tracking information.",
      stepsHeading: 'What happens next?',
      steps: [
        { text: 'Order confirmation sent to your email' },
        { text: 'Your items will be prepared for shipping' },
        { text: "You'll get tracking info once shipped (2-5 business days)" },
      ],
    } as any,
  })
  await payload.updateGlobal({
    slug: 'blog-page',
    data: { pageTitle: 'Style Journal', pageDescription: 'Fashion tips, trends, and inspiration from our style experts', featuredLabel: 'Featured' } as any,
  })
  console.log('✅ Globals seeded')

  // Coupon
  const couponExists = await payload.find({ collection: 'coupons', where: { code: { equals: 'WELCOME10' } }, limit: 1 })
  if (!couponExists.docs.length) {
    await payload.create({ collection: 'coupons', data: { code: 'WELCOME10', type: 'percentage', value: 10, isActive: true, minOrderValue: 50 } as any })
    console.log('✅ Coupon: WELCOME10 (10% off $50+)')
  }

  console.log('\n🎉 Seed complete!\n')
  console.log('Admin login: admin@store.com / Admin@123456')
  console.log('Test coupon: WELCOME10 (10% off orders $50+)\n')
  process.exit(0)
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1) })
