import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { categories as initialCats } from '@/data/products';

const AdminCategories = () => {
  const [items, setItems] = useState(initialCats);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    if (editing) {
      setItems(prev => prev.map(c => c.id === editing ? { ...c, name, slug: name.toLowerCase().replace(/\s+/g, '-') } : c));
    } else {
      setItems(prev => [...prev, { id: Date.now().toString(), name, slug: name.toLowerCase().replace(/\s+/g, '-'), image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' }]);
    }
    setName(''); setEditing(null); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
        <button onClick={() => { setName(''); setEditing(null); setShowForm(true); }} className="flex items-center gap-2 gradient-gold text-secondary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-gold">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-warm flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-1">Category Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold">Save</button>
          <button onClick={() => setShowForm(false)} className="border border-input text-foreground px-4 py-2.5 rounded-lg text-sm">Cancel</button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(cat => (
          <div key={cat.id} className="bg-card rounded-xl p-4 shadow-warm flex items-center gap-4">
            <img src={cat.image} alt={cat.name} className="w-14 h-14 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{cat.name}</p>
              <p className="text-xs text-muted-foreground">/{cat.slug}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(cat.id); setName(cat.name); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted text-foreground"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setItems(prev => prev.filter(c => c.id !== cat.id))} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
