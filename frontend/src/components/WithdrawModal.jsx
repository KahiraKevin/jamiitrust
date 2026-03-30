import { useState } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import api from '../api';

export default function WithdrawModal({ isOpen, onClose }) {
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await api.post('/wallets/withdraw/', { 
                amount: parseFloat(amount),
                phone_number: phone
            });
            setMessage("Withdrawal successful! Funds sent to your phone.");
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Withdrawal failed. Check balance.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
                {/* Header */}
                <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Withdraw Funds</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {message ? (
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center mb-4">
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number (For Receipt)
                                </label>
                                <input
                                    type="text"
                                    placeholder="2547..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount to Withdraw (KES)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50 flex justify-center items-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Withdrawal'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}