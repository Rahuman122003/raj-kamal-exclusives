import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail, ArrowLeft } from 'lucide-react';
import logoImg from '@/assets/rje_no_bg.png';

type AuthMode = 'email' | 'phone';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from || '/';

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Account Created!', description: 'Please check your email to verify your account.' });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: 'Sign In Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Welcome back!' });
        navigate(from, { replace: true });
      }
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    if (error) {
      toast({ title: 'Failed to send OTP', description: error.message, variant: 'destructive' });
    } else {
      setOtpSent(true);
      toast({ title: 'OTP Sent!', description: `Verification code sent to ${formattedPhone}` });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { error } = await supabase.auth.verifyOtp({ phone: formattedPhone, token: otp, type: 'sms' });
    if (error) {
      toast({ title: 'Verification Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome!' });
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card rounded-2xl p-8 shadow-warm"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 mx-auto flex items-center justify-center mb-3 p-1"
          >
            <img src={logoImg} alt="RKE" className="w-full h-full object-contain rounded-full" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {authMode === 'phone' ? 'Phone Verification' : isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Raj Kamal Exclusives</p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex rounded-lg bg-muted p-1 mb-5">
          <button
            onClick={() => { setAuthMode('email'); setOtpSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
              authMode === 'email' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          <button
            onClick={() => { setAuthMode('phone'); setOtpSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
              authMode === 'phone' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Phone className="w-4 h-4" /> Phone
          </button>
        </div>

        <AnimatePresence mode="wait">
          {authMode === 'email' ? (
            <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {isSignUp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.3 }}>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" />
                  </motion.div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" minLength={6} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
                </motion.button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 py-2.5 rounded-lg border border-input bg-muted text-foreground text-sm font-medium">+91</span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1 px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendOtp}
                    disabled={loading || phone.length < 10}
                    className="w-full gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </motion.button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <button type="button" onClick={() => setOtpSent(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Change number
                  </button>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to <span className="font-medium text-foreground">+91{phone}</span>
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">OTP Code</label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="••••••"
                      maxLength={6}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                  </motion.button>
                  <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full text-sm text-primary font-semibold hover:underline disabled:opacity-50">
                    Resend OTP
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;
