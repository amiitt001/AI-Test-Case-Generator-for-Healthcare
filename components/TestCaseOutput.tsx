import React from 'react';
import type { TestCase } from '../type';
import type { JiraIntegrationResult } from '../services/jiraService';
import type { AzureDevOpsIntegrationResult } from '../services/azureDevOpsService';
import { ArrowDownTrayIcon, LinkIcon } from './icons';

interface TestCaseOutputProps {
  testCases: TestCase[];
  jiraResults: JiraIntegrationResult;
  azureDevOpsResults: AzureDevOpsIntegrationResult;
}

const TestCaseOutput: React.FC<TestCaseOutputProps> = ({ testCases, jiraResults, azureDevOpsResults }) => {

    const getScoreColor = (score: number) => {
        if (score >= 95) return 'bg-green-500 text-green-900';
        if (score >= 90) return 'bg-yellow-400 text-yellow-900';
        return 'bg-orange-400 text-orange-900';
    }

    const triggerDownload = (content: string, fileName: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportJSON = () => {
        const jsonString = JSON.stringify(testCases, null, 2);
        triggerDownload(jsonString, 'test-cases.json', 'application/json');
    };

    const handleExportCSV = () => {
        const header = [
            'test_case_id',
            'linked_requirement',
            'objective',
            'test_steps',
            'expected_result',
            'compliance_reference',
            'traceability_score'
        ];

        const escapeCsvField = (field: string | number): string => {
            const str = String(field);
            if (/[",\n]/.test(str)) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows = testCases.map(tc => [
            escapeCsvField(tc.test_case_id),
            escapeCsvField(tc.linked_requirement),
            escapeCsvField(tc.objective),
            escapeCsvField(tc.test_steps.join('\n')),
            escapeCsvField(tc.expected_result),
            escapeCsvField(tc.compliance_reference.join(', ')),
            tc.traceability_score
        ].join(','));

        const csvString = [header.join(','), ...rows].join('\n');
        triggerDownload(csvString, 'test-cases.csv', 'text/csv;charset=utf-8;');
    };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-100">3. Generated Test Cases</h2>
            {testCases.length > 0 && (
                <div className="flex gap-2">
                    <button
                        onClick={handleExportJSON}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>JSON</span>
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>CSV</span>
                    </button>
                </div>
            )}
        </div>
      {testCases.map((tc, index) => {
        const jiraResult = jiraResults[tc.test_case_id];
        const adoResult = azureDevOpsResults[tc.test_case_id];
        const hasIntegrationResults = jiraResult || adoResult;

        return (
            <div key={index} className="bg-slate-800 p-6 rounded-lg border border-slate-700 transition-shadow hover:shadow-lg hover:border-slate-600">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-sm font-semibold text-sky-400">{tc.test_case_id}</p>
                    <h3 className="text-lg font-bold text-slate-100">{tc.objective}</h3>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Traceability Score</p>
                    <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${getScoreColor(tc.traceability_score)}`}>
                        {tc.traceability_score}
                    </span>
                </div>
            </div>
            
            <div className="mb-4">
                <p className="text-xs text-slate-400">Linked Requirement: {tc.linked_requirement}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Test Steps</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-400 text-sm">
                        {tc.test_steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Expected Result</h4>
                    <p className="text-slate-400 text-sm bg-slate-900/50 p-3 rounded-md border border-slate-700">{tc.expected_result}</p>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700">
                <h4 className="font-semibold text-slate-300 mb-2">Compliance References</h4>
                <div className="flex flex-wrap gap-2">
                {tc.compliance_reference.map((ref, i) => (
                    <span key={i} className="bg-slate-700 text-sky-300 text-xs font-medium px-2.5 py-1 rounded-full">
                    {ref}
                    </span>
                ))}
                </div>
            </div>

            {hasIntegrationResults && (
                <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                    <h4 className="font-semibold text-slate-300 text-sm">ALM Integration Status</h4>
                    {/* Jira Status */}
                    {jiraResult && (
                        <>
                            {jiraResult.status === 'success' && (
                                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/50 p-2 rounded-md">
                                    <LinkIcon className="w-4 h-4" />
                                    <span>Jira: Successfully created issue <strong>{jiraResult.issueKey}</strong></span>
                                </div>
                            )}
                            {jiraResult.status === 'error' && (
                                <div className="text-red-400 text-sm bg-red-900/50 p-2 rounded-md">
                                    <p><strong>Jira Export Failed:</strong> {jiraResult.error}</p>
                                </div>
                            )}
                        </>
                    )}
                    {/* Azure DevOps Status */}
                    {adoResult && (
                        <>
                            {adoResult.status === 'success' && (
                                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/50 p-2 rounded-md">
                                    <LinkIcon className="w-4 h-4" />
                                    <span>Azure DevOps: Successfully created work item <strong>#{adoResult.workItemId}</strong></span>
                                </div>
                            )}
                            {adoResult.status === 'error' && (
                                <div className="text-red-400 text-sm bg-red-900/50 p-2 rounded-md">
                                    <p><strong>Azure DevOps Export Failed:</strong> {adoResult.error}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
            </div>
        )
      })}
    </div>
  );
};

export default TestCaseOutput;
