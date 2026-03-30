import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Wallet, ArrowUpRight, Plus, Minus, Lock } from 'lucide-react';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

export default function WalletCard() {
    const { user, refreshUser } = useContext(AuthContext); // Get refreshUser to keep data fresh
    const [showBalance, setShowBalance] = useState(true);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    // Auto-refresh balance when this component loads
    useEffect(() => {
        if (refreshUser) refreshUser();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(amount);
    };

    return (
        <>
            <div className="bg-brand-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden border border-brand-800">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-24 h-24 bg-brand-500 opacity-20 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2 text-brand-100">
                            <Wallet className="w-5 h-5" />
                            <span className="text-sm font-medium tracking-wide">Jamii Wallet</span>
                        </div>
                        <button 
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-brand-200 hover:text-white transition p-1 rounded-md hover:bg-brand-800"
                            title={showBalance ? "Hide Balance" : "Show Balance"}
                        >
                            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Main Balance Display */}
                    <div className="mb-6">
                        <p className="text-xs text-brand-200 font-medium uppercase tracking-wider mb-1">Available Funds</p>
                        <h2 className="text-4xl font-bold tracking-tight text-white">
                            {showBalance 
                                ? formatCurrency(user?.wallet_balance || 0) 
                                : '••••••'}
                        </h2>
                    </div>

                    {/* 👇 NEW: Escrow Balance Display */}
                    <div className="mb-6 p-3 bg-brand-800 bg-opacity-60 rounded-lg flex items-center justify-between border border-brand-700 backdrop-blur-sm">
                        <div className="flex items-center space-x-2.5">
                            <div className="bg-yellow-500/20 p-1.5 rounded-full">
                                <Lock className="w-3.5 h-3.5 text-yellow-400" />
                            </div>
                            <span className="text-sm text-brand-100 font-medium">Held in Escrow</span>
                        </div>
                        <span className="font-mono font-semibold text-white tracking-wide">
                            {showBalance 
                                ? formatCurrency(user?.escrow_balance || 0) 
                                : '••••••'}
                        </span>
                    </div>

                    {/* DYNAMIC ACTION BUTTONS */}
                    <div className="flex space-x-3">
                        {user?.role === 'BUYER' ? (
                            <>
                                {/* BUYER: Needs to Deposit (Primary) and Withdraw (Secondary) */}
                                <button
                                    onClick={() => setIsDepositModalOpen(true)}
                                    className="flex-1 bg-white text-brand-900 py-2.5 px-4 rounded-lg font-bold hover:bg-brand-50 transition flex items-center justify-center space-x-2 shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Deposit</span>
                                </button>
                                <button
                                    onClick={() => setIsWithdrawModalOpen(true)}
                                    className="flex-1 bg-brand-800 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-brand-700 transition flex items-center justify-center space-x-2 border border-brand-700"
                                >
                                    <Minus className="w-4 h-4" />
                                    <span>Withdraw</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* SELLER: Only needs to Withdraw Earnings (Primary) */}
                                <button
                                    onClick={() => setIsWithdrawModalOpen(true)}
                                    className="w-full bg-white text-brand-900 py-3 px-4 rounded-lg font-bold hover:bg-brand-50 transition flex items-center justify-center space-x-2 shadow-sm"
                                >
                                    <ArrowUpRight className="w-5 h-5" />
                                    <span>Withdraw Earnings</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals are rendered here but hidden until triggered */}
            <DepositModal 
                isOpen={isDepositModalOpen} 
                onClose={() => setIsDepositModalOpen(false)} 
            />
            <WithdrawModal 
                isOpen={isWithdrawModalOpen} 
                onClose={() => setIsWithdrawModalOpen(false)} 
            />
        </>
    );
}