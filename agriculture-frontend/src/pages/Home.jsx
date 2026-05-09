import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { Search, Filter, Leaf, ChevronRight, Star, ArrowRight, SlidersHorizontal, Package, Loader2, Zap, MapPin } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(2000);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('marketplace/products/'),
          api.get('marketplace/categories/')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Failed to fetch products/categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = parseFloat(product.price) <= priceRange;
    const matchesOrganic = !onlyOrganic || (product.id % 2 === 0); // Mock organic logic
    return matchesCategory && matchesSearch && matchesPrice && matchesOrganic;
  });

  const Skeleton = () => (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
        <div className="h-6 bg-gray-100 rounded-full w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-50 rounded-full w-full" />
          <div className="h-3 bg-gray-50 rounded-full w-5/6" />
        </div>
        <div className="h-12 bg-gray-100 rounded-2xl w-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Modern Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-green-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-orange-50 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-100/50 text-green-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-green-200/50">
              <Leaf size={14} fill="currentColor" />
              Direct from local farms
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Eat Fresh, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
                Support Farmers
              </span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
              Connect directly with farmers for the freshest, organic produce.
              Cut out the middlemen and bring transparent goodness to your kitchen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  className="block w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-3xl text-gray-900 text-lg shadow-xl shadow-gray-200/50 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-200 transition-all placeholder:text-gray-400"
                  placeholder="What are you craving today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-8 py-5 rounded-3xl font-black transition-all ${showFilters ? 'bg-green-600 text-white' : 'bg-white border border-gray-100 text-gray-900 shadow-xl'}`}
              >
                <SlidersHorizontal size={20} />
                Filters
              </button>
            </div>

            {/* Floating Trust Badges */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span className="text-gray-900">500+</span> Local Farmers
                </div>
              </div>
              <div className="h-8 w-px bg-gray-100" />
              <div className="flex items-center gap-2">
                <Star size={14} className="text-yellow-400" fill="currentColor" />
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span className="text-gray-900">4.9/5</span> User Rating
                </div>
              </div>
            </div>
          </div>

          {/* Hero Decoration */}
          <div className="flex-1 w-full max-w-md hidden lg:block">
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-green-600 rounded-[80px] rotate-6 opacity-10 animate-pulse" />
              <div className="absolute inset-0 bg-green-100 rounded-[80px] -rotate-3 border-4 border-white shadow-2xl overflow-hidden">
                {/* Real hero image */}
                <img
                  src="/images/hero-farm.png"
                  alt="Organic Farm"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Element */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 flex items-center gap-4 animate-bounce-slow">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
                  <img src="/images/delivery-icon.png" alt="Delivery" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Express Delivery</div>
                  <div className="text-lg font-black text-gray-900 leading-none">Today, 5 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Filters Sidebar/TopBar Toggle */}
        {showFilters && (
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl mb-12 flex flex-col md:flex-row gap-12 animate-in slide-in-from-top duration-500">
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Price Range</h4>
                <span className="text-sm font-black text-green-600">Up to ₹{priceRange}</span>
              </div>
              <input
                type="range" min="0" max="5000" step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase">
                <span>₹0</span>
                <span>₹5000</span>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Market Preferences</h4>
              <div className="flex gap-4">
                <button
                  onClick={() => setOnlyOrganic(!onlyOrganic)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all font-bold ${onlyOrganic ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-100 text-gray-500'}`}
                >
                  <Leaf size={16} />
                  Organic Only
                </button>
                <div className="flex-1 bg-gray-50 p-4 rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed">
                  <span className="text-xs font-bold text-gray-400">Near Me (Coming Soon)</span>
                  <div className="w-8 h-4 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Navigation */}
        <div className="flex items-center gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-8 py-4 rounded-[20px] text-sm font-black transition-all whitespace-nowrap tracking-wide border-2 ${!selectedCategory ? 'bg-green-600 border-green-600 text-white shadow-xl shadow-green-200' : 'bg-white border-white text-gray-400 hover:border-gray-100 hover:text-gray-900'}`}
          >
            All Harvests
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-8 py-4 rounded-[20px] text-sm font-black transition-all whitespace-nowrap tracking-wide border-2 ${selectedCategory === category.id ? 'bg-green-600 border-green-600 text-white shadow-xl shadow-green-200' : 'bg-white border-white text-gray-400 hover:border-gray-100 hover:text-gray-900'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grid Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-black text-gray-900">Explore Items</h2>
            <span className="text-sm font-bold text-gray-400">({filteredProducts.length} items found)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-widest cursor-pointer hover:underline">
            Sort by: Recommended <Filter size={14} />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 animate-in fade-in duration-700">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
              <Package size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No harvests found</h3>
            <p className="text-gray-400 max-w-xs mx-auto mb-8">
              We couldn't find any products matching your search or filters. Try adjusting them!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setPriceRange(5000);
                setOnlyOrganic(false);
              }}
              className="bg-green-600 px-8 py-4 rounded-2xl text-white font-black hover:bg-green-700 transition-all active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Trust Footer */}
      <section className="bg-white py-20 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-center gap-4 p-8 bg-gray-50 rounded-[32px]">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600">
              <Leaf size={28} />
            </div>
            <div>
              <div className="font-black text-gray-900">100% Organic</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Natural & Pesticide Free</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-8 bg-gray-50 rounded-[32px]">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-600">
              <Zap size={28} />
            </div>
            <div>
              <div className="font-black text-gray-900">Fast Delivery</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Harvest to Home in 24h</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-8 bg-gray-50 rounded-[32px]">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
              <MapPin size={28} />
            </div>
            <div>
              <div className="font-black text-gray-900">Traceable Root</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Know Your Farmer</div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default Home;
