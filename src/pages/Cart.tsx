import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-20 h-20 text-muted-foreground/40 mx-auto mb-6" />
      <h2 className="font-display text-3xl font-bold text-foreground mb-3">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Add some beautiful textiles to your cart and they'll show up here!</p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to="/shop" className="inline-flex items-center gap-2 gradient-gold text-secondary-foreground px-8 py-3.5 rounded-xl font-semibold shadow-gold hover:opacity-90 transition-opacity">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Shopping Cart <span className="text-muted-foreground text-lg font-normal">({items.length} items)</span></h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex gap-4 bg-card rounded-xl p-4 shadow-warm hover:shadow-gold transition-shadow"
              >
                <Link to={`/product/${item.product.id}`} className="w-24 h-32 rounded-xl overflow-hidden shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="font-display font-semibold text-foreground hover:text-primary transition-colors">{item.product.name}</Link>
                  <p className="text-xs text-muted-foreground mt-1">Size: {item.selectedSize} • Color: {item.selectedColor}</p>
                  <p className="font-display font-bold text-foreground mt-2 text-lg">₹{item.product.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-background rounded-lg border border-input">
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-2 hover:bg-muted transition-colors rounded-l-lg">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold w-8 text-center text-foreground">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-2 hover:bg-muted transition-colors rounded-r-lg">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-6 shadow-warm h-fit sticky top-24">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{totalPrice >= 999 ? <span className="text-green-600 font-medium">Free</span> : '₹99'}</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-display font-bold text-foreground text-xl">
              <span>Total</span>
              <span>₹{(totalPrice + (totalPrice >= 999 ? 0 : 99)).toLocaleString()}</span>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/checkout" className="block w-full text-center gradient-gold text-secondary-foreground py-3.5 rounded-xl font-semibold mt-6 shadow-gold hover:opacity-90 transition-opacity">
              Proceed to Checkout
            </Link>
          </motion.div>
          <Link to="/shop" className="block text-center text-sm text-primary mt-3 hover:underline font-medium">← Continue Shopping</Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
