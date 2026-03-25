import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="gradient-hero text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl font-bold mb-3">Raj Kamal Exclusives</h3>
          <p className="text-sm opacity-80 leading-relaxed">Premium textiles and ethnic wear for every occasion. Quality craftsmanship since generations.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2">
            {['/', '/about', '/shop', '/contact'].map((path, i) => (
              <Link key={path} to={path} className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                {['Home', 'About', 'Shop', 'Contact'][i]}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Categories</h4>
          <div className="space-y-2">
            {['Men', 'Women', 'Kids', 'Accessories'].map(cat => (
              <Link key={cat} to={`/shop?category=${cat.toLowerCase()}`} className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                {cat}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Contact</h4>
          <div className="space-y-2 text-sm opacity-80">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Textile Market, Mumbai</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@rajkamalexclusives.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60">
        © 2024 Raj Kamal Exclusives. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
