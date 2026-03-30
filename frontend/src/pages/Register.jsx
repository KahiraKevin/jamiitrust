import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '', password: '', first_name: '', last_name: '', role: 'BUYER'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register/', formData);
            navigate('/login'); // Redirect to login on success
        } catch (err) {
            setError('Registration failed. Email may already be in use.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Account Type</label>
                        <select 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="BUYER">I want to Buy (Hire)</option>
                            <option value="SELLER">I want to Sell (Work)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700">
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <p className="text-gray-600">Already have an account? <Link to="/login" className="text-brand-600 font-medium">Login</Link></p>
                </div>
            </div>
        </div>
    );
}