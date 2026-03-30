import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.sizes[0], product.colors[0]);
    toast({ title: 'Added to cart!', description: product.name });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-xl overflow-hidden shadow-warm hover:shadow-gold transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            NEW
          </span>
        )}
        {product.isFastSelling && !product.isNewArrival && (
          <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            🔥 HOT
          </span>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-card/90 backdrop-blur-sm text-foreground shadow-warm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <ShoppingCart className="w-4 h-4" />
        </motion.button>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-foreground truncate hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground capitalize mt-1">{product.category}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
          <span className="text-xs text-muted-foreground font-medium">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-foreground text-lg">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
