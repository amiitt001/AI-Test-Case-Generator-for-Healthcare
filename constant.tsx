import React from 'react';
import { DocumentAiIcon, GeminiIcon, BigQueryIcon, JiraIcon, AzureDevOpsIcon, FirebaseIcon, CubeTransparentIcon } from './components/icons';

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  tools: { name: string; icon: React.ReactNode }[];
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: "Input Processing",
    description: "Ingest requirement documents in natural language or structured form.",
    tools: [
      { name: "Document AI", icon: <DocumentAiIcon className="w-5 h-5 text-sky-400" /> },
    ],
  },
  {
    step: 2,
    title: "Requirement Understanding",
    description: "Use Gemini to interpret terminology and extract actionable requirements.",
    tools: [{ name: "Gemini", icon: <GeminiIcon className="w-5 h-5 text-violet-400" /> }],
  },
  {
    step: 3,
    title: "Test Case Generation",
    description: "Generate detailed, compliant test cases for each requirement.",
    tools: [{ name: "Gemini", icon: <GeminiIcon className="w-5 h-5 text-violet-400" /> }],
  },
  {
    step: 4,
    title: "Validation & Traceability",
    description: "Cross-verify test cases and maintain requirement-to-test linkage.",
    tools: [{ name: "BigQuery", icon: <BigQueryIcon className="w-5 h-5 text-blue-400" /> }],
  },
  {
    step: 5,
    title: "ALM Tool Integration",
    description: "Push validated test cases into enterprise ALM tools.",
    tools: [
      { name: "Jira", icon: <JiraIcon className="w-5 h-5 text-blue-500" /> },
      { name: "Azure DevOps", icon: <AzureDevOpsIcon className="w-5 h-5 text-sky-500" /> },
    ],
  },
  {
    step: 6,
    title: "Compliance Audit Logging",
    description: "Store audit logs and metadata for FDA/ISO traceability.",
    tools: [
      { name: "Firebase", icon: <FirebaseIcon className="w-5 h-5 text-amber-400" /> },
      { name: "BigQuery", icon: <BigQueryIcon className="w-5 h-5 text-blue-400" /> },
    ],
  },
  {
    step: 7,
    title: "GDPR Readiness",
    description: "Generate anonymized synthetic data for PoC testing.",
    tools: [{ name: "Synthetic Data", icon: <CubeTransparentIcon className="w-5 h-5 text-green-400" /> }],
  },
];
