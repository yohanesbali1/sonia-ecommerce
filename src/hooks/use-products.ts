'use client';
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { getProducts } from '@/services/product.service';

export function useProducts(params?: {
  search?: string;
  category_slug?: string;
  sort?: string;
  featured?: boolean;
  best_seller?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [params?.search, params?.category_slug, params?.sort, params?.featured, params?.best_seller]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
