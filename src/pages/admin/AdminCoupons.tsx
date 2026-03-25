import { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCoupons } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

const discountOptions = [5, 10, 15, 20, 25, 30, 40, 50];

const AdminCoupons = () => {
  const { data: items, loading, refetch } = useCoupons();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: '', discount: '10', expiresAt: '' });

  const resetForm = () => { setForm({ code: '', discount: '10', expiresAt: '' }); setEditing(null); setShowForm(false); };

  const handleEdit = (c: any) => {
    setEditing(c);
    setForm({ code: c.code, discount: String(c.discount), expiresAt: c.expires_at });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.expiresAt) return;
    const payload = { code: form.code.toUpperCase(), discount: Number(form.discount), expires_at: form.expiresAt, is_active: true };
    if (editing) {
      await supabase.from('coupons').update(payload as any).eq('id', editing.id);
      toast({ title: 'Coupon updated' });
    } else {
      await supabase.from('coupons').insert(payload as any);
      toast({ title: 'Coupon added' });
    }
    resetForm();
    refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('coupons').delete().eq('id', id);
    toast({ title: 'Coupon deleted' });
    refetch();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('coupons').update({ is_active: !current } as any).eq('id', id);
    refetch();
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

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : (
        <div className="bg-card rounded-xl shadow-warm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Expires</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-semibold text-foreground">{c.code}</td>
                  <td className="px-4 py-3 text-foreground">{c.discount}%</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.expires_at}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c.id, c.is_active)} className="flex items-center gap-1.5">
                      {c.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                      <span className={`text-xs font-semibold ${c.is_active ? 'text-green-700' : 'text-muted-foreground'}`}>{c.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(c)} className="p-1.5 rounded hover:bg-muted text-foreground"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
