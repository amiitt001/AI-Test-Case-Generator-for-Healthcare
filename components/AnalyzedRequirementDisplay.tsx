import React from 'react';
import type { AnalyzedRequirement } from '../types';

interface AnalyzedRequirementDisplayProps {
  data: AnalyzedRequirement;
}

const riskColorMap = {
  Low: 'bg-green-500 text-green-900',
  Medium: 'bg-yellow-400 text-yellow-900',
  High: 'bg-red-500 text-red-900',
};

const AnalyzedRequirementDisplay: React.FC<AnalyzedRequirementDisplayProps> = ({ data }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">2. Analyzed Requirement</h2>
          <p className="text-sm font-medium text-sky-400">{data.requirement_id}</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Risk Classification</p>
            <span className={`px-2.5 py-1 text-sm font-bold rounded-full ${riskColorMap[data.risk_classification]}`}>
                {data.risk_classification}
            </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-300 mb-2">Original Requirement Text</h3>
        <p className="text-slate-400 text-sm bg-slate-900/50 p-3 rounded-md border border-slate-700">{data.requirement_text}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="font-semibold text-slate-300 mb-2">Key Validation Points</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
            {data.validation_points.map((point, index) => (
                <li key={index}>{point}</li>
            ))}
            </ul>
        </div>
        
        <div>
            <h3 className="font-semibold text-slate-300 mb-2">Regulatory References</h3>
            <div className="flex flex-wrap gap-2">
            {data.regulatory_references.map((ref, index) => (
                <span key={index} className="bg-slate-700 text-sky-300 text-xs font-medium px-2.5 py-1 rounded-full">
                {ref}
                </span>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzedRequirementDisplay;
