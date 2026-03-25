import { useState } from 'react';
import { Plus, Pencil, Trash2, Upload, Link as LinkIcon, X } from 'lucide-react';
import { products as initialProducts, Product, categories } from '@/data/products';

const categoryOptions = ['men', 'women', 'teens', 'kids', 'accessories'];
const colorOptions = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gold', 'Maroon', 'Pink', 'Yellow', 'Teal', 'Navy', 'Ivory', 'Beige', 'Purple', 'Olive', 'Sky Blue', 'Lavender', 'Mustard', 'Indigo', 'Coral'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', '2-3Y', '4-5Y', '6-7Y', '8-9Y'];

const AdminProducts = () => {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'men',
    colors: [] as string[], sizes: [] as string[], inStock: true,
    isNewArrival: false, isFastSelling: false, images: [] as string[],
  });
  const [imageInput, setImageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', originalPrice: '', category: 'men', colors: [], sizes: [], inStock: true, isNewArrival: false, isFastSelling: false, images: [] });
    setEditing(null);
    setShowForm(false);
    setImageInput('');
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      originalPrice: String(p.originalPrice || ''), category: p.category,
      colors: [...p.colors], sizes: [...p.sizes], inStock: p.inStock,
      isNewArrival: p.isNewArrival || false, isFastSelling: p.isFastSelling || false,
      images: [...p.images],
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const product: Product = {
      id: editing?.id || Date.now().toString(),
      name: form.name, description: form.description,
      price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      images: form.images.length > 0 ? form.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'],
      colors: form.colors, sizes: form.sizes, inStock: form.inStock,
      isNewArrival: form.isNewArrival, isFastSelling: form.isFastSelling,
      rating: editing?.rating || 4.0, reviews: editing?.reviews || 0,
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

  const toggleArrayItem = (field: 'colors' | 'sizes', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value],
    }));
  };

  const addImageUrl = () => {
    if (imageInput.trim()) {
      setForm(prev => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
      setImageInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setForm(prev => ({ ...prev, images: [...prev.images, ev.target!.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const filteredItems = items.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 gradient-gold text-secondary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-gold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
        >
          <option value="all">All Categories</option>
          {categoryOptions.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-warm space-y-5">
          <h3 className="font-display font-semibold text-foreground text-lg">{editing ? 'Edit Product' : 'Add Product'}</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Product Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter product name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {categoryOptions.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="1499 (for showing discount)" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Product description..." />
          </div>

          {/* Colors - multi-select dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Colors</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleArrayItem('colors', color)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    form.colors.includes(color)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-input hover:bg-muted'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            {form.colors.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">Selected: {form.colors.join(', ')}</p>
            )}
          </div>

          {/* Sizes - multi-select */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleArrayItem('sizes', size)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    form.sizes.includes(size)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-input hover:bg-muted'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {form.sizes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">Selected: {form.sizes.join(', ')}</p>
            )}
          </div>

          {/* Images - upload + URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-24 rounded-lg overflow-hidden border border-border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive text-destructive-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" /> Upload File
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
              </label>
              <div className="flex gap-1 flex-1 min-w-[200px]">
                <input
                  type="url"
                  value={imageInput}
                  onChange={e => setImageInput(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                />
                <button type="button" onClick={addImageUrl} className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm hover:bg-muted transition-colors">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))} className="accent-primary w-4 h-4" />
              In Stock
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.isNewArrival} onChange={e => setForm(p => ({ ...p, isNewArrival: e.target.checked }))} className="accent-primary w-4 h-4" />
              New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.isFastSelling} onChange={e => setForm(p => ({ ...p, isFastSelling: e.target.checked }))} className="accent-primary w-4 h-4" />
              Fast Selling
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Save Product</button>
            <button onClick={resetForm} className="border border-input text-foreground px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-card rounded-xl shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Tags</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>
              {filteredItems.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-12 rounded object-cover" />
                    <span className="font-semibold text-foreground">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-foreground">
                    ₹{p.price.toLocaleString()}
                    {p.originalPrice && <span className="text-muted-foreground line-through ml-1 text-xs">₹{p.originalPrice.toLocaleString()}</span>}
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.inStock ? 'In Stock' : 'Out'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.isNewArrival && <span className="px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">New</span>}
                      {p.isFastSelling && <span className="px-1.5 py-0.5 rounded text-xs bg-orange-100 text-orange-700">Fast</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded hover:bg-muted transition-colors text-foreground"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
