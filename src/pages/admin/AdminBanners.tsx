import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { banners as initialBanners } from '@/data/products';

const AdminBanners = () => {
  const [items, setItems] = useState(initialBanners);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', link: '/shop' });

  const handleSave = () => {
    setItems(prev => [...prev, { id: Date.now().toString(), ...form, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop' }]);
    setForm({ title: '', subtitle: '', link: '/shop' }); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Banners</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 gradient-gold text-secondary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-gold">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-warm space-y-3">
          {['title', 'subtitle', 'link'].map(f => (
            <div key={f}>
              <label className="block text-sm font-medium text-foreground mb-1 capitalize">{f}</label>
              <input value={(form as any)[f]} onChange={e => setForm(prev => ({ ...prev, [f]: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
            <button onClick={() => setShowForm(false)} className="border border-input text-foreground px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {items.map(b => (
          <div key={b.id} className="bg-card rounded-xl overflow-hidden shadow-warm">
            <div className="relative h-32">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-chocolate/70 to-transparent flex items-center p-6">
                <div><h3 className="font-display font-bold text-primary-foreground">{b.title}</h3><p className="text-sm text-primary-foreground/80">{b.subtitle}</p></div>
              </div>
              <button onClick={() => setItems(prev => prev.filter(x => x.id !== b.id))} className="absolute top-2 right-2 p-1.5 rounded bg-destructive/80 text-destructive-foreground hover:bg-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;
