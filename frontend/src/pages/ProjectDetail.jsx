import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { CheckCircle, Lock, Play, AlertCircle, Clock, ChevronRight } from 'lucide-react';
// import DisputeModal from '../components/DisputeModal'; // Uncomment if you have this
// import StatusStepper from '../components/StatusStepper'; // Uncomment if you have this

export default function ProjectDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/projects/${id}/`);
            setProject(res.data);
        } catch (error) {
            console.error(error);
            alert("Error fetching project");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const handleAction = async (milestoneId, action) => {
        let confirmMsg = "";
        
        if (action === 'fund') confirmMsg = "Confirm to activate this milestone? (Funds are already in Escrow)";
        if (action === 'submit') confirmMsg = "Are you sure you want to submit this work?";
        if (action === 'approve') confirmMsg = "Are you sure? This will RELEASE funds to the seller immediately.";

        if(!window.confirm(confirmMsg)) return;

        try {
            // ⚡️ FIX: Use the standard DRF URL structure
            // If action is 'approve', the endpoint is likely 'approve'
            // If action is 'fund', the endpoint is likely 'fund'
            await api.post(`/milestones/${milestoneId}/${action}/`);
            fetchProject(); // Refresh data
        } catch (error) {
            alert(error.response?.data?.error || "Action failed");
        }
    };

    const openDispute = (milestoneId) => {
        setSelectedMilestoneId(milestoneId);
        setShowDisputeModal(true);
    };

    const getTimeRemaining = (dateString) => {
        if (!dateString) return null;
        const total = Date.parse(dateString) - Date.parse(new Date());
        if (total <= 0) return "Release Imminent";
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        return `${days}d ${hours}h remaining`;
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">Loading Project...</div>;
    if (!project) return <div className="p-10 text-center text-red-500">Project not found</div>;

    const isBuyer = user?.role === 'BUYER';
    const isSeller = user?.role === 'SELLER'; // or 'FREELANCER'

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            {/* Header Card */}
            <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                            <p className="mt-1 text-gray-600">{project.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase
                            ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {project.status}
                        </span>
                    </div>
                </div>
                <div className="px-6 py-5 bg-white">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Buyer</dt>
                            <dd className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-2">
                                    {project.buyer?.first_name?.charAt(0) || 'B'}
                                </div>
                                {project.buyer?.first_name} {project.buyer?.last_name}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Seller</dt>
                            <dd className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold mr-2">
                                    {project.seller?.first_name?.charAt(0) || 'S'}
                                </div>
                                {project.seller 
                                    ? `${project.seller.first_name} ${project.seller.last_name}` 
                                    : <span className="text-gray-400 italic">Unassigned</span>}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Interactive Milestones */}
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold text-gray-800">Escrow Milestones</h3>
                <span className="text-sm text-gray-500">Total Budget: <span className="font-bold text-gray-900">KES {parseFloat(project.budget).toLocaleString()}</span></span>
            </div>
            
            <div className="space-y-4">
                {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden transition hover:shadow-md">
                        {/* Milestone Header */}
                        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-bold text-gray-800">{milestone.description}</h4>
                                    {/* Status Badge */}
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                                        ${milestone.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                                          milestone.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                          milestone.status === 'FUNDED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                          'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                        {milestone.status}
                                    </span>
                                </div>
                                <p className="text-brand-600 font-bold text-lg mt-1">
                                    KES {Number(milestone.amount).toLocaleString()}
                                </p>
                            </div>

                            {/* Auto-Release Timer Badge */}
                            {milestone.status === 'SUBMITTED' && (
                                <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center border border-orange-100">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Auto-Release: {getTimeRemaining(milestone.auto_release_date)}
                                </div>
                            )}
                        </div>

                        {/* Actions Footer */}
                        <div className="px-6 py-4 bg-gray-50 flex flex-wrap justify-end items-center gap-3 border-t border-gray-100">
                            
                            {/* 1. BUYER: Activate Milestone (If Pending) */}
                            {isBuyer && milestone.status === 'PENDING' && (
                                <button onClick={() => handleAction(milestone.id, 'fund')} 
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all">
                                    <Lock className="w-4 h-4 mr-2" /> Activate Milestone
                                </button>
                            )}
                            
                            {/* 2. SELLER: Submit Work (If Funded) */}
                            {isSeller && milestone.status === 'FUNDED' && (
                                <button onClick={() => handleAction(milestone.id, 'submit')} 
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                                    <Play className="w-4 h-4 mr-2" /> Submit Work
                                </button>
                            )}
                            
                            {/* 3. BUYER: Release Funds (If Submitted) */}
                            {isBuyer && milestone.status === 'SUBMITTED' && (
                                <button onClick={() => handleAction(milestone.id, 'approve')} 
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm transition-all">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Release Payment
                                </button>
                            )}

                            {/* Milestone Complete */}
                            {milestone.status === 'PAID' && (
                                <span className="text-green-600 font-medium flex items-center text-sm">
                                    <CheckCircle className="w-4 h-4 mr-1" /> Payment Released
                                </span>
                            )}

                            {/* Dispute Logic */}
                            {(milestone.status === 'FUNDED' || milestone.status === 'SUBMITTED') && (
                                <button 
                                    onClick={() => openDispute(milestone.id)}
                                    className="text-gray-400 hover:text-red-600 text-sm font-medium flex items-center px-3 py-2 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <AlertCircle className="w-4 h-4 mr-1" /> Report Issue
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dispute Modal (Optional) */}
            {/* {showDisputeModal && (
                <DisputeModal 
                    milestoneId={selectedMilestoneId} 
                    onClose={() => setShowDisputeModal(false)}
                    onSuccess={() => {
                        setShowDisputeModal(false);
                        fetchProject();
                    }}
                />
            )} */}
        </div>
    );
}