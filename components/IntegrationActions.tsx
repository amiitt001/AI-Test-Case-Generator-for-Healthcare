import React from 'react';
import { JiraIcon, AzureDevOpsIcon, CheckCircleIcon } from './icons';
import Spinner from './Spinner';

interface IntegrationActionsProps {
    onExportToJira: () => void;
    jiraStatus: 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR';
    onExportToAzureDevOps: () => void;
    azureDevOpsStatus: 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR';
}

const IntegrationActions: React.FC<IntegrationActionsProps> = ({ 
    onExportToJira, 
    jiraStatus,
    onExportToAzureDevOps,
    azureDevOpsStatus
}) => {
    
    const getButtonContent = (type: 'Jira' | 'AzureDevOps') => {
        const status = type === 'Jira' ? jiraStatus : azureDevOpsStatus;
        const icon = type === 'Jira' ? <JiraIcon className="w-5 h-5" /> : <AzureDevOpsIcon className="w-5 h-5" />;
        const name = type;

        switch (status) {
            case 'PENDING':
                return (
                    <>
                        <Spinner size="w-5 h-5" />
                        <span>Exporting to {name}...</span>
                    </>
                );
            case 'SUCCESS':
                return (
                    <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Export Successful</span>
                    </>
                );
             case 'ERROR':
                 return (
                    <>
                        {icon}
                        <span>Retry Export to {name}</span>
                    </>
                 );
            case 'IDLE':
            default:
                return (
                    <>
                        {icon}
                        <span>Export to {name}</span>
                    </>
                );
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100">4. ALM Integration</h3>
            <p className="text-sm text-slate-400 mt-1 mb-4">
                Push the generated test cases as new issues or work items to your ALM tool.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Jira Button */}
                <button
                    onClick={onExportToJira}
                    disabled={jiraStatus === 'PENDING' || jiraStatus === 'SUCCESS'}
                    className={`flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-md transition duration-150 disabled:cursor-not-allowed
                        ${jiraStatus === 'SUCCESS' ? 'bg-green-600/50 text-slate-200' : ''}
                        ${jiraStatus === 'PENDING' ? 'bg-sky-600/50 text-white disabled:opacity-70' : ''}
                        ${jiraStatus === 'IDLE' || jiraStatus === 'ERROR' ? 'bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500' : ''}
                        ${jiraStatus === 'ERROR' ? 'bg-red-600 hover:bg-red-500' : ''}
                    `}
                >
                    {getButtonContent('Jira')}
                </button>

                {/* Azure DevOps Button */}
                <button
                    onClick={onExportToAzureDevOps}
                    disabled={azureDevOpsStatus === 'PENDING' || azureDevOpsStatus === 'SUCCESS'}
                    className={`flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-md transition duration-150 disabled:cursor-not-allowed
                        ${azureDevOpsStatus === 'SUCCESS' ? 'bg-green-600/50 text-slate-200' : ''}
                        ${azureDevOpsStatus === 'PENDING' ? 'bg-sky-600/50 text-white disabled:opacity-70' : ''}
                        ${azureDevOpsStatus === 'IDLE' || azureDevOpsStatus === 'ERROR' ? 'bg-sky-700 text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500' : ''}
                        ${azureDevOpsStatus === 'ERROR' ? 'bg-red-600 hover:bg-red-500' : ''}
                    `}
                >
                    {getButtonContent('AzureDevOps')}
                </button>
            </div>
            
            {(jiraStatus === 'SUCCESS' || azureDevOpsStatus === 'SUCCESS') && (
                 <p className="text-xs text-green-400 mt-3 text-center">Export complete. Check the status on each card below for details.</p>
            )}
        </div>
    );
};

export default IntegrationActions;
