import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import WalletCard from '../components/WalletCard';
import ProjectList from '../components/ProjectList';

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar: Wallet */}
            <div className="md:col-span-1 space-y-6">
                <WalletCard />
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">My Profile</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Name:</span> {user?.first_name} {user?.last_name}</p>
                        <p><span className="font-medium">Role:</span> {user?.role}</p>
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Welcome, {user?.first_name}!
                        </h2>
                        <p className="text-gray-500">Here are your active transactions.</p>
                    </div>
                    
                    {user?.role === 'BUYER' && (
                        <Link 
                            to="/projects/create"
                            className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition shadow-sm"
                        >
                            + New Transaction
                        </Link>
                    )}
                </div>

                {/* Project List */}
                <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Your Transactions</h3>
                    </div>
                    <ProjectList />
                </div>
            </div>
        </div>
    );
}