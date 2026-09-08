import bcrypt from "bcryptjs";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./connection";
import {
  admins,
  categories,
  products,
  productImages,
  settings,
} from "./tables";

const initialCategories = [
  {
    name: "Skincare & Glow",
    slug: "skincare-glow",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
    status: "active",
  },
  {
    name: "Makeup & Beauty",
    slug: "makeup-beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    status: "active",
  },
  {
    name: "Feminine Dresses",
    slug: "feminine-dresses",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
    status: "active",
  },
  {
    name: "Bags & Accessories",
    slug: "bags-accessories",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    status: "active",
  },
  {
    name: "Jewelry & Pearls",
    slug: "jewelry-pearls",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    status: "active",
  },
];

const initialProducts = [
  {
    category_id: 1,
    name: "Rosewater Glow Hydrating Serum",
    slug: "rosewater-glow-hydrating-serum",
    description:
      "Serum pencerah dan pelembap intensif dengan ekstrak kelopak mawar Prancis asli, Niacinamide 5%, dan Hyaluronic Acid 4D. Memberikan efek glass-skin merona natural tanpa rasa lengket.",
    price: 185000,
    discount_price: 149000,
    stock: 24,
    status: true,
    featured: true,
    best_seller: true,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597359-52d3a3f01951?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    category_id: 2,
    name: "Velvet Cloud Lip Tint & Cheek Blush",
    slug: "velvet-cloud-lip-tint-cheek-blush",
    description:
      "Lip & cheek tint multi-fungsi bertekstur mousse lembut dengan aroma berry manis. Tahan hingga 12 jam dengan formula non-drying dan hasil akhir powdery matte yang elegan.",
    price: 129000,
    discount_price: 99000,
    stock: 35,
    status: true,
    featured: true,
    best_seller: true,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    category_id: 3,
    name: "Petal Blossom Puff Sleeve Midi Dress",
    slug: "petal-blossom-puff-sleeve-midi-dress",
    description:
      "Midi dress feminin dengan aksen lengan puff manis dan motif floral lembut. Terbuat dari katun linen premium bernapas dengan tali pita pinggang yang membentuk siluet anggun.",
    price: 349000,
    discount_price: 299000,
    stock: 12,
    status: true,
    featured: true,
    best_seller: false,
    rating: 5.0,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    category_id: 4,
    name: "Chérie Pearl Chain Quilted Crossbody",
    slug: "cherie-pearl-chain-quilted-crossbody",
    description:
      "Tas selempang elegan berbahan vegan leather lembut dengan tekstur quilted premium dan rantai mutiara aesthetic. Sempurna untuk acara santai, date night, maupun formal.",
    price: 289000,
    discount_price: 239000,
    stock: 18,
    status: true,
    featured: false,
    best_seller: true,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    category_id: 5,
    name: "Aurora Freshwater Pearl Necklace & Earring Set",
    slug: "aurora-freshwater-pearl-necklace-earring-set",
    description:
      "Satu set kalung dan anting mutiara air tawar asli dengan lapis emas 18K anti-karat & hypoallergenic. Memancarkan pesona anggun nan mewah yang abadi.",
    price: 215000,
    discount_price: 175000,
    stock: 15,
    status: true,
    featured: true,
    best_seller: false,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    category_id: 1,
    name: "Sakura Whipped Cleansing Souffle Foam",
    slug: "sakura-whipped-cleansing-souffle-foam",
    description:
      "Pembersih wajah berbusa padat dan lembut seperti awan dengan ekstrak bunga sakura Jepang dan Amino Acid. Membersihkan pori-pori secara mendalam tanpa membuat kulit kering tertarik.",
    price: 145000,
    discount_price: 119000,
    stock: 30,
    status: true,
    featured: false,
    best_seller: true,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    category_id: 3,
    name: "Sweet Lavender Tiered Wrap Maxi Dress",
    slug: "sweet-lavender-tiered-wrap-maxi-dress",
    description:
      "Gaun maxi model wrap bernuansa pastel lilac yang flowy dengan aksen bertingkat (tiered) yang memesona. Cocok untuk garden party, liburan pantai, atau pesta kasual.",
    price: 379000,
    discount_price: 329000,
    stock: 8,
    status: true,
    featured: false,
    best_seller: false,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    category_id: 2,
    name: "Starlight Shimmer 9-Color Pastel Eyeshadow Palette",
    slug: "starlight-shimmer-pastel-eyeshadow-palette",
    description:
      "Palet eyeshadow 9 warna pastel kombinasi matte lembut, satin butter, dan glitter berkilau tahan lama. Formula pigmented dan mudah di-blend untuk makeup mata dreamy ala Korea.",
    price: 199000,
    discount_price: 165000,
    stock: 20,
    status: true,
    featured: true,
    best_seller: true,
    rating: 5.0,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
    ],
  },
];

const initialSettings = {
  store_name: "SONIABALISHOP",
  store_tagline: "Fashion, Beauty & Chic Boutique Collection 💕",
  logo_url: "",
  whatsapp: "081234567890",
  email: "order@soniabalishop.com",
  address: "Jl. Sunset Road No. 88, Seminyak, Kuta, Bali",
};

export async function seedDatabase(): Promise<void> {
  const existing = await db.select().from(admins).limit(1);
  if (existing.length > 0) {
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("admin123", salt);
  const now = new Date().toISOString();

  await db.insert(admins).values({
    name: "Owner Chérie",
    email: "admin@cherie.com",
    password: passwordHash,
    created_at: now,
    updated_at: now,
  });

  for (const cat of initialCategories) {
    await db.insert(categories).values({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || "",
      status: cat.status ? true : false,
      created_at: now,
      updated_at: now,
    });
  }

  for (const prod of initialProducts) {
    const [catRow] = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.id, prod.category_id));
    const catName = catRow ? catRow.name : "Umum";
    const createdDate = new Date(
      Date.now() - Math.random() * 7 * 86400000,
    ).toISOString();

    const [productRow] = await db
      .insert(products)
      .values([
        {
          category_id: prod.category_id,
          category_name: catName,
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          discount_price: prod.discount_price,
          stock: prod.stock,
          status: prod.status ,
          featured: prod.featured ? 1 : 0,
          best_seller: prod.best_seller ? 1 : 0,
          rating: prod.rating,
          created_at: createdDate,
          updated_at: now,
        },
      ])
      .returning();

    for (let i = 0; i < prod.images.length; i++) {
      await db.insert(productImages).values({
        product_id: productRow.id,
        image: prod.images[i],
        sort_order: i,
      });
    }
  }

  await db.insert(settings).values({
    id: 1,
    store_name: initialSettings.store_name,
    store_tagline: initialSettings.store_tagline || "",
    logo_url: initialSettings.logo_url || "",
    whatsapp: initialSettings.whatsapp,
    email: initialSettings.email,
    address: initialSettings.address,
  });
}