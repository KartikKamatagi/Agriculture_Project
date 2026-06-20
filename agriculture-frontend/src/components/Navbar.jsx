import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, User, Sprout, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="bg-green-600 p-1.5 rounded-lg">
          <Sprout size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent tracking-tight">
          FarmerDirect
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Market</Link>
        <Link to="/contact" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Contact</Link>
        
        {user ? (
          <>
            {user.is_farmer && (
              <Link to="/farmer-dashboard" className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 font-medium transition-colors">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}
            {!user.is_farmer && (
              <Link to="/cart" className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 font-medium transition-colors">
                <ShoppingCart size={18} />
                <span>Cart</span>
              </Link>
            )}
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-900 leading-none">{user.username}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{user.is_farmer ? 'Farmer' : 'Customer'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-gray-600 font-medium hover:text-green-600 transition-colors">Login</Link>
            <Link to="/register" className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-sm shadow-green-200 transition-all active:scale-95">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
