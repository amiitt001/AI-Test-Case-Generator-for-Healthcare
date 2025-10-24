import React from 'react';
import type { WorkflowStep } from '../constants';
import { CheckCircleIcon, ChevronRightIcon } from './icons';

interface StepCardProps {
  stepData: WorkflowStep;
  isActive: boolean;
  isCompleted: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ stepData, isActive, isCompleted }) => {
  const { step, title, description, tools } = stepData;

  const statusIcon = isCompleted ? (
    <CheckCircleIcon className="w-6 h-6 text-green-400" />
  ) : isActive ? (
    <ChevronRightIcon className="w-6 h-6 text-sky-400 animate-pulse" />
  ) : (
    <div className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold text-sm">
      {step}
    </div>
  );

  return (
    <div 
        className={`p-4 rounded-lg border flex gap-4 transition-all duration-300 ${
            isActive ? 'bg-slate-700/50 border-sky-500 shadow-lg shadow-sky-900/50' : 
            isCompleted ? 'bg-slate-800/50 border-slate-700 opacity-70' :
            'bg-slate-800 border-slate-700 hover:bg-slate-700/50'
        }`}
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center mt-1">
        {statusIcon}
      </div>
      <div className="flex-grow">
        <h3 className={`font-bold ${isActive ? 'text-sky-300' : 'text-slate-200'}`}>{title}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
        <div className="flex items-center gap-4 mt-3">
          {tools.map((tool) => (
            <div key={tool.name} className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md text-xs text-slate-300">
              {tool.icon}
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepCard;
