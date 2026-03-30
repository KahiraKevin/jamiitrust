import { useState } from 'react';
import { X, Loader, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../api';

export default function DepositModal({ isOpen, onClose }) {
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('input'); // 'input' or 'processing'
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleDeposit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/wallets/deposit/', { 
                amount: parseFloat(amount),
                phone_number: phone 
            });
            // Move to "Processing" step instead of closing immediately
            setStep('processing');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to initiate deposit");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
                {/* Header */}
                <div className="bg-brand-900 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Deposit Funds</h3>
                    <button onClick={onClose} className="text-brand-200 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 'processing' ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800">Check your phone!</h4>
                            <p className="text-gray-600">
                                We've sent a prompt to <b>{phone}</b>. Please enter your M-PESA PIN to complete the transaction.
                            </p>
                            
                            <div className="pt-4">
                                <p className="text-sm text-gray-500 mb-3">Once you receive the M-PESA SMS, click below:</p>
                                <button 
                                    onClick={handleRefresh}
                                    className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition flex items-center justify-center space-x-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    <span>I Have Paid (Refresh Balance)</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleDeposit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    M-PESA Phone Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="2547XXXXXXXX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (KES)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg disabled:opacity-50 flex justify-center items-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin mr-2" />
                                        Sending Prompt...
                                    </>
                                ) : (
                                    'Initiate Payment'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}