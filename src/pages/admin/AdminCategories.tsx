import { useState } from 'react';
import { Plus, Pencil, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

const AdminCategories = () => {
  const { data: items, loading, refetch } = useCategories();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [imageInput, setImageInput] = useState('');

  const resetForm = () => { setName(''); setImage(''); setImageInput(''); setEditing(null); setShowForm(false); };

  const handleEdit = (id: string) => {
    const cat = items.find(c => c.id === id);
    if (cat) { setEditing(id); setName(cat.name); setImage(cat.image); setShowForm(true); }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const finalImage = image || 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop';
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    if (editing) {
      await supabase.from('categories').update({ name, slug, image: finalImage } as any).eq('id', editing);
      toast({ title: 'Category updated' });
    } else {
      await supabase.from('categories').insert({ name, slug, image: finalImage } as any);
      toast({ title: 'Category added' });
    }
    resetForm();
    refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    toast({ title: 'Category deleted' });
    refetch();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setImage(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 gradient-gold text-secondary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-gold">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-warm space-y-4">
          <h3 className="font-display font-semibold text-foreground">{editing ? 'Edit Category' : 'Add Category'}</h3>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Bridal Collection" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category Image</label>
            {image && <img src={image} alt="" className="w-20 h-20 rounded-lg object-cover mb-2" />}
            <div className="flex gap-2 flex-wrap">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" /> Upload
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <div className="flex gap-1 flex-1 min-w-[200px]">
                <input type="url" value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="Or paste image URL..." className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" onClick={() => { if (imageInput.trim()) { setImage(imageInput.trim()); setImageInput(''); } }} className="px-3 py-2 rounded-lg border border-input text-foreground hover:bg-muted transition-colors">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold">Save</button>
            <button onClick={resetForm} className="border border-input text-foreground px-4 py-2.5 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(cat => (
            <div key={cat.id} className="bg-card rounded-xl p-4 shadow-warm flex items-center gap-4">
              <img src={cat.image} alt={cat.name} className="w-14 h-14 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{cat.name}</p>
                <p className="text-xs text-muted-foreground">/{cat.slug}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(cat.id)} className="p-1.5 rounded hover:bg-muted text-foreground"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
