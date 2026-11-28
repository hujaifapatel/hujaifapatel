// ===================================================================
//  PRODUCT WALI DUKANO (SHOPS) KI CATEGORIES
//  Har category ke 3-4 templates hain. User Products step me apne
//  products (image, naam, price, description) khud add karta hai.
//  Nayi shop category add karni ho to bas yahan ek entry jodein.
// ===================================================================
const img = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const p = (name, price, description, id) => ({ name, price, description, image: img(id, 700) });

export const shopCategories = [
  { name: 'Fashion & Clothing', slug: 'fashion', icon: '👗', description: 'Clothing stores, boutiques aur garment shops ke liye stylish websites.', cover: img('1441986300917-64674bd600d8', 800) },
  { name: 'Grocery & Supermarket', slug: 'grocery', icon: '🛒', description: 'Kirana stores, supermarkets aur fruit-vegetable shops ke liye.', cover: img('1542838132-92c53300491e', 800) },
  { name: 'Jewellery Store', slug: 'jewellery', icon: '💍', description: 'Gold, silver aur diamond jewellers ke liye premium designs.', cover: img('1515562141207-7a88fb7ce338', 800) },
  { name: 'Furniture & Home Decor', slug: 'furniture', icon: '🛋️', description: 'Furniture showrooms aur home decor stores ke liye.', cover: img('1555041469-a586c61ea9bc', 800) },
  { name: 'Bakery & Sweet Shop', slug: 'bakery', icon: '🎂', description: 'Bakeries, cake shops aur mithai ki dukano ke liye.', cover: img('1509440159596-0249088772ff', 800) },
  { name: 'Cosmetics & Beauty Products', slug: 'cosmetics', icon: '💄', description: 'Cosmetics, skincare aur beauty product stores ke liye.', cover: img('1522335789203-aabd1fc54bc9', 800) },
];

export const shopContent = {
  fashion: {
    productsLabel: 'Collection', productsIntro: 'Latest trends — men, women aur kids ke liye.', cta: 'Visit Store',
    features: [
      { icon: '✨', title: 'Latest Trends', desc: 'Har hafte nayi arrivals.' },
      { icon: '🧵', title: 'Premium Fabric', desc: 'Comfortable aur long-lasting quality.' },
      { icon: '🔁', title: 'Easy Exchange', desc: '7 din me size exchange.' },
      { icon: '🏷️', title: 'Best Prices', desc: 'Seasonal sale aur offers.' },
    ],
  },
  grocery: {
    productsLabel: 'Products', productsIntro: 'Roz ki zaroorat ka saaman — fresh aur sahi daam par.', cta: 'Order on Call',
    features: [
      { icon: '🥬', title: 'Farm Fresh', desc: 'Roz subah fresh fruits aur sabziyan.' },
      { icon: '🚚', title: 'Home Delivery', desc: 'Free delivery ₹499 se upar.' },
      { icon: '💰', title: 'Best Prices', desc: 'MRP se kam daam, har din.' },
      { icon: '📞', title: 'Order on WhatsApp', desc: 'List bhejiye, saaman ghar par.' },
    ],
  },
  jewellery: {
    productsLabel: 'Collection', productsIntro: 'Hallmarked gold, silver aur certified diamonds.', cta: 'Book a Visit',
    features: [
      { icon: '🏅', title: 'BIS Hallmarked', desc: '100% pure aur certified gold.' },
      { icon: '💎', title: 'Certified Diamonds', desc: 'IGI / GIA certificate ke saath.' },
      { icon: '🔄', title: 'Lifetime Exchange', desc: 'Purane gehne par best rate.' },
      { icon: '🎨', title: 'Custom Designs', desc: 'Apni pasand ka design banwaiye.' },
    ],
  },
  furniture: {
    productsLabel: 'Products', productsIntro: 'Ghar ko sajaiye — sofa, bed, dining aur decor.', cta: 'Visit Showroom',
    features: [
      { icon: '🪵', title: 'Solid Wood', desc: 'Sheesham aur teak wood furniture.' },
      { icon: '🚚', title: 'Free Delivery', desc: 'City me free delivery & installation.' },
      { icon: '📐', title: 'Custom Size', desc: 'Aapke ghar ke naap se furniture.' },
      { icon: '🛡️', title: '5 Year Warranty', desc: 'Har product par warranty.' },
    ],
  },
  bakery: {
    productsLabel: 'Menu', productsIntro: 'Roz fresh bane cakes, pastries aur mithai.', cta: 'Order Now',
    features: [
      { icon: '🥐', title: 'Baked Fresh Daily', desc: 'Har cheez roz subah taaza.' },
      { icon: '🎂', title: 'Custom Cakes', desc: 'Birthday aur wedding ke liye.' },
      { icon: '🌱', title: 'Eggless Options', desc: '100% eggless cakes available.' },
      { icon: '🚚', title: 'Home Delivery', desc: 'Same day delivery.' },
    ],
  },
  cosmetics: {
    productsLabel: 'Products', productsIntro: 'Original makeup, skincare aur haircare products.', cta: 'Shop Now',
    features: [
      { icon: '✅', title: '100% Genuine', desc: 'Sirf authorised brands.' },
      { icon: '🌿', title: 'Skin Safe', desc: 'Dermatologically tested products.' },
      { icon: '🎁', title: 'Gift Packs', desc: 'Festive aur wedding gift hampers.' },
      { icon: '💬', title: 'Beauty Advice', desc: 'Free skin consultation.' },
    ],
  },
};

export const shopDemo = {
  fashion: {
    title: 'Trendz Boutique', tagline: 'Style that speaks for you',
    description: 'Trendz Boutique me milega latest fashion — ethnic se western tak. Premium fabric, perfect fitting aur sabse achhe daam. Aaj hi visit kariye!',
    images: ['1441986300917-64674bd600d8', '1490481651871-ab68de25d43d', '1445205170230-053b83016050', '1483985988355-763728e1935b'].map((i) => img(i)),
    products: [
      p('Classic White T-Shirt', '₹499', '100% cotton, regular fit. S to XXL.', '1521572163474-6864f9cf17ab'),
      p('Slim Fit Denim Jeans', '₹1,299', 'Stretchable denim, dark blue wash.', '1542272604-787c3835535d'),
      p('Summer Floral Dress', '₹1,799', 'Lightweight rayon, ankle length.', '1595777457583-95e059d581b8'),
      p('Winter Jacket', '₹2,499', 'Water-resistant, warm lining.', '1591047139829-d91aecb6caea'),
    ],
  },
  grocery: {
    title: 'Fresh Mart', tagline: 'Ghar ki har zaroorat, ek jagah',
    description: 'Fresh Mart aapka apna neighbourhood supermarket hai. Fresh fruits, sabziyan, dairy aur roz ka saaman — sahi daam par, ghar tak delivery ke saath.',
    images: ['1542838132-92c53300491e', '1534723452862-4c874018d66d', '1488459716781-31db52582fe9', '1506617564039-2f3b650b7010'].map((i) => img(i)),
    products: [
      p('Fresh Vegetables Combo', '₹199', 'Aalu, pyaaz, tamatar, mirch — 4 kg.', '1488459716781-31db52582fe9'),
      p('Basmati Rice (5 kg)', '₹649', 'Long grain premium basmati.', '1586201375761-83865001e31c'),
      p('Cold Pressed Oil (1 L)', '₹299', 'Groundnut oil, chemical free.', '1474979266404-7eaacbcd87c5'),
      p('Farm Fresh Milk (1 L)', '₹68', 'Roz subah ghar par delivery.', '1563636619-e9143da7973b'),
    ],
  },
  jewellery: {
    title: 'Shree Jewellers', tagline: 'Purity you can trust since 1985',
    description: 'Shree Jewellers teen peedhiyon se shuddh sone aur chandi ke gehne bana rahe hain. Hallmarked gold, certified diamonds aur traditional se modern designs — har mauke ke liye.',
    images: ['1515562141207-7a88fb7ce338', '1599643478518-a784e5dc4c8f', '1605100804763-247f67b3557e', '1535632066927-ab7c9ab60908'].map((i) => img(i)),
    products: [
      p('Gold Necklace Set', '₹1,85,000', '22K hallmarked, 32 grams.', '1599643478518-a784e5dc4c8f'),
      p('Diamond Ring', '₹45,999', '18K gold, 0.30 ct certified diamond.', '1605100804763-247f67b3557e'),
      p('Pearl Earrings', '₹12,499', 'Freshwater pearls, gold plated.', '1535632066927-ab7c9ab60908'),
      p('Silver Bracelet', '₹3,999', '925 sterling silver.', '1515562141207-7a88fb7ce338'),
    ],
  },
  furniture: {
    title: 'Royal Furniture', tagline: 'Comfort that lasts generations',
    description: 'Royal Furniture me solid wood furniture aur modern home decor ki badi range hai. Aapke ghar ke naap se custom furniture bhi banate hain.',
    images: ['1586023492125-27b2c045efd7', '1555041469-a586c61ea9bc', '1524758631624-e2822e304c36', '1505693416388-ac5ce068fe85'].map((i) => img(i)),
    products: [
      p('3 Seater Fabric Sofa', '₹32,999', 'Solid wood frame, premium fabric.', '1555041469-a586c61ea9bc'),
      p('King Size Bed', '₹45,999', 'Sheesham wood, with storage.', '1505693416388-ac5ce068fe85'),
      p('Accent Chair', '₹8,499', 'Velvet finish, wooden legs.', '1567538096630-e0c55bd6374c'),
      p('Living Room Set', '₹74,999', 'Sofa, center table aur TV unit.', '1586023492125-27b2c045efd7'),
    ],
  },
  bakery: {
    title: 'Sweet Crust Bakery', tagline: 'Freshly baked happiness',
    description: 'Sweet Crust Bakery me roz fresh bread, cakes, pastries aur cookies bante hain. Birthday ho ya shaadi — custom cakes ke liye humein yaad kijiye.',
    images: ['1509440159596-0249088772ff', '1517433670267-08bbd4be890f', '1555507036-ab1f4038808a', '1486427944299-d1955d23e34d'].map((i) => img(i)),
    products: [
      p('Chocolate Truffle Cake', '₹650 / kg', 'Rich dark chocolate, eggless available.', '1578985545062-69928b1d9587'),
      p('Butter Croissant', '₹80', 'Flaky, buttery, baked fresh.', '1555507036-ab1f4038808a'),
      p('Cupcakes (6 pcs)', '₹299', 'Vanilla, chocolate aur red velvet.', '1486427944299-d1955d23e34d'),
      p('Whole Wheat Bread', '₹55', 'Healthy, no preservatives.', '1509440159596-0249088772ff'),
    ],
  },
  cosmetics: {
    title: 'Glow Beauty Store', tagline: 'Your beauty, our passion',
    description: 'Glow Beauty Store me top brands ke original makeup, skincare aur haircare products milte hain. Free skin consultation ke saath sahi product chuniye.',
    images: ['1596462502278-27bfdc403348', '1522335789203-aabd1fc54bc9', '1571781926291-c477ebfd024b', '1556228578-8c89e6adf883'].map((i) => img(i)),
    products: [
      p('Matte Lipstick', '₹599', 'Long lasting, 12 shades.', '1586495777744-4413f21062fa'),
      p('Vitamin C Serum', '₹899', 'Brightening, 30 ml.', '1571781926291-c477ebfd024b'),
      p('Makeup Kit', '₹2,499', 'Foundation, kajal, blush aur brushes.', '1522335789203-aabd1fc54bc9'),
      p('Skincare Combo', '₹1,499', 'Face wash, toner aur moisturiser.', '1556228578-8c89e6adf883'),
    ],
  },
};

// [slug, name, layout, primary, accent, font, featured, tags]
export const shopPlan = {
  fashion: [
    ['vogue', 'Vogue', 'minimal', '#be185d', '#1f1f1f', 'Playfair Display', true, ['fashion', 'elegant']],
    ['street-style', 'Street Style', 'bold', '#eab308', '#0a0a0a', 'Oswald', false, ['bold', 'youth']],
    ['boutique-classic', 'Boutique', 'classic', '#9333ea', '#1e1b4b', 'Poppins', false, ['light', 'boutique']],
    ['runway', 'Runway', 'dark', '#f472b6', '#09090b', 'Playfair Display', false, ['dark', 'luxury']],
  ],
  grocery: [
    ['fresh-basket', 'Fresh Basket', 'classic', '#16a34a', '#14532d', 'Poppins', true, ['fresh', 'green']],
    ['daily-needs', 'Daily Needs', 'bold', '#f97316', '#1c1917', 'Poppins', false, ['bold', 'offers']],
    ['organic', 'Organic', 'minimal', '#4d7c0f', '#1a2e05', 'Lora', false, ['organic', 'clean']],
  ],
  jewellery: [
    ['golden-aura', 'Golden Aura', 'dark', '#d4af37', '#0c0a09', 'Playfair Display', true, ['gold', 'luxury', 'dark']],
    ['heritage', 'Heritage', 'classic', '#b45309', '#3b1d0a', 'Playfair Display', false, ['traditional', 'warm']],
    ['solitaire', 'Solitaire', 'minimal', '#78716c', '#1c1917', 'Lora', false, ['diamond', 'clean']],
  ],
  furniture: [
    ['woodcraft', 'Woodcraft', 'classic', '#a16207', '#292524', 'Poppins', true, ['wood', 'warm']],
    ['nordic', 'Nordic', 'minimal', '#334155', '#0f172a', 'Inter', false, ['modern', 'clean']],
    ['living-bold', 'Living', 'bold', '#0d9488', '#042f2e', 'Poppins', false, ['bold', 'showroom']],
    ['luxe-interiors', 'Luxe Interiors', 'dark', '#c2a878', '#0c0a09', 'Playfair Display', false, ['luxury', 'dark']],
  ],
  bakery: [
    ['sugar-rush', 'Sugar Rush', 'classic', '#db2777', '#4a044e', 'Poppins', true, ['cakes', 'pink']],
    ['artisan-bread', 'Artisan', 'minimal', '#92400e', '#292524', 'Lora', false, ['bread', 'rustic']],
    ['choco-dark', 'Choco', 'dark', '#f59e0b', '#1c0f0a', 'Playfair Display', false, ['chocolate', 'dark']],
  ],
  cosmetics: [
    ['glow-up', 'Glow Up', 'classic', '#e11d48', '#4c0519', 'Poppins', true, ['beauty', 'pink']],
    ['pure-skin', 'Pure Skin', 'minimal', '#0f766e', '#134e4a', 'Inter', false, ['skincare', 'clean']],
    ['glamour', 'Glamour', 'bold', '#c026d3', '#1e0a24', 'Poppins', false, ['makeup', 'bold']],
  ],
};
