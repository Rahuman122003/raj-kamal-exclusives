import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  in_stock: boolean;
  is_new_arrival: boolean;
  is_fast_selling: boolean;
  rating: number;
  reviews: number;
  created_at: string;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface DbBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export interface DbCoupon {
  id: string;
  code: string;
  discount: number;
  expires_at: string;
  is_active: boolean;
}

export interface DbOrder {
  id: string;
  order_id: string;
  user_id: string | null;
  items: any;
  total: number;
  status: string;
  customer_name: string;
  address: string;
  phone: string;
  email: string;
  payment_id: string | null;
  created_at: string;
}

function useSupabaseTable<T>(table: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && rows) setData(rows as T[]);
    setLoading(false);
  }, [table]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refetch: fetch, setData };
}

export const useProducts = () => useSupabaseTable<DbProduct>('products');
export const useCategories = () => useSupabaseTable<DbCategory>('categories');
export const useBanners = () => useSupabaseTable<DbBanner>('banners');
export const useCoupons = () => useSupabaseTable<DbCoupon>('coupons');
export const useOrders = () => useSupabaseTable<DbOrder>('orders');

export const useProfiles = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && rows) setData(rows);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
};
