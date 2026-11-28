// Categories aur unke 3-4 templates. Har template ek "layout" (classic/bold/minimal/dark)
// + category ka content + theme colors hai.
const img = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories = [
  {
    name: 'Restaurant & Cafe', slug: 'restaurant', icon: '🍽️', order: 1,
    description: 'Restaurants, cafes, bakeries aur cloud kitchens ke liye mouth-watering websites.',
    cover: img('1517248135467-4c7edcad34c4', 800),
  },
  {
    name: 'Gym & Fitness', slug: 'fitness', icon: '💪', order: 2,
    description: 'Gyms, yoga studios aur personal trainers ke liye energetic designs.',
    cover: img('1534438327276-14e5300c3a48', 800),
  },
  {
    name: 'Salon & Spa', slug: 'salon', icon: '💇', order: 3,
    description: 'Beauty parlours, salons aur spa ke liye elegant templates.',
    cover: img('1560066984-138dadb4c035', 800),
  },
  {
    name: 'Portfolio & Photography', slug: 'portfolio', icon: '📸', order: 4,
    description: 'Photographers, designers aur freelancers ke liye clean portfolios.',
    cover: img('1452587925148-ce544e77e70d', 800),
  },
  {
    name: 'Business & Agency', slug: 'business', icon: '💼', order: 5,
    description: 'Startups, agencies aur consultants ke liye professional websites.',
    cover: img('1497366216548-37526070297c', 800),
  },
  {
    name: 'Real Estate', slug: 'real-estate', icon: '🏡', order: 6,
    description: 'Property dealers, builders aur agents ke liye premium layouts.',
    cover: img('1600596542815-ffad4c1539a9', 800),
  },
];

const content = {
  restaurant: {
    servicesTitle: 'Our Specialities',
    about: 'Hum fresh ingredients aur traditional recipes se har dish dil se banate hain. Family dinner ho ya friends ke saath party — humare yahan har pal yaadgaar hai.',
    cta: 'Book a Table',
    services: [
      { icon: '🍛', title: 'Signature Dishes', desc: 'Chef ki special recipes jo aapko kahin aur nahi milengi.' },
      { icon: '🥗', title: 'Fresh & Healthy', desc: 'Roz subah aane wali fresh sabziyan aur premium ingredients.' },
      { icon: '🚚', title: 'Home Delivery', desc: 'Garma garam khana 30 minute me aapke ghar tak.' },
      { icon: '🎉', title: 'Party Orders', desc: 'Birthday, kitty party aur corporate events ke liye catering.' },
    ],
  },
  fitness: {
    servicesTitle: 'Programs',
    about: 'Certified trainers, modern equipment aur personalised diet plans ke saath apni fitness journey aaj hi shuru karein.',
    cta: 'Join Now',
    services: [
      { icon: '🏋️', title: 'Strength Training', desc: 'Muscle build karein expert guidance ke saath.' },
      { icon: '🔥', title: 'Fat Loss', desc: 'HIIT aur cardio programs jo results dete hain.' },
      { icon: '🧘', title: 'Yoga & Mobility', desc: 'Flexibility aur mental peace ke liye daily sessions.' },
      { icon: '🥤', title: 'Diet Plans', desc: 'Aapke goal ke hisab se custom nutrition plan.' },
    ],
  },
  salon: {
    servicesTitle: 'Our Services',
    about: 'Experienced stylists aur premium products ke saath hum aapko dete hain ek relaxing aur luxurious experience.',
    cta: 'Book Appointment',
    services: [
      { icon: '✂️', title: 'Hair Styling', desc: 'Haircut, colour, keratin aur smoothening.' },
      { icon: '💅', title: 'Nail Art', desc: 'Manicure, pedicure aur trendy nail extensions.' },
      { icon: '💄', title: 'Bridal Makeup', desc: 'Aapke special din ke liye perfect look.' },
      { icon: '🌿', title: 'Spa & Massage', desc: 'Body massage aur facial therapies.' },
    ],
  },
  portfolio: {
    servicesTitle: 'What I Do',
    about: 'Main kahaniyon ko frames me capture karta hoon. Weddings se lekar brands tak — har project me creativity aur detail par focus.',
    cta: 'Hire Me',
    services: [
      { icon: '💍', title: 'Wedding Shoots', desc: 'Candid aur cinematic wedding photography.' },
      { icon: '📦', title: 'Product Shoots', desc: 'E-commerce aur brand catalogues ke liye.' },
      { icon: '🎬', title: 'Videography', desc: 'Reels, ads aur short films.' },
      { icon: '🎨', title: 'Editing & Retouch', desc: 'Professional colour grading aur retouching.' },
    ],
  },
  business: {
    servicesTitle: 'Our Solutions',
    about: 'Hum businesses ko digital duniya me grow karne me madad karte hain — strategy, technology aur marketing ek hi jagah.',
    cta: 'Get a Quote',
    services: [
      { icon: '📈', title: 'Digital Marketing', desc: 'SEO, social media aur performance ads.' },
      { icon: '💻', title: 'Web Development', desc: 'Fast, modern aur secure websites & apps.' },
      { icon: '🧠', title: 'Consulting', desc: 'Business strategy aur growth planning.' },
      { icon: '🤝', title: '24/7 Support', desc: 'Hamesha aapke saath, jab bhi zarurat ho.' },
    ],
  },
  'real-estate': {
    servicesTitle: 'What We Offer',
    about: 'Sapno ka ghar dhoondhna ab aasaan. Verified properties, transparent deals aur expert guidance — sab ek jagah.',
    cta: 'Schedule a Visit',
    services: [
      { icon: '🏠', title: 'Buy Property', desc: 'Verified flats, villas aur plots.' },
      { icon: '🔑', title: 'Rent & Lease', desc: 'Residential aur commercial rentals.' },
      { icon: '📝', title: 'Legal Help', desc: 'Documentation aur registration support.' },
      { icon: '💰', title: 'Home Loans', desc: 'Best banks se easy loan assistance.' },
    ],
  },
};

const demo = {
  restaurant: { title: 'Spice Garden', tagline: 'Authentic flavours, made with love', image: img('1414235077428-338989a2e8c0') },
  fitness: { title: 'Iron Pulse Gym', tagline: 'Stronger every single day', image: img('1571019613454-1cb2f99b2d8b') },
  salon: { title: 'Glow & Grace', tagline: 'Where beauty meets relaxation', image: img('1522337360788-8b13dee7a37e') },
  portfolio: { title: 'Aarav Lens', tagline: 'Capturing moments that matter', image: img('1502920917128-1aa500764cbd') },
  business: { title: 'NexaWorks', tagline: 'We build brands that grow', image: img('1522071820081-009f0129c71c') },
  'real-estate': { title: 'Prime Estates', tagline: 'Find the home of your dreams', image: img('1600585154340-be6161a56a0c') },
};

const contact = { phone: '+91 98765 43210', email: 'hello@example.com', address: 'MG Road, Ahmedabad, Gujarat' };

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
    description: layoutDesc[layout],
    theme: { primary, accent, font },
    content: content[cat],
    demo: { ...demo[cat], ...contact },
  }))
);
