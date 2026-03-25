import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ThankYou = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || 'ORD-XXXXX';
  const total = state?.total || 0;
  const customerName = state?.customerName || 'Customer';

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <CheckCircle className="w-20 h-20 text-secondary mx-auto mb-6" />
      </motion.div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Thank You, {customerName}!</h1>
      <p className="text-muted-foreground mb-6">Your order has been placed successfully.</p>
      <div className="bg-card rounded-lg p-6 shadow-warm text-left space-y-3 mb-8">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-semibold text-foreground">{orderId}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Paid</span><span className="font-semibold text-foreground">₹{total.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><span className="font-semibold text-secondary">Confirmed</span></div>
      </div>
      <div className="flex gap-3 justify-center">
        <Link to="/shop" className="gradient-gold text-secondary-foreground px-6 py-3 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity">
          Continue Shopping
        </Link>
        <Link to="/" className="border border-input text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
