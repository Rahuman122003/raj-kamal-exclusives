import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { products as initialProducts, Product } from '@/data/products';

const AdminProducts = () => {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', originalPrice: '', category: 'men', colors: '', sizes: '', inStock: true });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', originalPrice: '', category: 'men', colors: '', sizes: '', inStock: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), originalPrice: String(p.originalPrice || ''), category: p.category, colors: p.colors.join(', '), sizes: p.sizes.join(', '), inStock: p.inStock });
    setShowForm(true);
  };

  const handleSave = () => {
    const product: Product = {
      id: editing?.id || Date.now().toString(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      images: editing?.images || ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'],
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      inStock: form.inStock,
      rating: editing?.rating || 4.0,
      reviews: editing?.reviews || 0,
      createdAt: editing?.createdAt || new Date().toISOString().split('T')[0],
    };
    if (editing) {
      setItems(prev => prev.map(p => p.id === editing.id ? product : p));
    } else {
      setItems(prev => [...prev, product]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => setItems(prev => prev.filter(p => p.id !== id));

  const updateField = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 gradient-gold text-secondary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-gold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-warm space-y-4">
          <h3 className="font-display font-semibold text-foreground">{editing ? 'Edit Product' : 'Add Product'}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Name', field: 'name', type: 'text' },
              { label: 'Category', field: 'category', type: 'select' },
              { label: 'Price (₹)', field: 'price', type: 'number' },
              { label: 'Original Price (₹)', field: 'originalPrice', type: 'number' },
              { label: 'Colors (comma separated)', field: 'colors', type: 'text' },
              { label: 'Sizes (comma separated)', field: 'sizes', type: 'text' },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
                {type === 'select' ? (
                  <select value={(form as any)[field]} onChange={e => updateField(field, e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm">
                    {['men', 'women', 'teens', 'kids', 'accessories'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input type={type} value={(form as any)[field]} onChange={e => updateField(field, e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.inStock} onChange={e => updateField('inStock', e.target.checked)} className="accent-primary" /> In Stock
          </label>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Save</button>
            <button onClick={resetForm} className="border border-input text-foreground px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-12 rounded object-cover" />
                    <span className="font-semibold text-foreground">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-foreground">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold ${p.inStock ? 'text-green-600' : 'text-destructive'}`}>{p.inStock ? 'In Stock' : 'Out'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded hover:bg-muted transition-colors text-foreground"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
