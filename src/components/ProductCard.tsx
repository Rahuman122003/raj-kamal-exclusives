import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-lg overflow-hidden shadow-warm hover:shadow-gold transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-foreground truncate hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground capitalize mt-1">{product.category}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 fill-secondary text-secondary" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-foreground">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product, product.sizes[0], product.colors[0]); }}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-brown transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
