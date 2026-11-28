// Categories aur unke 3-4 templates.
// Har template = ek "layout" (classic/bold/minimal/dark) + theme colors + category ka content.
// Har template website me 3 pages hote hain: Home, Products, Contact.
const img = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories = [
  { name: 'Restaurant & Cafe', slug: 'restaurant', icon: '🍽️', order: 1, description: 'Restaurants, cafes, bakeries aur cloud kitchens ke liye mouth-watering websites.', cover: img('1517248135467-4c7edcad34c4', 800) },
  { name: 'Gym & Fitness', slug: 'fitness', icon: '💪', order: 2, description: 'Gyms, yoga studios aur personal trainers ke liye energetic designs.', cover: img('1534438327276-14e5300c3a48', 800) },
  { name: 'Salon & Spa', slug: 'salon', icon: '💇', order: 3, description: 'Beauty parlours, salons aur spa ke liye elegant templates.', cover: img('1560066984-138dadb4c035', 800) },
  { name: 'Portfolio & Photography', slug: 'portfolio', icon: '📸', order: 4, description: 'Photographers, designers aur freelancers ke liye clean portfolios.', cover: img('1452587925148-ce544e77e70d', 800) },
  { name: 'Business & Agency', slug: 'business', icon: '💼', order: 5, description: 'Startups, agencies aur consultants ke liye professional websites.', cover: img('1497366216548-37526070297c', 800) },
  { name: 'Real Estate', slug: 'real-estate', icon: '🏡', order: 6, description: 'Property dealers, builders aur agents ke liye premium layouts.', cover: img('1600596542815-ffad4c1539a9', 800) },
];

// Template ka fixed content: "Why choose us" features + products page ka naam
const content = {
  restaurant: {
    productsLabel: 'Menu', productsIntro: 'Chef ki special dishes — fresh, tasty aur dil se bani hui.', cta: 'Book a Table',
    features: [
      { icon: '🥗', title: 'Fresh Ingredients', desc: 'Roz subah aane wali fresh sabziyan aur premium masale.' },
      { icon: '👨‍🍳', title: 'Expert Chefs', desc: '15+ saal ka experience rakhne wale chefs.' },
      { icon: '🚚', title: 'Fast Delivery', desc: 'Garma garam khana 30 minute me aapke ghar.' },
      { icon: '🎉', title: 'Party Orders', desc: 'Birthday aur corporate events ke liye catering.' },
    ],
  },
  fitness: {
    productsLabel: 'Plans', productsIntro: 'Aapke goal ke hisab se membership plans aur programs.', cta: 'Join Now',
    features: [
      { icon: '🏋️', title: 'Modern Equipment', desc: 'Latest machines aur free weights.' },
      { icon: '🧑‍🏫', title: 'Certified Trainers', desc: 'Personal guidance har workout me.' },
      { icon: '🥤', title: 'Diet Plans', desc: 'Custom nutrition plan har member ke liye.' },
      { icon: '⏰', title: 'Flexible Timings', desc: 'Subah 5 baje se raat 11 baje tak open.' },
    ],
  },
  salon: {
    productsLabel: 'Services', productsIntro: 'Premium products aur experienced stylists ke saath har service.', cta: 'Book Appointment',
    features: [
      { icon: '✨', title: 'Expert Stylists', desc: 'Trained aur certified beauty professionals.' },
      { icon: '🌿', title: 'Premium Products', desc: 'Sirf branded aur skin-safe products.' },
      { icon: '🧼', title: 'Hygiene First', desc: 'Har client ke baad sanitized tools.' },
      { icon: '💖', title: 'Relaxing Ambience', desc: 'Calm aur luxurious experience.' },
    ],
  },
  portfolio: {
    productsLabel: 'Packages', productsIntro: 'Har occasion ke liye photography aur video packages.', cta: 'Hire Me',
    features: [
      { icon: '📷', title: 'Pro Equipment', desc: 'Full-frame cameras aur cinema lenses.' },
      { icon: '🎨', title: 'Creative Eye', desc: 'Har frame me ek kahani.' },
      { icon: '⚡', title: 'Quick Delivery', desc: 'Edited photos 7 din me.' },
      { icon: '⭐', title: '500+ Clients', desc: 'Happy clients across India.' },
    ],
  },
  business: {
    productsLabel: 'Services', productsIntro: 'Aapke business ko grow karne ke liye complete solutions.', cta: 'Get a Quote',
    features: [
      { icon: '📈', title: 'Result Driven', desc: 'Measurable growth har project me.' },
      { icon: '🧠', title: 'Expert Team', desc: 'Designers, developers aur marketers.' },
      { icon: '💰', title: 'Affordable', desc: 'Startups ke liye friendly pricing.' },
      { icon: '🤝', title: '24/7 Support', desc: 'Hamesha aapke saath.' },
    ],
  },
  'real-estate': {
    productsLabel: 'Properties', productsIntro: 'Verified properties — best locations, best prices.', cta: 'Schedule a Visit',
    features: [
      { icon: '✅', title: 'Verified Listings', desc: 'Har property legally checked.' },
      { icon: '📝', title: 'Legal Help', desc: 'Documentation aur registration support.' },
      { icon: '🏦', title: 'Home Loans', desc: 'Best banks se easy loan assistance.' },
      { icon: '🔑', title: 'Hassle-free', desc: 'Site visit se possession tak saath.' },
    ],
  },
};

// Preview ke liye demo data — user ka data isko replace karega
const demo = {
  restaurant: {
    title: 'Spice Garden', tagline: 'Authentic flavours, made with love',
    description: 'Spice Garden me hum fresh ingredients aur traditional recipes se har dish dil se banate hain. Family dinner ho ya friends ke saath party — humare yahan har pal yaadgaar hai.',
    images: ['1414235077428-338989a2e8c0', '1517248135467-4c7edcad34c4', '1555396273-367ea4eb4db5', '1559339352-11d035aa65de'].map((i) => img(i)),
    products: [
      { name: 'Paneer Tikka Platter', price: '₹299', description: 'Tandoor me bane soft paneer cubes, mint chutney ke saath.', image: img('1567620905732-2d1ec7ab7445', 700) },
      { name: 'Garden Fresh Salad', price: '₹199', description: 'Seasonal veggies, olive oil aur lemon dressing.', image: img('1546069901-ba9599a7e63c', 700) },
      { name: 'Wood-fired Pizza', price: '₹349', description: 'Thin crust, mozzarella aur fresh basil.', image: img('1565299624946-b28f40a0ae38', 700) },
      { name: 'Chef Special Thali', price: '₹399', description: 'Dal, sabzi, roti, rice aur sweet — poora khana.', image: img('1504674900247-0877df9cc836', 700) },
    ],
  },
  fitness: {
    title: 'Iron Pulse Gym', tagline: 'Stronger every single day',
    description: 'Iron Pulse me certified trainers, modern equipment aur personalised diet plans ke saath apni fitness journey aaj hi shuru karein. Weight loss ho ya muscle gain — hum aapke saath hain.',
    images: ['1571019613454-1cb2f99b2d8b', '1534438327276-14e5300c3a48', '1517836357463-d25dfeac3438', '1540497077202-7c8a3999166f'].map((i) => img(i)),
    products: [
      { name: 'Monthly Membership', price: '₹1,499/mo', description: 'Full gym access, locker aur free fitness assessment.', image: img('1534438327276-14e5300c3a48', 700) },
      { name: 'Personal Training', price: '₹4,999/mo', description: '1-on-1 trainer, custom workout aur diet plan.', image: img('1517836357463-d25dfeac3438', 700) },
      { name: 'Yoga Classes', price: '₹999/mo', description: 'Morning aur evening batches, beginners welcome.', image: img('1544367567-0f2fcb009e0b', 700) },
      { name: 'Annual Plan', price: '₹12,999/yr', description: 'Best value — 12 mahine + 2 mahine free.', image: img('1540497077202-7c8a3999166f', 700) },
    ],
  },
  salon: {
    title: 'Glow & Grace', tagline: 'Where beauty meets relaxation',
    description: 'Glow & Grace me experienced stylists aur premium products ke saath hum aapko dete hain ek relaxing aur luxurious experience. Har visit me naya glow.',
    images: ['1522337360788-8b13dee7a37e', '1560066984-138dadb4c035', '1544161515-4ab6ce6db874', '1487412947147-5cebf100ffc2'].map((i) => img(i)),
    products: [
      { name: 'Haircut & Styling', price: '₹499', description: 'Expert consultation ke saath trendy haircut.', image: img('1560066984-138dadb4c035', 700) },
      { name: 'Bridal Makeup', price: '₹14,999', description: 'HD makeup, hairstyle aur draping.', image: img('1487412947147-5cebf100ffc2', 700) },
      { name: 'Spa & Massage', price: '₹1,999', description: '60 minute relaxing full body massage.', image: img('1544161515-4ab6ce6db874', 700) },
      { name: 'Nail Art', price: '₹799', description: 'Gel polish aur custom nail designs.', image: img('1604654894610-df63bc536371', 700) },
    ],
  },
  portfolio: {
    title: 'Aarav Lens', tagline: 'Capturing moments that matter',
    description: 'Main kahaniyon ko frames me capture karta hoon. Weddings se lekar brands tak — har project me creativity aur detail par focus. 8 saal, 500+ happy clients.',
    images: ['1502920917128-1aa500764cbd', '1452587925148-ce544e77e70d', '1519741497674-611481863552', '1516035069371-29a1b244cc32'].map((i) => img(i)),
    products: [
      { name: 'Wedding Package', price: '₹49,999', description: '2 din coverage, candid + traditional, album.', image: img('1519741497674-611481863552', 700) },
      { name: 'Pre-wedding Shoot', price: '₹19,999', description: '1 location, 50 edited photos, short reel.', image: img('1511285560929-80b456fea0bc', 700) },
      { name: 'Product Shoot', price: '₹999/product', description: 'White background + lifestyle shots.', image: img('1523275335684-37898b6baf30', 700) },
      { name: 'Event Coverage', price: '₹9,999', description: 'Birthday, corporate aur private events.', image: img('1452587925148-ce544e77e70d', 700) },
    ],
  },
  business: {
    title: 'NexaWorks', tagline: 'We build brands that grow',
    description: 'NexaWorks businesses ko digital duniya me grow karne me madad karta hai — strategy, technology aur marketing ek hi jagah. 200+ brands humpar bharosa karte hain.',
    images: ['1522071820081-009f0129c71c', '1497366216548-37526070297c', '1551434678-e076c223a692', '1556761175-b413da4baf72'].map((i) => img(i)),
    products: [
      { name: 'Website Development', price: 'From ₹14,999', description: 'Fast, responsive aur SEO-ready websites.', image: img('1460925895917-afdab827c52f', 700) },
      { name: 'Social Media Marketing', price: '₹9,999/mo', description: 'Content, posting aur paid ads management.', image: img('1551434678-e076c223a692', 700) },
      { name: 'Branding & Logo', price: '₹7,999', description: 'Logo, colours aur complete brand kit.', image: img('1454165804606-c3d57bc86b40', 700) },
      { name: 'Business Consulting', price: '₹2,999/hr', description: 'Growth strategy aur planning sessions.', image: img('1556761175-b413da4baf72', 700) },
    ],
  },
  'real-estate': {
    title: 'Prime Estates', tagline: 'Find the home of your dreams',
    description: 'Prime Estates ke saath sapno ka ghar dhoondhna ab aasaan. Verified properties, transparent deals aur expert guidance — sab ek jagah.',
    images: ['1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9', '1600607687939-ce8a6c25118c', '1512917774080-9991f1c4c750'].map((i) => img(i)),
    products: [
      { name: '3 BHK Luxury Villa', price: '₹1.2 Cr', description: 'Private garden, parking, gated society.', image: img('1600596542815-ffad4c1539a9', 700) },
      { name: '2 BHK Apartment', price: '₹58 Lakh', description: 'City centre, lift, 24x7 security.', image: img('1502672260266-1c1ef2d93688', 700) },
      { name: 'Modern Family Home', price: '₹85 Lakh', description: 'Corner plot, 4 bedrooms, modular kitchen.', image: img('1568605114967-8130f3a36994', 700) },
      { name: 'Penthouse Suite', price: '₹2.4 Cr', description: 'Terrace, city view, premium interiors.', image: img('1600607687939-ce8a6c25118c', 700) },
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

const layoutDesc = {
  classic: 'Light, split-hero layout with clean sections — har business ke liye perfect.',
  bold: 'Full-screen image hero aur bold typography jo turant attention khinche.',
  minimal: 'Simple, spacious aur elegant — content ko bolne do.',
  dark: 'Premium dark theme with glowing accents aur glass cards.',
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
