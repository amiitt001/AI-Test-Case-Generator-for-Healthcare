export interface AnalyzedRequirement {
  requirement_id: string;
  requirement_text: string;
  validation_points: string[];
  regulatory_references: string[];
  risk_classification: 'Low' | 'Medium' | 'High';
}

export interface TestCase {
  test_case_id: string;
  linked_requirement: string;
  objective: string;
  test_steps: string[];
  expected_result: string;
  compliance_reference: string[];
  traceability_score: number;
}
