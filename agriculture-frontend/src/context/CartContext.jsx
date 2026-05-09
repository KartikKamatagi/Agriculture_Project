import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user || user.is_farmer) return;
    setLoading(true);
    try {
      const response = await api.get('marketplace/cart/');
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }
    try {
      await api.post('marketplace/cart/add-item/', { product_id: product.id, quantity });
      fetchCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`marketplace/cart/remove-item/${itemId}/`);
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
