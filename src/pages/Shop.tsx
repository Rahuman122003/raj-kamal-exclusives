import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useSupabaseData';
import ProductCard from '@/components/ProductCard';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: dbProducts, loading } = useProducts();
  const { data: categories } = useCategories();

  const filterParam = searchParams.get('filter');

  const mapProduct = (p: any) => ({
    id: p.id, name: p.name, description: p.description,
    price: Number(p.price), originalPrice: p.original_price ? Number(p.original_price) : undefined,
    category: p.category, images: p.images || [], colors: p.colors || [],
    sizes: p.sizes || [], inStock: p.in_stock, isNewArrival: p.is_new_arrival,
    isFastSelling: p.is_fast_selling, rating: Number(p.rating), reviews: p.reviews,
    createdAt: p.created_at,
  });

  const filtered = useMemo(() => {
    let result = dbProducts.map(mapProduct);
    if (filterParam === 'new') result = result.filter(p => p.isNewArrival);
    if (filterParam === 'fast') result = result.filter(p => p.isFastSelling);
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedSize) result = result.filter(p => p.sizes.includes(selectedSize));
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return result;
  }, [dbProducts, search, sortBy, selectedCategory, selectedSize, priceRange, filterParam]);

  const allSizes = [...new Set(dbProducts.flatMap(p => p.sizes || []))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">
        {filterParam === 'new' ? 'New Arrivals' : filterParam === 'fast' ? 'Fast Selling' : selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Shop' : 'Our Collection'}
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm">
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm hover:bg-muted transition-colors sm:hidden">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={`w-56 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <div>
            <h3 className="font-semibold text-foreground mb-2 text-sm">Category</h3>
            <div className="space-y-1">
              <button onClick={() => setSelectedCategory('')} className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}>All</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}>{cat.name}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2 text-sm">Size</h3>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setSelectedSize('')} className={`px-2 py-1 rounded text-xs border transition-colors ${!selectedSize ? 'bg-primary text-primary-foreground border-primary' : 'border-input text-foreground hover:bg-muted'}`}>All</button>
              {allSizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`px-2 py-1 rounded text-xs border transition-colors ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-input text-foreground hover:bg-muted'}`}>{size}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2 text-sm">Price Range</h3>
            <input type="range" min={0} max={15000} step={500} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full accent-primary" />
            <p className="text-xs text-muted-foreground mt-1">Up to ₹{priceRange[1].toLocaleString()}</p>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="text-center py-16"><p className="text-muted-foreground">Loading products...</p></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16"><p className="text-muted-foreground">No products found. Try adjusting your filters.</p></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
