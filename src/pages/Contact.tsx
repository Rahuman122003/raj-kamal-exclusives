import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground text-center mb-10">Get in Touch</h1>
      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Contact Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">Have a question about our products or need assistance? We'd love to hear from you.</p>
          </div>
          {[
            { icon: MapPin, label: 'Visit Us', value: '123 Textile Market, Dadar West, Mumbai 400028' },
            { icon: Phone, label: 'Call Us', value: '+91 98765 43210' },
            { icon: Mail, label: 'Email Us', value: 'info@rajkamalexclusives.com' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground shrink-0"><Icon className="w-5 h-5" /></div>
              <div>
                <p className="font-semibold text-foreground text-sm">{label}</p>
                <p className="text-sm text-muted-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-card p-6 rounded-xl shadow-warm">
          {submitted ? (
            <div className="text-center py-8">
              <Send className="w-12 h-12 text-secondary mx-auto mb-3" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Message Sent!</h3>
              <p className="text-muted-foreground text-sm">We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input required type="text" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input required type="email" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                <textarea required rows={4} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <button type="submit" className="w-full gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
