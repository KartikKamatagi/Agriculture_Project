import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Plus, ClipboardList, TrendingUp, Edit, Trash2, X, Upload } from 'lucide-react';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_available: '',
    category: '',
    image: ''
  });

  const fetchData = async () => {
    try {
      const [prodRes, orderRes, catRes] = await Promise.all([
        api.get('marketplace/products/'),
        api.get('marketplace/orders/'),
        api.get('marketplace/categories/')
      ]);
      // Filter products by current farmer (DRF should handle this, but let's be double sure if shared endpoint)
      setProducts(prodRes.data.filter(p => p.farmer_details.id === JSON.parse(localStorage.getItem('user')).id));
      setOrders(orderRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity_available: product.quantity_available,
      category: product.category,
      image: product.image
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`marketplace/products/${editingProduct.id}/`, formData);
      } else {
        await api.post('marketplace/products/', formData);
      }
      setShowAddModal(false);
      fetchData();
      setFormData({ name: '', description: '', price: '', quantity_available: '', category: '', image: '' });
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`marketplace/products/${id}/`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await api.patch(`marketplace/orders/${orderId}/`, { status: 'Completed' });
      fetchData();
    } catch (error) {
      console.error("Failed to complete order", error);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading dashboard...</div>;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full py-12 px-6 md:px-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Farmer Dashboard</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your harvests and track your sales</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Post New Harvest</span>
        </button>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Package size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Listings</p>
            <p className="text-3xl font-black text-gray-900">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm">
          <div className="bg-green-50 p-4 rounded-2xl text-green-600"><TrendingUp size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
            <p className="text-3xl font-black text-gray-900">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm">
          <div className="bg-orange-50 p-4 rounded-2xl text-orange-600"><ClipboardList size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Revenue</p>
            <p className="text-3xl font-black text-gray-900">₹{orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-2xl w-fit mb-8">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          My Products
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Received Orders
        </button>
      </div>

      {/* Content */}
      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all">
              <div className="h-48 bg-gray-50 relative">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                   <button 
                    onClick={() => handleEdit(product)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-600 hover:text-green-600 shadow-sm transition-colors border border-white"
                   >
                      <Edit size={16} />
                   </button>
                   <button 
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-600 hover:text-red-600 shadow-sm transition-colors border border-white"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{product.category_name}</p>
                  </div>
                  <span className="text-xl font-black text-green-600">₹{product.price}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between text-sm">
                   <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Stock Status</span>
                   <span className="font-extrabold text-gray-900">{product.quantity_available} units left</span>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center">
               <Package size={48} className="text-gray-200 mb-4" />
               <p className="text-gray-400 font-bold">You haven't listed any products yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-green-100 transition-all">
               <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-gray-50">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">Order #{order.id}</h3>
                    <p className="text-gray-500 text-sm font-medium">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                        {order.status}
                     </span>
                     <span className="text-2xl font-black text-gray-900">₹{order.total_price}</span>
                     {order.status === 'Pending' && (
                        <button 
                          onClick={() => completeOrder(order.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95"
                        >
                          Mark as Completed
                        </button>
                     )}
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</h4>
                    <div className="space-y-4">
                       {order.items?.map(item => (
                         <div key={item.id} className="flex justify-between items-center text-gray-700">
                            <span className="font-bold">{item.product_name} <span className="text-gray-400 font-medium">x {item.quantity}</span></span>
                            <span className="font-black text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl">
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Shipping/Contact Details</h4>
                     <p className="text-gray-700 font-medium leading-relaxed">{order.shipping_address}</p>
                  </div>
               </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="py-20 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center">
               <TrendingUp size={48} className="text-gray-200 mb-4" />
               <p className="text-gray-400 font-bold">No orders received yet. Harvests are coming!</p>
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/20">
           <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-gray-900">{editingProduct ? 'Edit Harvest' : 'Post New Harvest'}</h2>
                    <button onClick={() => { setShowAddModal(false); setEditingProduct(null); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                       <X size={24} />
                    </button>
                  </div>

                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                       <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" 
                        placeholder="e.g. Organic Tomatoes" 
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                       <select 
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                       >
                          <option value="">Select Category</option>
                          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Price per unit (₹)</label>
                       <input 
                        required 
                        type="number" 
                        step="0.01" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" 
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Quantity Available</label>
                       <input 
                        required 
                        type="number" 
                        value={formData.quantity_available}
                        onChange={(e) => setFormData({...formData, quantity_available: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" 
                       />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-700 mb-2">Product Image URL</label>
                       <input 
                         type="url" 
                         value={formData.image}
                         onChange={(e) => setFormData({...formData, image: e.target.value})}
                         className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" 
                         placeholder="https://images.unsplash.com/photo-..." 
                       />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                       <textarea 
                        required 
                        rows="3" 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" 
                        placeholder="Describe your harvest..."
                       ></textarea>
                    </div>
                    <div className="md:col-span-2 pt-4">
                       <button type="submit" className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-black rounded-3xl shadow-xl shadow-green-100 transition-all active:scale-95">
                          {editingProduct ? 'Update Listing' : 'Launch Market Listing'}
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
