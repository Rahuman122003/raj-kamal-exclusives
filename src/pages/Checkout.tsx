import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RAZORPAY_KEY_ID, RAZORPAY_CONFIG } from '@/config/razorpay';
import { supabase } from '@/integrations/supabase/client';
import { LogIn, Tag, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: user?.email || '', phone: '', address: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const discount = appliedCoupon ? Math.round(totalPrice * appliedCoupon.discount / 100) : 0;
  const total = totalPrice - discount + shipping;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Require login before checkout — redirect to auth with return path
  if (!authLoading && !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-card rounded-2xl p-8 shadow-warm"
        >
          <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in or create an account to proceed with checkout.</p>
          <Link
            to="/auth"
            state={{ from: '/checkout' }}
            className="inline-flex items-center gap-2 gradient-gold text-secondary-foreground px-6 py-3 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity"
          >
            Sign In / Sign Up
          </Link>
        </motion.div>
      </div>
    );
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const { data: coupons } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('is_active', true) as any;

    if (coupons && coupons.length > 0) {
      const coupon = coupons[0];
      setAppliedCoupon({ code: coupon.code, discount: Number(coupon.discount) });
      toast({ title: '🎉 Coupon Applied!', description: `You got ${coupon.discount}% off!` });
    } else {
      toast({ title: 'Invalid Coupon', description: 'This coupon code is not valid or has expired.', variant: 'destructive' });
    }
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const saveOrder = async (orderId: string, paymentId?: string) => {
    await supabase.from('orders').insert({
      order_id: orderId,
      user_id: user?.id,
      items: items.map(i => ({ productId: i.product.id, name: i.product.name, price: i.product.price, qty: i.quantity, size: i.selectedSize, color: i.selectedColor })),
      total,
      status: 'pending',
      customer_name: form.name,
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      phone: form.phone,
      email: form.email,
      payment_id: paymentId || null,
    } as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes('YOUR_KEY_HERE')) {
      toast({ title: 'Demo Mode', description: 'Razorpay key not configured. Simulating payment...' });
      setTimeout(async () => {
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
        await saveOrder(orderId);
        clearCart();
        navigate('/thank-you', { state: { orderId, total, customerName: form.name } });
      }, 1500);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast({ title: 'Error', description: 'Failed to load Razorpay.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.name,
      description: RAZORPAY_CONFIG.description,
      image: RAZORPAY_CONFIG.image,
      handler: async (response: any) => {
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
        await saveOrder(orderId, response.razorpay_payment_id);
        clearCart();
        navigate('/thank-you', { state: { orderId, total, customerName: form.name, paymentId: response.razorpay_payment_id } });
      },
      prefill: { name: form.name, email: form.email, contact: form.phone },
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 shadow-warm space-y-4"
            >
              <h3 className="font-display font-semibold text-foreground text-lg">Shipping Details</h3>
              <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{user?.email}</span></p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <input required type="text" value={form.name} onChange={e => updateField('name', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City *</label>
                  <input required type="text" value={form.city} onChange={e => updateField('city', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Address *</label>
                <textarea required value={form.address} onChange={e => updateField('address', e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium text-foreground mb-1">Pincode *</label>
                <input required type="text" value={form.pincode} onChange={e => updateField('pincode', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-6 shadow-warm h-fit sticky top-24"
          >
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                  <span className="text-foreground truncate max-w-[180px]">{item.product.name} × {item.quantity}</span>
                  <span className="text-foreground font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-border pt-3 mb-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                    <span className="text-xs text-green-600">(-{appliedCoupon.discount}%)</span>
                  </div>
                  <button type="button" onClick={removeCoupon} className="p-1 text-green-600 hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>
              )}
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-display font-bold text-foreground text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold mt-6 shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
            </motion.button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {RAZORPAY_KEY_ID.includes('YOUR_KEY_HERE') ? '🔧 Demo Mode — Configure Razorpay key in src/config/razorpay.ts' : '🔒 Secured by Razorpay'}
            </p>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default Checkout;
