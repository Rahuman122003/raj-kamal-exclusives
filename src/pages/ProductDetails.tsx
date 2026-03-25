import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Minus, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

const mapProduct = (p: any) => ({
  id: p.id, name: p.name, description: p.description,
  price: Number(p.price), originalPrice: p.original_price ? Number(p.original_price) : undefined,
  category: p.category, images: p.images || [], colors: p.colors || [],
  sizes: p.sizes || [], inStock: p.in_stock, isNewArrival: p.is_new_arrival,
  isFastSelling: p.is_fast_selling, rating: Number(p.rating), reviews: p.reviews,
  createdAt: p.created_at,
});

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        setProduct(mapProduct(data));
        const { data: rel } = await supabase.from('products').select('*').eq('category', data.category).neq('id', id).limit(4);
        setRelated((rel || []).map(mapProduct));
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!product) return (
    <div className="container mx-auto px-4 py-16 text-center">
      <p className="text-muted-foreground">Product not found.</p>
      <button onClick={() => navigate('/shop')} className="mt-4 text-primary underline">Back to Shop</button>
    </div>
  );

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0], qty);
  const handleBuyNow = () => { handleAddToCart(); navigate('/cart'); };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-3">
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-border'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
            <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-secondary text-secondary' : 'text-border'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-display font-bold text-foreground">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-sm font-semibold text-secondary">-{discount}% OFF</span>
              </>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Color</p>
            <div className="flex gap-2">
              {product.colors.map((color: string) => (
                <button key={color} onClick={() => setSelectedColor(color)} className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${(selectedColor || product.colors[0]) === color ? 'bg-primary text-primary-foreground border-primary' : 'border-input text-foreground hover:bg-muted'}`}>{color}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Size</p>
            <div className="flex gap-2">
              {product.sizes.map((size: string) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${(selectedSize || product.sizes[0]) === size ? 'bg-primary text-primary-foreground border-primary' : 'border-input text-foreground hover:bg-muted'}`}>{size}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1.5 rounded-lg border border-input hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="font-semibold text-foreground w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-1.5 rounded-lg border border-input hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          <p className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-destructive'}`}>
            {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={!product.inStock} className="flex-1 gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-gold disabled:opacity-50">Buy Now</button>
          </div>
        </motion.div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
