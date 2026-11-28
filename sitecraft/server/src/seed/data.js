// Categories and their 3-4 templates.
// Each template = a layout (classic / bold / minimal / dark) + theme colors + category content.
// Every generated website has 3 pages: Home, Products and Contact.
import { shopCategories, shopContent, shopDemo, shopPlan } from './shops.js';

const img = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const p = (name, price, description, id) => ({ name, price, description, image: img(id, 700) });

const baseCategories = [
  { name: 'Restaurant & Cafe', slug: 'restaurant', icon: '🍽️', order: 1, description: 'Delicious websites for restaurants, cafes, bakeries and cloud kitchens.', cover: img('1517248135467-4c7edcad34c4', 800) },
  { name: 'Mobile & Electronics Store', slug: 'mobile-store', icon: '📱', order: 2, description: 'Product-focused websites for mobile shops, electronics and accessories stores.', cover: img('1511707171634-5f897ff02aa9', 800) },
  { name: 'Gym & Fitness', slug: 'fitness', icon: '💪', order: 3, description: 'Energetic designs for gyms, yoga studios and personal trainers.', cover: img('1534438327276-14e5300c3a48', 800) },
  { name: 'Salon & Spa', slug: 'salon', icon: '💇', order: 4, description: 'Elegant templates for beauty parlours, salons and spas.', cover: img('1560066984-138dadb4c035', 800) },
  { name: 'Portfolio & Photography', slug: 'portfolio', icon: '📸', order: 5, description: 'Clean portfolios for photographers, designers and freelancers.', cover: img('1452587925148-ce544e77e70d', 800) },
  { name: 'Business & Agency', slug: 'business', icon: '💼', order: 6, description: 'Professional websites for startups, agencies and consultants.', cover: img('1497366216548-37526070297c', 800) },
  { name: 'Real Estate', slug: 'real-estate', icon: '🏡', order: 7, description: 'Premium layouts for property dealers, builders and agents.', cover: img('1600596542815-ffad4c1539a9', 800) },
];

// group: 'shop' = sells products, 'service' = service business
export const SHOP_SLUGS = ['mobile-store', ...shopCategories.map((c) => c.slug)];

export const categories = [
  ...baseCategories.map((c) => ({ ...c, group: SHOP_SLUGS.includes(c.slug) ? 'shop' : 'service' })),
  ...shopCategories.map((c, i) => ({ ...c, group: 'shop', order: 10 + i })),
];

// Fixed content of a template: "Why choose us" features + the name of the products page
const content = {
  restaurant: {
    productsLabel: 'Menu', productsIntro: 'Signature dishes from our chefs — fresh, tasty and made with love.', cta: 'Book a Table',
    features: [
      { icon: '🥗', title: 'Fresh Ingredients', desc: 'Fresh vegetables and premium spices every morning.' },
      { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Chefs with more than 15 years of experience.' },
      { icon: '🚚', title: 'Fast Delivery', desc: 'Hot food at your door in 30 minutes.' },
      { icon: '🎉', title: 'Party Orders', desc: 'Catering for birthdays and corporate events.' },
    ],
  },
  'mobile-store': {
    productsLabel: 'Products', productsIntro: 'The latest smartphones and accessories — genuine products at the best prices.', cta: 'Call to Order',
    features: [
      { icon: '✅', title: '100% Genuine', desc: 'Brand-new, sealed products with a proper bill.' },
      { icon: '🛡️', title: 'Official Warranty', desc: 'Manufacturer warranty on every phone.' },
      { icon: '💳', title: 'Easy EMI', desc: 'No-cost EMI and all cards accepted.' },
      { icon: '🔧', title: 'Repair & Service', desc: 'Screen, battery and software repairs.' },
    ],
  },
  fitness: {
    productsLabel: 'Plans', productsIntro: 'Membership plans and programs for every goal.', cta: 'Join Now',
    features: [
      { icon: '🏋️', title: 'Modern Equipment', desc: 'The latest machines and free weights.' },
      { icon: '🧑‍🏫', title: 'Certified Trainers', desc: 'Personal guidance in every workout.' },
      { icon: '🥤', title: 'Diet Plans', desc: 'A custom nutrition plan for every member.' },
      { icon: '⏰', title: 'Flexible Timings', desc: 'Open from 5 AM to 11 PM.' },
    ],
  },
  salon: {
    productsLabel: 'Services', productsIntro: 'Every service delivered by experienced stylists using premium products.', cta: 'Book Appointment',
    features: [
      { icon: '✨', title: 'Expert Stylists', desc: 'Trained and certified beauty professionals.' },
      { icon: '🌿', title: 'Premium Products', desc: 'Only branded, skin-safe products.' },
      { icon: '🧼', title: 'Hygiene First', desc: 'Sanitised tools for every client.' },
      { icon: '💖', title: 'Relaxing Ambience', desc: 'A calm and luxurious experience.' },
    ],
  },
  portfolio: {
    productsLabel: 'Packages', productsIntro: 'Photography and video packages for every occasion.', cta: 'Hire Me',
    features: [
      { icon: '📷', title: 'Pro Equipment', desc: 'Full-frame cameras and cinema lenses.' },
      { icon: '🎨', title: 'Creative Eye', desc: 'A story in every frame.' },
      { icon: '⚡', title: 'Quick Delivery', desc: 'Edited photos within 7 days.' },
      { icon: '⭐', title: '500+ Clients', desc: 'Happy clients across India.' },
    ],
  },
  business: {
    productsLabel: 'Services', productsIntro: 'Complete solutions to grow your business.', cta: 'Get a Quote',
    features: [
      { icon: '📈', title: 'Result Driven', desc: 'Measurable growth in every project.' },
      { icon: '🧠', title: 'Expert Team', desc: 'Designers, developers and marketers.' },
      { icon: '💰', title: 'Affordable', desc: 'Startup-friendly pricing.' },
      { icon: '🤝', title: '24/7 Support', desc: 'Always here when you need us.' },
    ],
  },
  'real-estate': {
    productsLabel: 'Properties', productsIntro: 'Verified properties in the best locations at the best prices.', cta: 'Schedule a Visit',
    features: [
      { icon: '✅', title: 'Verified Listings', desc: 'Every property is legally checked.' },
      { icon: '📝', title: 'Legal Help', desc: 'Documentation and registration support.' },
      { icon: '🏦', title: 'Home Loans', desc: 'Easy loan assistance from top banks.' },
      { icon: '🔑', title: 'Hassle-free', desc: 'With you from site visit to possession.' },
    ],
  },
};

// Demo data used in previews — the user's own data replaces it
const demo = {
  restaurant: {
    title: 'Spice Garden', tagline: 'Authentic flavours, made with love',
    description: 'At Spice Garden we cook every dish from fresh ingredients and traditional recipes. Whether it is a family dinner or a party with friends, every visit is a memorable one.',
    images: ['1414235077428-338989a2e8c0', '1517248135467-4c7edcad34c4', '1555396273-367ea4eb4db5', '1559339352-11d035aa65de'].map((i) => img(i)),
    products: [
      p('Paneer Tikka Platter', '₹299', 'Soft paneer cubes from the tandoor, served with mint chutney.', '1567620905732-2d1ec7ab7445'),
      p('Garden Fresh Salad', '₹199', 'Seasonal vegetables with an olive oil and lemon dressing.', '1546069901-ba9599a7e63c'),
      p('Wood-fired Pizza', '₹349', 'Thin crust with mozzarella and fresh basil.', '1565299624946-b28f40a0ae38'),
      p("Chef's Special Thali", '₹399', 'Dal, sabzi, roti, rice and a sweet — a complete meal.', '1504674900247-0877df9cc836'),
    ],
  },
  'mobile-store': {
    title: 'Smart Mobile Hub', tagline: 'Latest phones. Best prices.',
    description: 'Smart Mobile Hub brings you the latest smartphones from every top brand, genuine accessories and expert repairs. Take home your new phone today with exchange offers and easy EMI.',
    images: ['1511707171634-5f897ff02aa9', '1592750475338-74b7b21085ab', '1546054454-aa26e2b734c7', '1598327105666-5b89351aff97'].map((i) => img(i)),
    products: [
      p('iPhone 15 (128 GB)', '₹69,900', 'A16 Bionic chip, 48MP camera, USB-C. Black, Blue and Pink.', '1592750475338-74b7b21085ab'),
      p('Samsung Galaxy S24', '₹74,999', 'Galaxy AI, 50MP triple camera, 8GB RAM.', '1598327105666-5b89351aff97'),
      p('Wireless Earbuds', '₹2,499', 'Noise cancellation and 30 hours of battery.', '1590658268037-6bf12165a8df'),
      p('Over-ear Headphones', '₹3,999', 'Deep bass, foldable design, Bluetooth 5.3.', '1505740420928-5e560c06d30e'),
      p('Smart Watch', '₹4,999', 'AMOLED display with heart-rate and SpO2 tracking.', '1523275335684-37898b6baf30'),
    ],
  },
  fitness: {
    title: 'Iron Pulse Gym', tagline: 'Stronger every single day',
    description: 'Start your fitness journey at Iron Pulse with certified trainers, modern equipment and personalised diet plans. Whether you want to lose weight or build muscle, we are with you all the way.',
    images: ['1571019613454-1cb2f99b2d8b', '1534438327276-14e5300c3a48', '1517836357463-d25dfeac3438', '1540497077202-7c8a3999166f'].map((i) => img(i)),
    products: [
      p('Monthly Membership', '₹1,499/mo', 'Full gym access, a locker and a free fitness assessment.', '1534438327276-14e5300c3a48'),
      p('Personal Training', '₹4,999/mo', 'A 1-on-1 trainer with a custom workout and diet plan.', '1517836357463-d25dfeac3438'),
      p('Yoga Classes', '₹999/mo', 'Morning and evening batches. Beginners welcome.', '1544367567-0f2fcb009e0b'),
      p('Annual Plan', '₹12,999/yr', 'Best value — 12 months plus 2 months free.', '1540497077202-7c8a3999166f'),
    ],
  },
  salon: {
    title: 'Glow & Grace', tagline: 'Where beauty meets relaxation',
    description: 'At Glow & Grace, experienced stylists and premium products give you a relaxing, luxurious experience. Leave with a new glow after every visit.',
    images: ['1522337360788-8b13dee7a37e', '1560066984-138dadb4c035', '1544161515-4ab6ce6db874', '1487412947147-5cebf100ffc2'].map((i) => img(i)),
    products: [
      p('Haircut & Styling', '₹499', 'A trendy haircut with an expert consultation.', '1560066984-138dadb4c035'),
      p('Bridal Makeup', '₹14,999', 'HD makeup, hairstyling and draping.', '1487412947147-5cebf100ffc2'),
      p('Spa & Massage', '₹1,999', 'A relaxing 60-minute full body massage.', '1544161515-4ab6ce6db874'),
      p('Nail Art', '₹799', 'Gel polish and custom nail designs.', '1604654894610-df63bc536371'),
    ],
  },
  portfolio: {
    title: 'Aarav Lens', tagline: 'Capturing moments that matter',
    description: 'I capture stories in frames. From weddings to brands, every project gets creativity and attention to detail. 8 years and more than 500 happy clients.',
    images: ['1502920917128-1aa500764cbd', '1452587925148-ce544e77e70d', '1519741497674-611481863552', '1516035069371-29a1b244cc32'].map((i) => img(i)),
    products: [
      p('Wedding Package', '₹49,999', '2 days of coverage, candid and traditional shots, and an album.', '1519741497674-611481863552'),
      p('Pre-wedding Shoot', '₹19,999', 'One location, 50 edited photos and a short reel.', '1511285560929-80b456fea0bc'),
      p('Product Shoot', '₹999/product', 'White-background and lifestyle shots.', '1523275335684-37898b6baf30'),
      p('Event Coverage', '₹9,999', 'Birthdays, corporate and private events.', '1452587925148-ce544e77e70d'),
    ],
  },
  business: {
    title: 'NexaWorks', tagline: 'We build brands that grow',
    description: 'NexaWorks helps businesses grow online with strategy, technology and marketing under one roof. More than 200 brands trust us.',
    images: ['1522071820081-009f0129c71c', '1497366216548-37526070297c', '1551434678-e076c223a692', '1556761175-b413da4baf72'].map((i) => img(i)),
    products: [
      p('Website Development', 'From ₹14,999', 'Fast, responsive and SEO-ready websites.', '1460925895917-afdab827c52f'),
      p('Social Media Marketing', '₹9,999/mo', 'Content, posting and paid ads management.', '1551434678-e076c223a692'),
      p('Branding & Logo', '₹7,999', 'Logo, colours and a complete brand kit.', '1454165804606-c3d57bc86b40'),
      p('Business Consulting', '₹2,999/hr', 'Growth strategy and planning sessions.', '1556761175-b413da4baf72'),
    ],
  },
  'real-estate': {
    title: 'Prime Estates', tagline: 'Find the home of your dreams',
    description: 'Prime Estates makes finding your dream home easy, with verified properties, transparent deals and expert guidance all in one place.',
    images: ['1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9', '1600607687939-ce8a6c25118c', '1512917774080-9991f1c4c750'].map((i) => img(i)),
    products: [
      p('3 BHK Luxury Villa', '₹1.2 Cr', 'Private garden, parking and a gated community.', '1600596542815-ffad4c1539a9'),
      p('2 BHK Apartment', '₹58 Lakh', 'City centre location, lift and 24x7 security.', '1502672260266-1c1ef2d93688'),
      p('Modern Family Home', '₹85 Lakh', 'Corner plot, 4 bedrooms and a modular kitchen.', '1568605114967-8130f3a36994'),
      p('Penthouse Suite', '₹2.4 Cr', 'Terrace, city views and premium interiors.', '1600607687939-ce8a6c25118c'),
    ],
  },
};

const contact = {
  phone: '+91 98765 43210',
  email: 'hello@example.com',
  address: 'MG Road, Ahmedabad, Gujarat',
  hours: 'Mon – Sat: 10:00 AM – 9:00 PM',
};

// [slug, name, layout, primary, accent, font, featured, tags]
const plan = {
  restaurant: [
    ['saffron', 'Saffron', 'classic', '#ea580c', '#1c1917', 'Playfair Display', true, ['warm', 'light']],
    ['ember', 'Ember', 'bold', '#dc2626', '#0c0a09', 'Poppins', false, ['hero', 'image']],
    ['olive', 'Olive Table', 'minimal', '#65a30d', '#1a2e05', 'Lora', false, ['clean', 'serif']],
    ['noir-bistro', 'Noir Bistro', 'dark', '#f59e0b', '#09090b', 'Playfair Display', true, ['dark', 'luxury']],
  ],
  'mobile-store': [
    ['techzone', 'TechZone', 'dark', '#22d3ee', '#020617', 'Poppins', true, ['dark', 'tech', 'electronics']],
    ['mobile-mart', 'Mobile Mart', 'classic', '#4f46e5', '#0f172a', 'Poppins', true, ['shop', 'light', 'blue']],
    ['gadget-pro', 'Gadget Pro', 'bold', '#f43f5e', '#111827', 'Poppins', false, ['hero', 'bold', 'sale']],
    ['pure-tech', 'Pure Tech', 'minimal', '#0f172a', '#0f172a', 'Inter', false, ['clean', 'apple-style']],
  ],
  fitness: [
    ['volt', 'Volt', 'bold', '#84cc16', '#0a0a0a', 'Oswald', true, ['energetic', 'hero']],
    ['titan', 'Titan', 'dark', '#ef4444', '#030712', 'Oswald', false, ['dark', 'strong']],
    ['flow-yoga', 'Flow', 'minimal', '#0d9488', '#042f2e', 'Poppins', false, ['yoga', 'calm']],
  ],
  salon: [
    ['blush', 'Blush', 'classic', '#db2777', '#3b0a24', 'Playfair Display', true, ['elegant', 'pink']],
    ['velvet', 'Velvet', 'dark', '#c084fc', '#0b0613', 'Lora', false, ['dark', 'luxury']],
    ['serene-spa', 'Serene', 'minimal', '#a16207', '#292524', 'Lora', false, ['spa', 'calm']],
    ['glam', 'Glam', 'bold', '#e11d48', '#1f0510', 'Poppins', false, ['hero', 'bold']],
  ],
  portfolio: [
    ['mono', 'Mono', 'minimal', '#171717', '#0a0a0a', 'Inter', true, ['clean', 'black-white']],
    ['shutter', 'Shutter', 'dark', '#38bdf8', '#020617', 'Poppins', false, ['dark', 'creative']],
    ['canvas', 'Canvas', 'bold', '#f97316', '#111827', 'Poppins', false, ['hero', 'bold']],
  ],
  business: [
    ['corporate-pro', 'Corporate Pro', 'classic', '#2563eb', '#0f172a', 'Inter', true, ['professional', 'blue']],
    ['launchpad', 'Launchpad', 'dark', '#8b5cf6', '#05010f', 'Poppins', false, ['startup', 'dark']],
    ['summit', 'Summit', 'bold', '#0891b2', '#082f49', 'Inter', false, ['hero', 'agency']],
  ],
  'real-estate': [
    ['skyline', 'Skyline', 'classic', '#0f766e', '#042f2e', 'Poppins', true, ['professional', 'green']],
    ['manor', 'Manor', 'dark', '#d4a373', '#0c0a09', 'Playfair Display', false, ['luxury', 'dark']],
    ['haven', 'Haven', 'minimal', '#1d4ed8', '#172554', 'Inter', false, ['clean', 'modern']],
    ['estate-bold', 'Landmark', 'bold', '#16a34a', '#052e16', 'Poppins', false, ['hero', 'bold']],
  ],
};

Object.assign(content, shopContent);
Object.assign(demo, shopDemo);
Object.assign(plan, shopPlan);

const layoutDesc = {
  classic: 'A light, split-hero layout with clean sections — perfect for any business.',
  bold: 'A full-screen image hero with bold typography that grabs attention instantly.',
  minimal: 'Simple, spacious and elegant — let your content speak.',
  dark: 'A premium dark theme with glowing accents and glass cards.',
};

export const templates = Object.entries(plan).flatMap(([cat, list]) =>
  list.map(([slug, name, layout, primary, accent, font, featured, tags]) => ({
    name,
    slug,
    category: cat,
    layout,
    featured,
    tags,
    pages: ['Home', content[cat].productsLabel, 'Contact'],
    description: layoutDesc[layout],
    theme: { primary, accent, font },
    content: content[cat],
    demo: { ...demo[cat], ...contact },
  }))
);
