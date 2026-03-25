import { useState } from 'react';
import { Plus, Pencil, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBanners } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

const linkOptions = [
  { label: 'Shop Page', value: '/shop' },
  { label: 'Men', value: '/shop?category=men' },
  { label: 'Women', value: '/shop?category=women' },
  { label: 'Teens', value: '/shop?category=teens' },
  { label: 'Kids', value: '/shop?category=kids' },
  { label: 'Accessories', value: '/shop?category=accessories' },
  { label: 'New Arrivals', value: '/shop?filter=new' },
  { label: 'Custom URL', value: 'custom' },
];

const AdminBanners = () => {
  const { data: items, loading, refetch } = useBanners();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', link: '/shop', customLink: '', image: '' });
  const [imageInput, setImageInput] = useState('');

  const resetForm = () => { setForm({ title: '', subtitle: '', link: '/shop', customLink: '', image: '' }); setEditing(null); setShowForm(false); setImageInput(''); };

  const handleEdit = (b: any) => {
    setEditing(b);
    const isPreset = linkOptions.some(o => o.value === b.link && o.value !== 'custom');
    setForm({ title: b.title, subtitle: b.subtitle, link: isPreset ? b.link : 'custom', customLink: isPreset ? '' : b.link, image: b.image });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    const finalLink = form.link === 'custom' ? form.customLink : form.link;
    const finalImage = form.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop';
    const payload = { title: form.title, subtitle: form.subtitle, image: finalImage, link: finalLink };
    if (editing) {
      await supabase.from('banners').update(payload as any).eq('id', editing.id);
      toast({ title: 'Banner updated' });
    } else {
      await supabase.from('banners').insert(payload as any);
      toast({ title: 'Banner added' });
    }
    resetForm();
    refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('banners').delete().eq('id', id);
    toast({ title: 'Banner deleted' });
    refetch();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setForm(p => ({ ...p, image: ev.target!.result as string })); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Banners</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 gradient-gold text-secondary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-gold">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-warm space-y-4">
          <h3 className="font-display font-semibold text-foreground">{editing ? 'Edit Banner' : 'Add Banner'}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Grand Summer Sale" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Subtitle</label>
              <input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Up to 50% off" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Link To</label>
            <select value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {linkOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {form.link === 'custom' && (
              <input value={form.customLink} onChange={e => setForm(p => ({ ...p, customLink: e.target.value }))} placeholder="/your-custom-path" className="w-full mt-2 px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Banner Image</label>
            {form.image && <img src={form.image} alt="" className="w-full max-h-32 rounded-lg object-cover mb-2" />}
            <div className="flex gap-2 flex-wrap">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" /> Upload
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <div className="flex gap-1 flex-1 min-w-[200px]">
                <input type="url" value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="Or paste image URL..." className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" onClick={() => { if (imageInput.trim()) { setForm(p => ({ ...p, image: imageInput.trim() })); setImageInput(''); } }} className="px-3 py-2 rounded-lg border border-input text-foreground hover:bg-muted transition-colors">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
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
        <div className="space-y-4">
          {items.map(b => (
            <div key={b.id} className="bg-card rounded-xl overflow-hidden shadow-warm">
              <div className="relative h-32">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent flex items-center p-6">
                  <div><h3 className="font-display font-bold text-background">{b.title}</h3><p className="text-sm text-background/80">{b.subtitle}</p></div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => handleEdit(b)} className="p-1.5 rounded bg-background/80 text-foreground hover:bg-background"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded bg-destructive/80 text-destructive-foreground hover:bg-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
