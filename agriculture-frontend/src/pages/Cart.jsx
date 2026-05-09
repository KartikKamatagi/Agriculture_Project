import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, CreditCard, ChevronRight, MapPin, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, fetchCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingAddress) return;
    
    setIsCheckingOut(true);
    try {
      await api.post('marketplace/orders/', { shipping_address: shippingAddress });
      setOrderSuccess(true);
      fetchCart(); // Clear cart state
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl shadow-green-900/5 max-w-lg border border-green-50">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8">
            Thank you for supporting our local farmers! Your order has been placed and is being processed. 
            Redirecting you to the market...
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all"
          >
            Back to Market
          </button>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalPrice = items.reduce((sum, item) => sum + (item.product_details.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <div className="bg-gray-100/50 p-8 rounded-full mb-6 text-gray-300">
           <ShoppingBag size={64} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any harvest yet.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full py-12 px-6 md:px-12">
      <h1 className="text-4xl font-black text-gray-900 mb-12 tracking-tight">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-100 hover:border-green-100 transition-all">
              <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                {item.product_details.image && (
                  <img 
                    src={`http://localhost:8000${item.product_details.image}`} 
                    alt={item.product_details.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900">{item.product_details.name}</h3>
                <p className="text-gray-500 text-sm mb-1">{item.product_details.category_name}</p>
                <p className="text-green-600 font-bold">₹{item.product_details.price} per unit</p>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Qty</span>
                  <span className="text-lg font-black text-gray-900">{item.quantity}</span>
                </div>
                <div className="h-10 w-px bg-gray-100 hidden sm:block"></div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-1">Subtotal</span>
                  <span className="text-lg font-black text-gray-900">₹{(item.product_details.price * item.quantity).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/20 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-6">Order Summary</h2>
            
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium pb-4">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-4 border-t border-gray-50">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  Shipping Address
                </label>
                <textarea
                  required
                  rows="3"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                  placeholder="Enter your street address, city, and zip..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isCheckingOut}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {isCheckingOut ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Checkout Now</span>
                    <ChevronRight size={20} className="ml-2 opacity-50" />
                  </>
                )}
              </button>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl text-[11px] text-green-700 font-semibold leading-relaxed">
                 <AlertCircle size={16} className="flex-shrink-0" />
                 By placing this order, you are supporting local agriculture directly. Farmers will be notified immediately.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
