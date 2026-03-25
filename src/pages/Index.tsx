import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts, useCategories, useCoupons, useBanners } from '@/hooks/useSupabaseData';
import ProductCard from '@/components/ProductCard';

const Index = () => {
  const { data: products, loading: pLoading } = useProducts();
  const { data: categories } = useCategories();
  const { data: coupons } = useCoupons();
  const { data: banners } = useBanners();

  const newArrivals = products.filter(p => p.is_new_arrival).slice(0, 4);
  const fastSelling = products.filter(p => p.is_fast_selling).slice(0, 4);
  const accessories = products.filter(p => p.category === 'accessories').slice(0, 4);
  const activeCoupon = coupons.find(c => c.is_active);

  // Map DB product to Product shape for ProductCard
  const mapProduct = (p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    category: p.category,
    images: p.images || [],
    colors: p.colors || [],
    sizes: p.sizes || [],
    inStock: p.in_stock,
    isNewArrival: p.is_new_arrival,
    isFastSelling: p.is_fast_selling,
    rating: Number(p.rating),
    reviews: p.reviews,
    createdAt: p.created_at,
  });

  return (
    <div>
      {activeCoupon && (
        <div className="gradient-gold text-center py-2 px-4">
          <p className="text-sm font-semibold text-secondary-foreground">
            🎉 Use code <span className="font-bold">{activeCoupon.code}</span> for {activeCoupon.discount}% off!
          </p>
        </div>
      )}

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Premium Textile Collection</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
                Style That<br />
                <span className="text-gradient-gold" style={{ WebkitTextFillColor: 'transparent', backgroundImage: 'var(--gradient-gold)' }}>Defines You</span>
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-md leading-relaxed">
                Discover handcrafted textiles and ethnic wear that blend tradition with contemporary style.
              </p>
              <div className="flex gap-3 mt-8">
                <Link to="/shop" className="inline-flex items-center gap-2 gradient-gold text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-gold">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
                  Our Story
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden md:block">
              <div className="rounded-2xl overflow-hidden shadow-gold">
                <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop" alt="Textile Collection" className="w-full h-[500px] object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-lg shadow-warm">
                <p className="text-xs text-muted-foreground">Trusted by</p>
                <p className="font-display font-bold text-2xl text-foreground">10,000+</p>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-6">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: Shield, title: 'Quality Assured', desc: '100% authentic products' },
            { icon: Sparkles, title: 'Easy Returns', desc: '7-day return policy' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 justify-center">
              <Icon className="w-6 h-6 text-secondary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banners */}
      {banners.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-4">
            {banners.map(banner => (
              <Link key={banner.id} to={banner.link} className="relative rounded-xl overflow-hidden group aspect-[3/1]">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-chocolate/80 to-transparent flex items-center p-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-primary-foreground">{banner.title}</h3>
                    <p className="text-sm text-primary-foreground/80">{banner.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group text-center">
                <div className="aspect-square rounded-full overflow-hidden mx-auto w-28 h-28 md:w-36 md:h-36 border-4 border-border group-hover:border-secondary transition-colors shadow-warm">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <p className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">New Arrivals</h2>
            <Link to="/shop?filter=new" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{newArrivals.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}</div>
        </section>
      )}

      {/* Fast Selling */}
      {fastSelling.length > 0 && (
        <section className="bg-muted py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">🔥 Fast Selling</h2>
              <Link to="/shop?filter=fast" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{fastSelling.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}</div>
          </div>
        </section>
      )}

      {/* Accessories */}
      {accessories.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Accessories</h2>
            <Link to="/shop?category=accessories" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{accessories.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}</div>
        </section>
      )}
    </div>
  );
};

export default Index;
