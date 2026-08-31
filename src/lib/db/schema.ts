import { Category, StoreSettings } from '@/types';

export const CATEGORIES_SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT,
    status BOOLEAN NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const ADMINS_SQL = `
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const PRODUCTS_SQL = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    category_name TEXT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    price INTEGER NOT NULL DEFAULT 0,
    discount_price INTEGER DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    status BOOLEAN NOT NULL DEFAULT 1,
    featured INTEGER NOT NULL DEFAULT 0,
    best_seller INTEGER NOT NULL DEFAULT 0,
    rating REAL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
`;

export const PRODUCT_IMAGES_SQL = `
  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`;

export const ORDERS_SQL = `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    notes TEXT DEFAULT '',
    subtotal INTEGER NOT NULL DEFAULT 0,
    shipping_cost INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    order_status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    rejection_reason TEXT,
    tracking_number TEXT,
    courier TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const ORDER_ITEMS_SQL = `
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT DEFAULT '',
    price INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`;

export const PAYMENTS_SQL = `
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    method TEXT NOT NULL DEFAULT 'Bank Transfer',
    amount INTEGER NOT NULL DEFAULT 0,
    proof_image TEXT,
    paid_at TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    approved_at TEXT,
    rejected_at TEXT,
    rejection_reason TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`;

export const SETTINGS_SQL = `
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    store_name TEXT NOT NULL DEFAULT '',
    store_tagline TEXT DEFAULT '',
    logo_url TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    email TEXT DEFAULT '',
    address TEXT DEFAULT ''
  );
`;

export const CREATE_TABLES_SQL = [
  ADMINS_SQL,
  CATEGORIES_SQL,
  PRODUCTS_SQL,
  PRODUCT_IMAGES_SQL,
  ORDERS_SQL,
  ORDER_ITEMS_SQL,
  PAYMENTS_SQL,
  SETTINGS_SQL,
].join('\n');

export const initialCategories: Omit<Category, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Skincare & Glow',
    slug: 'skincare-glow',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
    status: true,
  },
  {
    name: 'Makeup & Beauty',
    slug: 'makeup-beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    status: true,
  },
  {
    name: 'Feminine Dresses',
    slug: 'feminine-dresses',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80',
    status: true,
  },
  {
    name: 'Bags & Accessories',
    slug: 'bags-accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    status: true,
  },
  {
    name: 'Jewelry & Pearls',
    slug: 'jewelry-pearls',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    status: true,
  }
];

export interface SeedProduct {
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number;
  stock: number;
  status: boolean;
  featured: boolean;
  best_seller: boolean;
  rating: number;
  images: string[];
}

export const initialProducts: SeedProduct[] = [
  {
    category_id: 1,
    name: 'Rosewater Glow Hydrating Serum',
    slug: 'rosewater-glow-hydrating-serum',
    description: 'Serum pencerah dan pelembap intensif dengan ekstrak kelopak mawar Prancis asli, Niacinamide 5%, dan Hyaluronic Acid 4D. Memberikan efek glass-skin merona natural tanpa rasa lengket.',
    price: 185000,
    discount_price: 149000,
    stock: 24,
    status: true,
    featured: true,
    best_seller: true,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-52d3a3f01951?w=800&auto=format&fit=crop&q=80'
    ],
  },
  {
    category_id: 2,
    name: 'Velvet Cloud Lip Tint & Cheek Blush',
    slug: 'velvet-cloud-lip-tint-cheek-blush',
    description: 'Lip & cheek tint multi-fungsi bertekstur mousse lembut dengan aroma berry manis. Tahan hingga 12 jam dengan formula non-drying dan hasil akhir powdery matte yang elegan.',
    price: 129000,
    discount_price: 99000,
    stock: 35,
    status: true,
    featured: true,
    best_seller: true,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80'
    ],
  },
  {
    category_id: 3,
    name: 'Petal Blossom Puff Sleeve Midi Dress',
    slug: 'petal-blossom-puff-sleeve-midi-dress',
    description: 'Midi dress feminin dengan aksen lengan puff manis dan motif floral lembut. Terbuat dari katun linen premium bernapas dengan tali pita pinggang yang membentuk siluet anggun.',
    price: 349000,
    discount_price: 299000,
    stock: 12,
    status:true,
    featured: true,
    best_seller: false,
    rating: 5.0,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80'
    ],
  },
  {
    category_id: 4,
    name: 'Chérie Pearl Chain Quilted Crossbody',
    slug: 'cherie-pearl-chain-quilted-crossbody',
    description: 'Tas selempang elegan berbahan vegan leather lembut dengan tekstur quilted premium dan rantai mutiara aesthetic. Sempurna untuk acara santai, date night, maupun formal.',
    price: 289000,
    discount_price: 239000,
    stock: 18,
    status: true,
    featured: false,
    best_seller: true,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
  },
  {
    category_id: 5,
    name: 'Aurora Freshwater Pearl Necklace & Earring Set',
    slug: 'aurora-freshwater-pearl-necklace-earring-set',
    description: 'Satu set kalung dan anting mutiara air tawar asli dengan lapis emas 18K anti-karat & hypoallergenic. Memancarkan pesona anggun nan mewah yang abadi.',
    price: 215000,
    discount_price: 175000,
    stock: 15,
    status: true,
    featured: true,
    best_seller: false,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
  },
  {
    category_id: 1,
    name: 'Sakura Whipped Cleansing Souffle Foam',
    slug: 'sakura-whipped-cleansing-souffle-foam',
    description: 'Pembersih wajah berbusa padat dan lembut seperti awan dengan ekstrak bunga sakura Jepang dan Amino Acid. Membersihkan pori-pori secara mendalam tanpa membuat kulit kering tertarik.',
    price: 145000,
    discount_price: 119000,
    stock: 30,
    status: true,
    featured: false,
    best_seller: true,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
  },
  {
    category_id: 3,
    name: 'Sweet Lavender Tiered Wrap Maxi Dress',
    slug: 'sweet-lavender-tiered-wrap-maxi-dress',
    description: 'Gaun maxi model wrap bernuansa pastel lilac yang flowy dengan aksen bertingkat (tiered) yang memesona. Cocok untuk garden party, liburan pantai, atau pesta kasual.',
    price: 379000,
    discount_price: 329000,
    stock: 8,
    status: true,
    featured: false,
    best_seller: false,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80'
    ],
  },
  {
    category_id: 2,
    name: 'Starlight Shimmer 9-Color Pastel Eyeshadow Palette',
    slug: 'starlight-shimmer-pastel-eyeshadow-palette',
    description: 'Palet eyeshadow 9 warna pastel kombinasi matte lembut, satin butter, dan glitter berkilau tahan lama. Formula pigmented dan mudah di-blend untuk makeup mata dreamy ala Korea.',
    price: 199000,
    discount_price: 165000,
    stock: 20,
    status: true,
    featured: true,
    best_seller: true,
    rating: 5.0,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80'
    ],
  }
];

export const initialSettings: StoreSettings = {
  store_name: 'SONIABALISHOP',
  store_tagline: 'Fashion, Beauty & Chic Boutique Collection 💕',
  logo_url: '',
  whatsapp: '081234567890',
  email: 'order@soniabalishop.com',
  address: 'Jl. Sunset Road No. 88, Seminyak, Kuta, Bali',
};
