import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product } from '@/data/products';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, size: string, color: string, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.selectedSize === size && i.selectedColor === color
        ? { ...i, quantity: qty }
        : i
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
