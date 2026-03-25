import { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { coupons as initialCoupons, Coupon } from '@/data/products';

const discountOptions = [5, 10, 15, 20, 25, 30, 40, 50];

const AdminCoupons = () => {
  const [items, setItems] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: '', discount: '10', expiresAt: '' });

  const resetForm = () => { setForm({ code: '', discount: '10', expiresAt: '' }); setEditing(null); setShowForm(false); };

  const handleEdit = (c: Coupon) => {
    setEditing(c);
    setForm({ code: c.code, discount: String(c.discount), expiresAt: c.expiresAt });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.code || !form.expiresAt) return;
    const coupon: Coupon = { id: editing?.id || Date.now().toString(), code: form.code.toUpperCase(), discount: Number(form.discount), expiresAt: form.expiresAt, isActive: true };
    if (editing) {
      setItems(prev => prev.map(c => c.id === editing.id ? coupon : c));
    } else {
      setItems(prev => [...prev, coupon]);
    }
    resetForm();
  };

  const toggleActive = (id: string) => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Coupons</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 gradient-gold text-secondary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-gold">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-warm space-y-4">
          <h3 className="font-display font-semibold text-foreground">{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Coupon Code *</label>
              <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm uppercase focus:outline-none focus:ring-2 focus:ring-ring" placeholder="SUMMER20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Discount (%) *</label>
              <select value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {discountOptions.map(d => <option key={d} value={d}>{d}%</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Expires On *</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
            <button onClick={resetForm} className="border border-input text-foreground px-4 py-2 rounded-lg text-sm">Cancel</button>
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
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(c.id)} className="flex items-center gap-1.5">
                    {c.isActive ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                    <span className={`text-xs font-semibold ${c.isActive ? 'text-green-700' : 'text-muted-foreground'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(c)} className="p-1.5 rounded hover:bg-muted text-foreground"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setItems(prev => prev.filter(x => x.id !== c.id))} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
