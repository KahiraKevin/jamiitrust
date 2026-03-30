import { useState } from 'react';
import api from '../api';
import { X, AlertTriangle } from 'lucide-react';

export default function DisputeModal({ milestoneId, onClose, onSuccess }) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/disputes/', {
                milestone: milestoneId,
                reason: reason
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Failed to raise dispute");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-red-600 flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-2" /> Raise Dispute
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Raising a dispute will <strong>freeze the funds</strong> for this milestone immediately. An Admin will review the case.
                </p>

                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-red-500 focus:border-red-500"
                        rows={4}
                        placeholder="Describe the issue (e.g. Seller stopped responding, Work not delivered as agreed...)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    />
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Freeze Funds'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}