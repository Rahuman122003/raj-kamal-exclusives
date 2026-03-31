import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const categoryLinks = [
  { name: 'Men', to: '/shop?category=men' },
  { name: 'Women', to: '/shop?category=women' },
  { name: 'Teens', to: '/shop?category=teens' },
  { name: 'Kids', to: '/shop?category=kids' },
  { name: 'New Arrivals', to: '/shop?filter=new' },
  { name: 'Fast Selling', to: '/shop?filter=fast' },
  { name: 'Accessories', to: '/shop?category=accessories' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-warm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-1 group">
          <img src={logo} alt="Raj Kamal Exclusives" className="h-12 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { name: 'Home', to: '/' },
            { name: 'About', to: '/about' },
            { name: 'Shop', to: '/shop' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.to) ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-muted'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Categories <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-1 w-52 bg-background border border-border rounded-xl shadow-warm py-2 overflow-hidden"
                >
                  {categoryLinks.map(cat => (
                    <Link key={cat.name} to={cat.to} className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/contact"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/contact') ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-muted'
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-muted transition-colors">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-sm"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2.5 rounded-full hover:bg-muted transition-colors"
              >
                <User className="w-5 h-5 text-foreground" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-1 w-52 bg-background border border-border rounded-xl shadow-warm py-2 overflow-hidden"
                  >
                    <div className="px-4 py-2">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                    </div>
                    <hr className="border-border" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-destructive transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth"
                state={{ from: location.pathname + location.search }}
                className="px-4 py-2 rounded-lg text-sm font-semibold gradient-gold text-secondary-foreground shadow-gold hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            </motion.div>
          )}

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {[
                { name: 'Home', to: '/' },
                { name: 'About', to: '/about' },
                { name: 'Shop', to: '/shop' },
                { name: 'Contact', to: '/contact' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.to) ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
                {categoryLinks.map(cat => (
                  <Link key={cat.name} to={cat.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
