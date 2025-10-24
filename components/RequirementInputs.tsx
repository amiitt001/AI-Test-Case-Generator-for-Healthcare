import React, { useState } from 'react';

interface RequirementInputProps {
  onSubmit: (requirement: string) => void;
  isLoading: boolean;
}

const RequirementInput: React.FC<RequirementInputProps> = ({ onSubmit, isLoading }) => {
  const [requirement, setRequirement] = useState('');
  
  const exampleRequirement = "The system shall allow authenticated clinicians to access patient electronic health records (EHR). Access must be logged for audit purposes in compliance with HIPAA. The system must encrypt patient data both in transit (using TLS 1.2 or higher) and at rest (using AES-256).";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirement.trim()) {
      onSubmit(requirement);
    }
  };
  
  const handleUseExample = () => {
    setRequirement(exampleRequirement);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">1. Enter Software Requirement</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Paste your software requirement here..."
          className="w-full h-48 p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-slate-300 resize-y"
          disabled={isLoading}
        />
        <div className="mt-4 flex items-center justify-between gap-4">
            <button
                type="button"
                onClick={handleUseExample}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                Use Example
            </button>
            <button
                type="submit"
                disabled={isLoading || !requirement.trim()}
                className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Analyzing...' : 'Analyze Requirement'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default RequirementInput;
