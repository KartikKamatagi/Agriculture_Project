import React, { useState } from 'react';
import { ShoppingCart, User, Package, Check, Star, MapPin, Leaf, Minus, Plus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useAuth();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Mock data for realism since backend doesn't have these fields yet
  const rating = (4 + (product.id % 10) / 10).toFixed(1);
  const location = product.id % 2 === 0 ? "Nashik, Maharashtra" : "Ratnagiri, Maharashtra";
  const isOrganic = product.id % 2 === 0;
  const isFresh = product.id % 3 === 0;
  const unit = product.category_name?.toLowerCase().includes('grain') || product.category_name?.toLowerCase().includes('veg') ? 'kg' : 'pc';

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const incrementQty = () => {
    if (quantity < product.quantity_available) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <Package size={64} strokeWidth={1} />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOrganic && (
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Leaf size={10} fill="currentColor" />
              Organic
            </span>
          )}
          {isFresh && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Zap size={10} fill="currentColor" />
              Fresh Today
            </span>
          )}
        </div>

        {/* Rating Floating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl shadow-sm flex items-center gap-1 border border-gray-100">
          <Star size={12} className="text-yellow-400" fill="currentColor" />
          <span className="text-xs font-bold text-gray-900">{rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-green-700 transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-green-600">₹{product.price}</span>
            <span className="text-xs font-bold text-gray-400 capitalize">/ {unit}</span>
          </div>
        </div>

        {/* Farmer & Location Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 group/farmer">
            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <User size={12} strokeWidth={3} />
            </div>
            <span className="text-xs font-bold text-gray-600">
              👨‍🌾 by <span className="text-gray-900">{product.farmer_details?.username}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <MapPin size={12} strokeWidth={3} />
            </div>
            <span className="text-xs font-bold text-gray-500">{location}</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-6">
          {product.quantity_available > 0 ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className={product.quantity_available < 10 ? 'text-orange-500' : 'text-gray-400'}>
                  {product.quantity_available < 10 ? `Only ${product.quantity_available} left!` : 'In Stock'}
                </span>
                <span className="text-gray-400">{product.quantity_available} units</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${product.quantity_available < 10 ? 'bg-orange-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((product.quantity_available / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Out of Stock</span>
          )}
        </div>

        {/* Interaction Section */}
        {!(user?.is_farmer && user?.id === product.farmer) && (
          <div className="mt-auto space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <button 
                onClick={decrementQty}
                disabled={quantity <= 1 || isAdded}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-600 hover:text-green-600 hover:border-green-100 transition-all disabled:opacity-30"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="font-black text-gray-900">{quantity}</span>
              <button 
                onClick={incrementQty}
                disabled={quantity >= product.quantity_available || isAdded}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-600 hover:text-green-600 hover:border-green-100 transition-all disabled:opacity-30"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.quantity_available === 0 || isAdded}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl ${
                isAdded 
                ? 'bg-green-600 text-white shadow-green-200' 
                : 'bg-gray-900 hover:bg-black text-white shadow-gray-200 hover:shadow-gray-300'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={20} strokeWidth={3} />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={20} strokeWidth={2.5} />
                  <span>Add to Cart 🛒</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {user?.is_farmer && user.id === product.farmer && (
           <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-center text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">
              My Listing
           </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
