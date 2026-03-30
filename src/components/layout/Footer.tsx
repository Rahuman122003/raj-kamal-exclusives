import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="gradient-hero text-primary-foreground">
    <div className="container mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <span className="text-secondary-foreground font-display font-bold text-lg">R</span>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Raj Kamal</h3>
              <p className="text-xs opacity-70 -mt-0.5">Exclusives</p>
            </div>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">Premium textiles and ethnic wear for every occasion. Quality craftsmanship since generations.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-secondary">Quick Links</h4>
          <div className="space-y-2.5">
            {['/', '/about', '/shop', '/contact'].map((path, i) => (
              <Link key={path} to={path} className="block text-sm opacity-70 hover:opacity-100 hover:text-secondary transition-all duration-200">
                {['Home', 'About', 'Shop', 'Contact'][i]}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-secondary">Categories</h4>
          <div className="space-y-2.5">
            {['Men', 'Women', 'Kids', 'Accessories'].map(cat => (
              <Link key={cat} to={`/shop?category=${cat.toLowerCase()}`} className="block text-sm opacity-70 hover:opacity-100 hover:text-secondary transition-all duration-200">
                {cat}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-secondary">Contact</h4>
          <div className="space-y-3 text-sm opacity-70">
            <p className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-secondary shrink-0" /> 123 Textile Market, Mumbai</p>
            <p className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-secondary shrink-0" /> +91 98765 43210</p>
            <p className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-secondary shrink-0" /> info@rajkamalexclusives.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 mt-10 pt-6 text-center text-sm opacity-50 flex items-center justify-center gap-1">
        © 2024 Raj Kamal Exclusives. Made with <Heart className="w-3.5 h-3.5 fill-secondary text-secondary" /> in India
      </div>
    </div>
  </footer>
);

export default Footer;
