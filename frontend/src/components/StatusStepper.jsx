import { CheckCircle, Lock, Play, DollarSign, AlertCircle } from 'lucide-react';

const steps = [
  { id: 'PENDING', label: 'Contract', icon: CheckCircle },
  { id: 'FUNDED', label: 'Escrow Locked', icon: Lock },
  { id: 'SUBMITTED', label: 'Work Done', icon: Play },
  { id: 'PAID', label: 'Released', icon: DollarSign },
];

export default function StatusStepper({ currentStatus }) {
  const getStepStatus = (stepId) => {
    const statusOrder = ['PENDING', 'FUNDED', 'SUBMITTED', 'PAID'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentStatus === 'DISPUTED') return 'error'; 
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  if (currentStatus === 'DISPUTED') {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-center text-red-700 mb-4 animate-pulse">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span className="font-bold text-sm">Transaction Frozen: Dispute in Progress</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />

        {steps.map((step) => {
          const status = getStepStatus(step.id);
          let circleClass = "bg-gray-100 text-gray-400 border-2 border-gray-200";
          let textClass = "text-gray-400";

          if (status === 'completed') {
            circleClass = "bg-green-600 text-white border-green-600";
            textClass = "text-green-600 font-medium";
          } else if (status === 'active') {
            circleClass = "bg-brand-600 text-white border-brand-600 ring-4 ring-brand-100";
            textClass = "text-brand-700 font-bold";
          }

          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${circleClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-2 uppercase tracking-wide font-semibold ${textClass}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}