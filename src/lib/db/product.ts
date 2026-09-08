import { eq, and, or, sql, desc, asc, ilike } from "drizzle-orm";
import { db, schema, ensureSeeded } from "./connection";
import { Product } from "@/types";

function toProduct(
  row: typeof schema.products.$inferSelect,
  images: string[],
): Product {
  return {
    ...row,
    category_name: row.category_name ?? undefined,
    description: row.description ?? "",
    discount_price: row.discount_price ?? undefined,
    status: Boolean(row.status),
    featured: Boolean(row.featured),
    best_seller: Boolean(row.best_seller),
    rating: row.rating ?? undefined,
    images,
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
  };
}

async function getProductImages(productId: number): Promise<string[]> {
  const images = await db
    .select({ image: schema.productImages.image })
    .from(schema.productImages)
    .where(eq(schema.productImages.product_id, productId))
    .orderBy(schema.productImages.sort_order);
  return images.map((i) => i.image);
}

export async function getProducts(params?: {
  search?: string;
  category_id?: number;
  category_slug?: string;
  featured?: boolean;
  best_seller?: boolean;
  sort?: string;
  onlyActive?: boolean;
}): Promise<Product[]> {
  await ensureSeeded();
  const conditions = [];

  if (params?.onlyActive !== false) {
    conditions.push(eq(schema.products.status, true));
  }

  if (params?.search) {
    const q = `%${params.search.toLowerCase().trim()}%`;
    conditions.push(
      or(
        ilike(schema.products.name, q),
        ilike(schema.products.description, q),
        ilike(schema.products.category_name, q),
      )!,
    );
  }

  if (params?.category_id) {
    conditions.push(
      eq(schema.products.category_id, Number(params.category_id)),
    );
  }

  if (params?.category_slug) {
    const [cat] = await db
      .select({ id: schema.categories.id })
      .from(schema.categories)
      .where(eq(schema.categories.slug, params.category_slug));
    if (cat) {
      conditions.push(eq(schema.products.category_id, cat.id));
    }
  }

  if (params?.featured !== undefined) {
    conditions.push(eq(schema.products.featured, params.featured ? 1 : 0));
  }

  if (params?.best_seller !== undefined) {
    conditions.push(
      eq(schema.products.best_seller, params.best_seller ? 1 : 0),
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let orderClause = desc(schema.products.created_at);
  if (params?.sort) {
    switch (params.sort) {
      case "price_asc":
        orderClause = asc(
          sql`COALESCE(NULLIF(${schema.products.discount_price}, 0), ${schema.products.price})`,
        );
        break;
      case "price_desc":
        orderClause = desc(
          sql`COALESCE(NULLIF(${schema.products.discount_price}, 0), ${schema.products.price})`,
        );
        break;
      case "popular":
        orderClause = desc(sql`COALESCE(${schema.products.rating}, 0)`);
        break;
      case "newest":
        orderClause = desc(schema.products.created_at);
        break;
    }
  }

  const rows = await db
    .select()
    .from(schema.products)
    .where(where)
    .orderBy(orderClause);

  const products: Product[] = [];
  for (const row of rows) {
    const images = await getProductImages(row.id);
    products.push(toProduct(row, images));
  }
  return products;
}

export async function getProductBySlugOrId(
  identifier: string | number,
): Promise<Product | undefined> {
  const value = String(identifier);

  const isNumber = /^\d+$/.test(value);

  const condition = isNumber
    ? eq(schema.products.id, Number(value))
    : eq(schema.products.slug, value);
  const [row] = await db
    .select()
    .from(schema.products)
    .where(or(eq(schema.products.slug, String(identifier)), condition));
  if (!row) return undefined;
  const images = await getProductImages(row.id);
  return toProduct(row, images);
}

export async function createProduct(
  input: Omit<Product, "id" | "created_at" | "updated_at">,
): Promise<Product> {
  const now = new Date().toISOString();
  const [catRow] = await db
    .select({ name: schema.categories.name })
    .from(schema.categories)
    .where(eq(schema.categories.id, input.category_id));
  const catName = catRow ? catRow.name : "Umum";

  const [row] = await db
    .insert(schema.products)
    .values({
      category_id: input.category_id,
      category_name: catName,
      name: input.name,
      slug: input.slug,
      description: input.description || "",
      price: input.price,
      discount_price: input.discount_price || 0,
      stock: input.stock,
      status: input.status,
      featured: input.featured ? 1 : 0,
      best_seller: input.best_seller ? 1 : 0,
      rating: input.rating || 0,
      created_at: now,
      updated_at: now,
    })
    .returning();

  if (input.images && input.images.length > 0) {
    for (let i = 0; i < input.images.length; i++) {
      await db.insert(schema.productImages).values({
        product_id: row.id,
        image: input.images[i],
        sort_order: i,
      });
    }
  }

  const created = await getProductBySlugOrId(row.id);
  return created!;
}

export async function updateProduct(
  id: number,
  updates: Partial<Product>,
): Promise<Product | undefined> {
  const [existing] = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, id));
  if (!existing) return undefined;

  let catName = existing.category_name;
  if (updates.category_id) {
    const [catRow] = await db
      .select({ name: schema.categories.name })
      .from(schema.categories)
      .where(eq(schema.categories.id, updates.category_id));
    if (catRow) catName = catRow.name;
  }

  const now = new Date().toISOString();
  await db
    .update(schema.products)
    .set({
      category_id: updates.category_id ?? existing.category_id,
      category_name: catName,
      name: updates.name ?? existing.name,
      slug: updates.slug ?? existing.slug,
      description: updates.description ?? existing.description,
      price: updates.price ?? existing.price,
      discount_price: updates.discount_price ?? existing.discount_price,
      stock: updates.stock ?? existing.stock,
      status: updates.status ?? existing.status,
      featured:
        updates.featured !== undefined
          ? updates.featured
            ? 1
            : 0
          : existing.featured,
      best_seller:
        updates.best_seller !== undefined
          ? updates.best_seller
            ? 1
            : 0
          : existing.best_seller,
      rating: updates.rating ?? existing.rating,
      updated_at: now,
    })
    .where(eq(schema.products.id, id));

  if (updates.images) {
    await db
      .delete(schema.productImages)
      .where(eq(schema.productImages.product_id, id));
    for (let i = 0; i < updates.images.length; i++) {
      await db.insert(schema.productImages).values({
        product_id: id,
        image: updates.images[i],
        sort_order: i,
      });
    }
  }

  return getProductBySlugOrId(id);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await db
    .delete(schema.products)
    .where(eq(schema.products.id, id))
    .execute();
  return Boolean(result);
}
