import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RequirementInput from "./components/RequirementInputs";
import AnalyzedRequirementDisplay from './components/AnalyzedRequirementDisplay';
import TestCaseOutput from './components/TestCaseOutput';
import IntegrationActions from './components/IntegrationActions';
import StepCard from './components/StepCard';
import Spinner from './components/Spinner';
import { WORKFLOW_STEPS } from './constant';
import { analyzeRequirement, generateTestCases } from './services/geminiService';
import { exportToJira, JiraIntegrationResult } from './services/jiraService';
import { exportToAzureDevOps, AzureDevOpsIntegrationResult } from './services/azureDevOpsService';
import type { AnalyzedRequirement, TestCase } from './type';
import { saveToHistory, HistoryItem } from './services/historyService';
import HistoryPanel from './components/HistoryPanel';


type AppState = 'IDLE' | 'ANALYZING' | 'GENERATING' | 'INTEGRATING' | 'COMPLETE' | 'ERROR';
type IntegrationStatus = 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('IDLE');
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [requirementText, setRequirementText] = useState('');
    const [analyzedRequirement, setAnalyzedRequirement] = useState<AnalyzedRequirement | null>(null);
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    
    const [jiraStatus, setJiraStatus] = useState<IntegrationStatus>('IDLE');
    const [jiraResults, setJiraResults] = useState<JiraIntegrationResult>({});

    const [azureDevOpsStatus, setAzureDevOpsStatus] = useState<IntegrationStatus>('IDLE');
    const [azureDevOpsResults, setAzureDevOpsResults] = useState<AzureDevOpsIntegrationResult>({});


    useEffect(() => {
        switch (appState) {
            case 'IDLE': setCurrentStep(0); break;
            case 'ANALYZING': setCurrentStep(2); break;
            case 'GENERATING': setCurrentStep(3); break;
            case 'INTEGRATING': setCurrentStep(5); break;
            case 'COMPLETE': setCurrentStep(7); break; // All steps done
            case 'ERROR': break; // Keep current step on error
            default: setCurrentStep(0);
        }
    }, [appState]);


    const resetState = () => {
        setAppState('IDLE');
        setError(null);
        setRequirementText('');
        setAnalyzedRequirement(null);
        setTestCases([]);
        setJiraStatus('IDLE');
        setJiraResults({});
        setAzureDevOpsStatus('IDLE');
        setAzureDevOpsResults({});
    };

    const handleAnalyze = async (text: string) => {
        resetState();
        setRequirementText(text);
        setAppState('ANALYZING');
        setError(null);
        try {
            const result = await analyzeRequirement(text);
            setAnalyzedRequirement(result);
            setAppState('GENERATING');
            
            const generatedCases = await generateTestCases(result);
            setTestCases(generatedCases);
            setAppState('COMPLETE');

            // Save to history after a successful run
            saveToHistory({
                id: result.requirement_id,
                timestamp: Date.now(),
                requirementText: text,
                analyzedRequirement: result,
                testCases: generatedCases,
            });

        } catch (err) {
            setAppState('ERROR');
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };
    
    const handleExportToJira = async () => {
        if (!analyzedRequirement || testCases.length === 0) return;
        setJiraStatus('PENDING');
        setAppState('INTEGRATING');
        try {
            const results = await exportToJira(testCases, analyzedRequirement.requirement_id);
            setJiraResults(results);
            const hasError = Object.values(results).some(r => r.status === 'error');
            setJiraStatus(hasError ? 'ERROR' : 'SUCCESS');
        } catch (err) {
            setJiraStatus('ERROR');
            setError(err instanceof Error ? err.message : 'An unknown Jira export error occurred.');
        } finally {
            setAppState('COMPLETE');
        }
    };

    const handleExportToAzureDevOps = async () => {
        if (!analyzedRequirement || testCases.length === 0) return;
        setAzureDevOpsStatus('PENDING');
        setAppState('INTEGRATING');
        try {
            const results = await exportToAzureDevOps(testCases, analyzedRequirement.requirement_id);
            setAzureDevOpsResults(results);
            const hasError = Object.values(results).some(r => r.status === 'error');
            setAzureDevOpsStatus(hasError ? 'ERROR' : 'SUCCESS');
        } catch (err) {
            setAzureDevOpsStatus('ERROR');
            setError(err instanceof Error ? err.message : 'An unknown Azure DevOps export error occurred.');
        } finally {
            setAppState('COMPLETE');
        }
    };
    
    const handleLoadHistory = (item: HistoryItem) => {
        resetState();
        setRequirementText(item.requirementText);
        setAnalyzedRequirement(item.analyzedRequirement);
        setTestCases(item.testCases);
        setAppState('COMPLETE');
    };

    const isLoading = appState === 'ANALYZING' || appState === 'GENERATING';

    return (
        <div className="bg-slate-900 text-slate-300 min-h-screen font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Workflow */}
                    <aside className="lg:col-span-1 space-y-4">
                        <h2 className="text-xl font-semibold text-slate-100 px-1">Workflow</h2>
                        {WORKFLOW_STEPS.map(step => (
                            <StepCard 
                                key={step.step}
                                stepData={step}
                                isActive={currentStep === step.step}
                                isCompleted={currentStep > step.step || appState === 'COMPLETE'}
                            />
                        ))}
                    </aside>

                    {/* Right Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                                <h3 className="font-bold">An Error Occurred</h3>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        )}
                        
                        <RequirementInput onSubmit={handleAnalyze} isLoading={isLoading} />
                        
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center bg-slate-800 p-10 rounded-lg border border-slate-700">
                                <Spinner size="w-12 h-12" />
                                <p className="mt-4 text-slate-400 font-semibold">
                                    {appState === 'ANALYZING' ? 'Understanding requirement with Gemini...' : 'Generating test cases...'}
                                </p>
                            </div>
                        )}

                        {analyzedRequirement && !isLoading && (
                            <AnalyzedRequirementDisplay data={analyzedRequirement} />
                        )}

                        {testCases.length > 0 && !isLoading && (
                           <>
                            <TestCaseOutput 
                                testCases={testCases} 
                                jiraResults={jiraResults}
                                azureDevOpsResults={azureDevOpsResults}
                            />
                            <IntegrationActions 
                                onExportToJira={handleExportToJira} 
                                jiraStatus={jiraStatus}
                                onExportToAzureDevOps={handleExportToAzureDevOps}
                                azureDevOpsStatus={azureDevOpsStatus}
                            />
                           </>
                        )}
                        
                        <HistoryPanel onLoadHistory={handleLoadHistory} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
