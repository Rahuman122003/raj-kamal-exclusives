
-- Products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL,
  original_price numeric,
  category text NOT NULL DEFAULT 'men',
  images text[] NOT NULL DEFAULT '{}',
  colors text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  in_stock boolean NOT NULL DEFAULT true,
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_fast_selling boolean NOT NULL DEFAULT false,
  rating numeric NOT NULL DEFAULT 4.0,
  reviews integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Banners table
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '/shop',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Coupons table
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount numeric NOT NULL DEFAULT 10,
  expires_at text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  items jsonb NOT NULL DEFAULT '[]',
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  customer_name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  payment_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products: public read
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Categories: public read
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Banners: public read
CREATE POLICY "Anyone can read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage banners" ON public.banners FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Coupons: public read
CREATE POLICY "Anyone can read active coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage coupons" ON public.coupons FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update orders" ON public.orders FOR UPDATE TO authenticated USING (true);

-- Profiles: allow authenticated to read all profiles (for admin user list)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Authenticated can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categories
INSERT INTO public.categories (name, slug, image) VALUES
  ('Men', 'men', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'),
  ('Women', 'women', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop'),
  ('Teens', 'teens', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop'),
  ('Kids', 'kids', 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop'),
  ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop');

-- Seed banners
INSERT INTO public.banners (title, subtitle, image, link) VALUES
  ('Grand Summer Sale', 'Up to 50% off on all collections', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop', '/shop'),
  ('New Arrivals', 'Discover the latest trends in ethnic wear', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=400&fit=crop', '/shop?filter=new');

-- Seed coupons
INSERT INTO public.coupons (code, discount, expires_at, is_active) VALUES
  ('WELCOME20', 20, '2025-12-31', true),
  ('FESTIVE15', 15, '2025-06-30', true);

-- Seed products
INSERT INTO public.products (name, description, price, original_price, category, images, colors, sizes, in_stock, is_new_arrival, is_fast_selling, rating, reviews) VALUES
  ('Royal Silk Saree', 'Handwoven pure silk saree with intricate golden zari work.', 4999, 7999, 'women', ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'], ARRAY['Red','Gold','Maroon'], ARRAY['Free Size'], true, true, false, 4.8, 124),
  ('Premium Cotton Kurta', 'Breathable cotton kurta with elegant embroidery.', 1299, 1999, 'men', ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'], ARRAY['White','Blue','Beige'], ARRAY['S','M','L','XL','XXL'], true, false, true, 4.5, 89),
  ('Designer Lehenga Set', 'Stunning designer lehenga with heavy embroidery and dupatta.', 8999, 14999, 'women', ARRAY['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop'], ARRAY['Pink','Red','Blue'], ARRAY['S','M','L','XL'], true, true, false, 4.9, 56),
  ('Linen Casual Shirt', 'Premium linen shirt for a smart casual look.', 899, 1499, 'men', ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop'], ARRAY['White','Sky Blue','Olive'], ARRAY['S','M','L','XL'], true, false, false, 4.3, 67),
  ('Embroidered Anarkali', 'Floor-length anarkali suit with mirror work.', 3499, 5499, 'women', ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'], ARRAY['Teal','Maroon','Navy'], ARRAY['S','M','L','XL'], true, false, true, 4.7, 93),
  ('Kids Party Dress', 'Adorable party dress for little ones.', 799, 1299, 'kids', ARRAY['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop'], ARRAY['Pink','White','Lavender'], ARRAY['2-3Y','4-5Y','6-7Y','8-9Y'], true, true, false, 4.6, 45),
  ('Silk Dupatta', 'Pure silk dupatta with hand-printed block patterns.', 599, 999, 'accessories', ARRAY['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop'], ARRAY['Red','Yellow','Green'], ARRAY['Free Size'], true, false, false, 4.4, 78),
  ('Teen Denim Jacket', 'Trendy denim jacket with patches.', 1599, 2499, 'teens', ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop'], ARRAY['Blue','Black'], ARRAY['S','M','L'], true, false, true, 4.2, 34),
  ('Banarasi Silk Saree', 'Traditional Banarasi silk with gold and silver threadwork.', 6999, 11999, 'women', ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'], ARRAY['Purple','Green','Red'], ARRAY['Free Size'], true, false, false, 4.9, 201),
  ('Ethnic Sherwani', 'Regal sherwani with intricate embroidery.', 5999, 9999, 'men', ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'], ARRAY['Ivory','Gold','Maroon'], ARRAY['S','M','L','XL','XXL'], true, true, false, 4.8, 67),
  ('Cotton Palazzo Set', 'Comfortable cotton palazzo set with printed top.', 999, 1599, 'women', ARRAY['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop'], ARRAY['Yellow','Blue','Green'], ARRAY['S','M','L','XL'], true, false, false, 4.3, 112),
  ('Handloom Stole', 'Artisan-crafted handloom stole with traditional motifs.', 449, 799, 'accessories', ARRAY['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop'], ARRAY['Mustard','Indigo','Coral'], ARRAY['Free Size'], true, false, false, 4.5, 56);
