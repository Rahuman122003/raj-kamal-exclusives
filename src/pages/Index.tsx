import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Sparkles, Star, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts, useCategories, useCoupons, useBanners } from '@/hooks/useSupabaseData';
import ProductCard from '@/components/ProductCard';
import logo from '@/assets/logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const } }),
};

const Index = () => {
  const { data: products, loading: pLoading } = useProducts();
  const { data: categories } = useCategories();
  const { data: coupons } = useCoupons();
  const { data: banners } = useBanners();

  const newArrivals = products.filter(p => p.is_new_arrival).slice(0, 4);
  const fastSelling = products.filter(p => p.is_fast_selling).slice(0, 4);
  const accessories = products.filter(p => p.category === 'accessories').slice(0, 4);
  const activeCoupon = coupons.find(c => c.is_active);

  const mapProduct = (p: any) => ({
    id: p.id, name: p.name, description: p.description,
    price: Number(p.price), originalPrice: p.original_price ? Number(p.original_price) : undefined,
    category: p.category, images: p.images || [], colors: p.colors || [],
    sizes: p.sizes || [], inStock: p.in_stock, isNewArrival: p.is_new_arrival,
    isFastSelling: p.is_fast_selling, rating: Number(p.rating), reviews: p.reviews,
    createdAt: p.created_at,
  });

  return (
    <div>
      {activeCoupon && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="gradient-gold text-center py-2.5 px-4"
        >
          <p className="text-sm font-semibold text-secondary-foreground">
            🎉 Use code <span className="font-bold bg-secondary-foreground/10 px-2 py-0.5 rounded">{activeCoupon.code}</span> for {activeCoupon.discount}% off!
          </p>
        </motion.div>
      )}

      {/* Hero with Video Background */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=800&fit=crop"
        >
          <source src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(348,85%,18%)] via-[hsl(348,85%,18%,0.85)] to-transparent" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <motion.img
                src={logo}
                alt="Raj Kamal Exclusives"
                className="h-28 md:h-36 w-auto mb-6 drop-shadow-[0_0_30px_rgba(255,204,0,0.4)]"
                initial={{ opacity: 0, scale: 0.8, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 120 }}
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-secondary font-semibold text-sm uppercase tracking-[0.2em] mb-4"
              >
                ✦ Premium Textile Collection
              </motion.p>
              <motion.h2
                className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Style That<br />
                <span className="text-gradient-gold">Defines You</span>
              </motion.h2>
              <motion.p
                className="mt-5 text-primary-foreground/80 max-w-md leading-relaxed text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Discover handcrafted textiles and ethnic wear that blend tradition with contemporary style.
              </motion.p>
              <motion.div
                className="flex gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/shop" className="inline-flex items-center gap-2 gradient-gold text-secondary-foreground px-7 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-gold text-base">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/about" className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-7 py-3.5 rounded-xl font-semibold hover:bg-primary-foreground/10 transition-colors text-base backdrop-blur-sm">
                    Our Story
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Shop Building Image */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              className="relative hidden md:flex items-center justify-center"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-2 ring-secondary/20">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=550&h=650&fit=crop"
                  alt="Our Shop"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(348,85%,18%,0.6)] via-transparent to-transparent" />
                <motion.div
                  className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md p-4 rounded-xl border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <p className="font-display font-bold text-foreground text-sm">📍 Visit Our Store</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Premium collection available in-store & online</p>
                </motion.div>
              </div>
              <motion.div
                className="absolute -bottom-4 -left-4 bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-warm border border-border z-10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />)}
                </div>
                <p className="font-display font-bold text-xl text-foreground">10,000+</p>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-8 bg-card">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: Shield, title: 'Quality Assured', desc: '100% authentic products' },
            { icon: Sparkles, title: 'Easy Returns', desc: '7-day return policy' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="flex items-center gap-4 justify-center p-3 rounded-xl hover:bg-background transition-colors"
            >
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Banners */}
      {banners.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-5">
            {banners.map((banner, i) => (
              <motion.div
                key={banner.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Link to={banner.link} className="relative rounded-2xl overflow-hidden group aspect-[3/1] block">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[hsl(348,85%,18%,0.8)] to-transparent flex items-center p-8">
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-primary-foreground">{banner.title}</h3>
                      <p className="text-sm text-primary-foreground/80 mt-1">{banner.subtitle}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-secondary text-sm font-semibold">
                        Shop Now <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10"
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Link to={`/shop?category=${cat.slug}`} className="group text-center block">
                  <div className="aspect-square rounded-full overflow-hidden mx-auto w-28 h-28 md:w-36 md:h-36 border-4 border-border group-hover:border-secondary transition-all duration-300 shadow-warm group-hover:shadow-gold">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <p className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground">
              ✨ New Arrivals
            </motion.h2>
            <Link to="/shop?filter=new" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{newArrivals.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}</div>
        </section>
      )}

      {/* Fast Selling */}
      {fastSelling.length > 0 && (
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground">
                🔥 Fast Selling
              </motion.h2>
              <Link to="/shop?filter=fast" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{fastSelling.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}</div>
          </div>
        </section>
      )}

      {/* Accessories */}
      {accessories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground">
              💎 Accessories
            </motion.h2>
            <Link to="/shop?category=accessories" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{accessories.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}</div>
        </section>
      )}

      {/* Newsletter */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">Stay in Style</h2>
            <p className="text-primary-foreground/70 mb-6 max-w-md mx-auto">Get updates on new arrivals, exclusive offers, and textile trends.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gradient-gold text-secondary-foreground px-6 py-3 rounded-xl font-semibold shadow-gold"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
