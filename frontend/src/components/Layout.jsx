import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, ShieldCheck } from 'lucide-react';
import NotificationBell from './NotificationBell'; // <--- Imported here

export default function Layout() {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Dynamic Logo Link: Goes to Dashboard if logged in, Landing Page if not */}
                            <Link to={user ? "/dashboard" : "/"} className="flex items-center hover:opacity-80 transition">
                                <ShieldCheck className="h-8 w-8 text-brand-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">Jamii Trust</span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-brand-600 hidden sm:block">
                                        Dashboard
                                    </Link>
                                    
                                    {/* --- NOTIFICATION BELL --- */}
                                    <div className="flex items-center">
                                        <NotificationBell />
                                    </div>

                                    {/* User Profile & Logout */}
                                    <div className="flex items-center border-l border-gray-200 pl-4 ml-2 space-x-4">
                                        <span className="text-sm text-gray-500 hidden sm:block">
                                            {user.first_name}
                                        </span>
                                        <button 
                                            onClick={logout}
                                            className="p-2 text-gray-500 hover:text-red-600 transition"
                                            title="Logout"
                                        >
                                            <LogOut className="h-5 w-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition">
                                        Log in
                                    </Link>
                                    <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 transition shadow-sm">
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Jamii Trust. Securing Kenya's Digital Economy.
                </div>
            </footer>
        </div>
    );
}