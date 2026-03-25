export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
  isNewArrival?: boolean;
  isFastSelling?: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  customerName: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  paymentId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: '2', name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop' },
  { id: '3', name: 'Teens', slug: 'teens', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop' },
  { id: '4', name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop' },
  { id: '5', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop' },
];

export const products: Product[] = [
  {
    id: '1', name: 'Royal Silk Saree', description: 'Handwoven pure silk saree with intricate golden zari work. Perfect for weddings and festive occasions.', price: 4999, originalPrice: 7999, category: 'women', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop'], colors: ['Red', 'Gold', 'Maroon'], sizes: ['Free Size'], inStock: true, isNewArrival: true, rating: 4.8, reviews: 124, createdAt: '2024-01-15',
  },
  {
    id: '2', name: 'Premium Cotton Kurta', description: 'Breathable cotton kurta with elegant embroidery. Comfortable for everyday wear.', price: 1299, originalPrice: 1999, category: 'men', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'], colors: ['White', 'Blue', 'Beige'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, isFastSelling: true, rating: 4.5, reviews: 89, createdAt: '2024-02-01',
  },
  {
    id: '3', name: 'Designer Lehenga Set', description: 'Stunning designer lehenga with heavy embroidery and dupatta. A showstopper for any celebration.', price: 8999, originalPrice: 14999, category: 'women', images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop'], colors: ['Pink', 'Red', 'Blue'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, isNewArrival: true, rating: 4.9, reviews: 56, createdAt: '2024-03-01',
  },
  {
    id: '4', name: 'Linen Casual Shirt', description: 'Premium linen shirt for a smart casual look. Lightweight and stylish.', price: 899, originalPrice: 1499, category: 'men', images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop'], colors: ['White', 'Sky Blue', 'Olive'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, rating: 4.3, reviews: 67, createdAt: '2024-01-20',
  },
  {
    id: '5', name: 'Embroidered Anarkali', description: 'Floor-length anarkali suit with mirror work and lace detailing.', price: 3499, originalPrice: 5499, category: 'women', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'], colors: ['Teal', 'Maroon', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, isFastSelling: true, rating: 4.7, reviews: 93, createdAt: '2024-02-15',
  },
  {
    id: '6', name: 'Kids Party Dress', description: 'Adorable party dress for little ones with tulle skirt and bow detailing.', price: 799, originalPrice: 1299, category: 'kids', images: ['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop'], colors: ['Pink', 'White', 'Lavender'], sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'], inStock: true, isNewArrival: true, rating: 4.6, reviews: 45, createdAt: '2024-03-10',
  },
  {
    id: '7', name: 'Silk Dupatta', description: 'Pure silk dupatta with hand-printed block patterns. A versatile accessory.', price: 599, originalPrice: 999, category: 'accessories', images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop'], colors: ['Red', 'Yellow', 'Green'], sizes: ['Free Size'], inStock: true, rating: 4.4, reviews: 78, createdAt: '2024-02-20',
  },
  {
    id: '8', name: 'Teen Denim Jacket', description: 'Trendy denim jacket with patches. Perfect for the young and stylish.', price: 1599, originalPrice: 2499, category: 'teens', images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop'], colors: ['Blue', 'Black'], sizes: ['S', 'M', 'L'], inStock: true, isFastSelling: true, rating: 4.2, reviews: 34, createdAt: '2024-01-25',
  },
  {
    id: '9', name: 'Banarasi Silk Saree', description: 'Traditional Banarasi silk with gold and silver threadwork. Timeless elegance.', price: 6999, originalPrice: 11999, category: 'women', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'], colors: ['Purple', 'Green', 'Red'], sizes: ['Free Size'], inStock: true, rating: 4.9, reviews: 201, createdAt: '2024-03-05',
  },
  {
    id: '10', name: 'Ethnic Sherwani', description: 'Regal sherwani with intricate embroidery for weddings and special events.', price: 5999, originalPrice: 9999, category: 'men', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'], colors: ['Ivory', 'Gold', 'Maroon'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, isNewArrival: true, rating: 4.8, reviews: 67, createdAt: '2024-03-15',
  },
  {
    id: '11', name: 'Cotton Palazzo Set', description: 'Comfortable cotton palazzo set with printed top. Ideal for casual outings.', price: 999, originalPrice: 1599, category: 'women', images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop'], colors: ['Yellow', 'Blue', 'Green'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, rating: 4.3, reviews: 112, createdAt: '2024-02-10',
  },
  {
    id: '12', name: 'Handloom Stole', description: 'Artisan-crafted handloom stole with traditional motifs. Eco-friendly fashion.', price: 449, originalPrice: 799, category: 'accessories', images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop'], colors: ['Mustard', 'Indigo', 'Coral'], sizes: ['Free Size'], inStock: true, rating: 4.5, reviews: 56, createdAt: '2024-01-30',
  },
];

export const banners: Banner[] = [
  { id: '1', title: 'Grand Summer Sale', subtitle: 'Up to 50% off on all collections', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop', link: '/shop' },
  { id: '2', title: 'New Arrivals', subtitle: 'Discover the latest trends in ethnic wear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=400&fit=crop', link: '/shop?filter=new' },
];

export const coupons: Coupon[] = [
  { id: '1', code: 'WELCOME20', discount: 20, expiresAt: '2025-12-31', isActive: true },
  { id: '2', code: 'FESTIVE15', discount: 15, expiresAt: '2025-06-30', isActive: true },
];

export const sampleOrders: Order[] = [
  { id: 'ORD-001', userId: '1', items: [], total: 6298, status: 'delivered', customerName: 'Priya Sharma', address: '123 MG Road, Mumbai', phone: '9876543210', email: 'priya@email.com', createdAt: '2024-03-01' },
  { id: 'ORD-002', userId: '2', items: [], total: 8999, status: 'shipped', customerName: 'Rahul Verma', address: '456 Park Street, Delhi', phone: '9876543211', email: 'rahul@email.com', createdAt: '2024-03-10' },
  { id: 'ORD-003', userId: '3', items: [], total: 1299, status: 'pending', customerName: 'Anita Desai', address: '789 Lake Road, Bangalore', phone: '9876543212', email: 'anita@email.com', createdAt: '2024-03-15' },
];
