import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { coupons as initialCoupons, Coupon } from '@/data/products';

const AdminCoupons = () => {
  const [items, setItems] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discount: '', expiresAt: '' });

  const handleSave = () => {
    setItems(prev => [...prev, { id: Date.now().toString(), code: form.code.toUpperCase(), discount: Number(form.discount), expiresAt: form.expiresAt, isActive: true }]);
    setForm({ code: '', discount: '', expiresAt: '' }); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Coupons</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 gradient-gold text-secondary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-gold">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-warm space-y-3">
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1">Code</label><input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm uppercase" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">Discount (%)</label><input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">Expires</label><input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
            <button onClick={() => setShowForm(false)} className="border border-input text-foreground px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-card rounded-xl shadow-warm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Expires</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-semibold text-foreground">{c.code}</td>
                <td className="px-4 py-3 text-foreground">{c.discount}%</td>
                <td className="px-4 py-3 text-muted-foreground">{c.expiresAt}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.isActive ? 'Active' : 'Expired'}</span></td>
                <td className="px-4 py-3"><button onClick={() => setItems(prev => prev.filter(x => x.id !== c.id))} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
