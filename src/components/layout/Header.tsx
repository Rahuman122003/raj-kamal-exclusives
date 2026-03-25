import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-warm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">R</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-lg font-bold text-foreground leading-tight">Raj Kamal</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Exclusives</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { name: 'Home', to: '/' },
            { name: 'About', to: '/about' },
            { name: 'Shop', to: '/shop' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to) ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Categories <ChevronDown className="w-3 h-3" />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-warm py-1 animate-fade-in-up">
                {categoryLinks.map(cat => (
                  <Link key={cat.name} to={cat.to} className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/contact') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in-up">
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
                className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">Categories</p>
              {categoryLinks.map(cat => (
                <Link key={cat.name} to={cat.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
