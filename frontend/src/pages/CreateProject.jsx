import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Plus, Trash2, Save, User, AlertCircle } from 'lucide-react';

export default function CreateProject() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sellerEmail, setSellerEmail] = useState('');
    const [milestones, setMilestones] = useState([
        { description: 'Phase 1', amount: '' }
    ]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const addMilestone = () => {
        setMilestones([...milestones, { description: '', amount: '' }]);
    };

    const removeMilestone = (index) => {
        const newMilestones = milestones.filter((_, i) => i !== index);
        setMilestones(newMilestones);
    };

    const handleMilestoneChange = (index, field, value) => {
        const newMilestones = [...milestones];
        newMilestones[index][field] = value;
        setMilestones(newMilestones);
    };

    // 👇 Calculate Total Budget automatically
    const totalBudget = milestones.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 👇 CRITICAL: We send 'budget' and 'freelancer_email' to match the Backend
            await api.post('/projects/', {
                title,
                description,
                freelancer_email: sellerEmail, // Matches Serializer
                budget: totalBudget,           // Matches Serializer & View
                milestones
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            // Show the specific error from the backend (e.g., "Insufficient Funds")
            const errorMsg = err.response?.data?.error || 
                           JSON.stringify(err.response?.data) || 
                           "Failed to create project";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Transaction</h2>
            
            {/* Error Banner */}
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 font-medium text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Title</label>
                    <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                {/* Seller Assignment */}
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <label className="block text-sm font-medium text-blue-900 flex items-center">
                        <User className="w-4 h-4 mr-1"/> Assign Seller (Email)
                    </label>
                    <input 
                        type="email" 
                        placeholder="e.g. seller@test.com"
                        className="mt-1 block w-full rounded-md border-blue-200 shadow-sm p-2 border"
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        required
                    />
                    <p className="text-xs text-blue-700 mt-1">The seller must already be registered on Jamii Trust.</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
                        {/* Display Total Budget */}
                        <span className="text-lg font-bold text-brand-700">Total: KES {totalBudget.toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-4">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-md">
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        placeholder="Milestone Description"
                                        className="block w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm"
                                        value={milestone.description}
                                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-32">
                                    <input 
                                        type="number" 
                                        placeholder="Amount"
                                        className="block w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm"
                                        value={milestone.amount}
                                        onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                                        required
                                    />
                                </div>
                                {milestones.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeMilestone(index)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        type="button"
                        onClick={addMilestone}
                        className="mt-4 flex items-center text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Another Milestone
                    </button>
                </div>

                <div className="pt-6 flex justify-end">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {loading ? 'Creating...' : 'Create Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
}