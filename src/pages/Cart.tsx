import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6">Add some beautiful textiles to your cart!</p>
      <Link to="/shop" className="inline-flex gradient-gold text-secondary-foreground px-6 py-3 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 bg-card rounded-lg p-4 shadow-warm">
              <Link to={`/product/${item.product.id}`} className="w-24 h-32 rounded-lg overflow-hidden shrink-0">
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`} className="font-display font-semibold text-foreground hover:text-primary transition-colors">{item.product.name}</Link>
                <p className="text-xs text-muted-foreground mt-1">Size: {item.selectedSize} • Color: {item.selectedColor}</p>
                <p className="font-display font-bold text-foreground mt-2">₹{item.product.price.toLocaleString()}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-1 rounded border border-input hover:bg-muted transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center text-foreground">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-1 rounded border border-input hover:bg-muted transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)} className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-lg p-6 shadow-warm h-fit sticky top-24">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{totalPrice >= 999 ? 'Free' : '₹99'}</span></div>
            <div className="border-t border-border pt-2 flex justify-between font-display font-bold text-foreground text-lg">
              <span>Total</span>
              <span>₹{(totalPrice + (totalPrice >= 999 ? 0 : 99)).toLocaleString()}</span>
            </div>
          </div>
          <Link to="/checkout" className="block w-full text-center gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold mt-6 shadow-gold hover:opacity-90 transition-opacity">
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="block text-center text-sm text-primary mt-3 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
