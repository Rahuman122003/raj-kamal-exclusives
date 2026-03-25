import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RAZORPAY_KEY_ID, RAZORPAY_CONFIG } from '@/config/razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: user?.email || '', phone: '', address: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if Razorpay key is configured
    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_HERE') {
      // Fallback: simulate payment for demo
      toast({ title: 'Demo Mode', description: 'Razorpay key not configured. Simulating payment...' });
      setTimeout(() => {
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
        clearCart();
        navigate('/thank-you', { state: { orderId, total, customerName: form.name } });
      }, 1500);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast({ title: 'Error', description: 'Failed to load Razorpay. Check your internet connection.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: total * 100, // Razorpay expects amount in paise
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.name,
      description: RAZORPAY_CONFIG.description,
      image: RAZORPAY_CONFIG.image,
      handler: (response: any) => {
        // Payment successful
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
        console.log('Payment ID:', response.razorpay_payment_id);
        clearCart();
        navigate('/thank-you', { state: { orderId, total, customerName: form.name, paymentId: response.razorpay_payment_id } });
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: RAZORPAY_CONFIG.theme,
      modal: {
        ondismiss: () => {
          setLoading(false);
          toast({ title: 'Payment cancelled', description: 'You can try again when ready.' });
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
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

              {!user && (
                <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground">
                  <a href="/auth" className="text-primary font-semibold hover:underline">Sign in</a> for a faster checkout experience
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <input required type="text" value={form.name} onChange={e => updateField('name', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City *</label>
                  <input required type="text" value={form.city} onChange={e => updateField('city', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Address *</label>
                <textarea required value={form.address} onChange={e => updateField('address', e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium text-foreground mb-1">Pincode *</label>
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
              {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_HERE' ? '🔧 Demo Mode — Configure Razorpay key in src/config/razorpay.ts' : 'Secured by Razorpay'}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
