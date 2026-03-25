import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Razorpay payment
    setTimeout(() => {
      const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
      clearCart();
      navigate('/thank-you', { state: { orderId, total, customerName: form.name } });
    }, 1500);
  };

  const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-warm space-y-4">
              <h3 className="font-display font-semibold text-foreground text-lg">Shipping Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', field: 'name', type: 'text' },
                  { label: 'Email', field: 'email', type: 'email' },
                  { label: 'Phone', field: 'phone', type: 'tel' },
                  { label: 'City', field: 'city', type: 'text' },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
                    <input required type={type} value={(form as any)[field]} onChange={e => updateField(field, e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                <textarea required value={form.address} onChange={e => updateField('address', e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium text-foreground mb-1">Pincode</label>
                <input required type="text" value={form.pincode} onChange={e => updateField('pincode', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-lg p-6 shadow-warm h-fit sticky top-24">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                  <span className="text-foreground truncate max-w-[180px]">{item.product.name} × {item.quantity}</span>
                  <span className="text-foreground font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-display font-bold text-foreground text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold mt-6 shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'Processing Payment...' : `Pay ₹${total.toLocaleString()}`}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-3">Powered by Razorpay (Test Mode)</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
