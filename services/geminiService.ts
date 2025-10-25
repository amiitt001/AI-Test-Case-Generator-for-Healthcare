import { GoogleGenerativeAI as GenAI } from '@google/generative-ai';

// Define Type enum locally since it's not exported by the package
enum Type {
    OBJECT = "object",
    STRING = "string",
    ARRAY = "array",
    INTEGER = "integer"
}
import type { AnalyzedRequirement, TestCase } from '../type';

// FIX: Pass apiKey and httpOptions in ONE configuration object
const ai = new GenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  httpOptions: { apiVersion: 'v1' },
});
// --- Your Schemas (no changes needed) ---

const requirementSchema = {
    type: Type.OBJECT,
    properties: {
        requirement_id: { type: Type.STRING, description: "A unique identifier for the requirement, e.g., REQ-001. Generate one if not present." },
        requirement_text: { type: Type.STRING, description: "The original text of the requirement." },
        validation_points: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of specific, verifiable points or functionalities that need to be tested."
        },
        regulatory_references: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of relevant regulatory standards mentioned or implied, e.g., 'FDA 820.30(c)', 'ISO 13485'."
        },
        risk_classification: {
            type: Type.STRING,
            enum: ['Low', 'Medium', 'High'],
            description: "Assess and assign a risk level (Low, Medium, or High) to the requirement based on potential patient safety impact."
        }
    },
    required: ['requirement_id', 'requirement_text', 'validation_points', 'regulatory_references', 'risk_classification']
};

const testCaseSchema = {
    type: Type.OBJECT,
    properties: {
        test_case_id: { type: Type.STRING, description: "A unique identifier for the test case, e.g., TC-001." },
        linked_requirement: { type: Type.STRING, description: "The ID of the requirement this test case is linked to." },
        objective: { type: Type.STRING, description: "A concise objective of the test case." },
        test_steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A sequence of clear, actionable steps to perform the test."
        },
        expected_result: { type: Type.STRING, description: "The specific, measurable, expected outcome after executing the test steps." },
        compliance_reference: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of compliance standards this test case helps verify, e.g., 'ISO 13485'."
        },
        traceability_score: {
            type: Type.INTEGER,
            description: "A score from 85-100 representing the confidence in traceability linkage, estimated by the AI."
        }
    },
    required: ['test_case_id', 'linked_requirement', 'objective', 'test_steps', 'expected_result', 'compliance_reference', 'traceability_score']
};

const testCasesSchema = {
    type: Type.ARRAY,
    description: "Generate at least 3 detailed test cases, covering positive, negative, and edge-case scenarios.",
    items: testCaseSchema
};


// --- Corrected Functions ---

export const analyzeRequirement = async (requirementText: string): Promise<AnalyzedRequirement> => {
    // FIX: Modified prompt to ask for JSON only
    const prompt = `Analyze the following healthcare software requirement. Extract key information and structure it ONLY according to this JSON schema: ${JSON.stringify(requirementSchema)}. 
    
    Respond with ONLY the raw JSON object. Do not add \`\`\`json markdown or any explanatory text.
    
    The requirement is: "${requirementText}"`;
    
  try {
    // FIX: Use the stable 'gemini-1.5-flash' model
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // FIX: Removed the generationConfig to avoid the v1beta API
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jsonString = response.response.text();
    return JSON.parse(jsonString) as AnalyzedRequirement;

  } catch (error) {
    console.error("Error analyzing requirement with Gemini:", error);
    throw new Error("Failed to analyze requirement. Please check the console for details.");
  }
};

export const generateTestCases = async (analyzedRequirement: AnalyzedRequirement): Promise<TestCase[]> => {
    // FIX: Modified prompt to ask for JSON only
    const prompt = `Based on the following analyzed healthcare software requirement, generate a comprehensive set of structured test cases (at least 3) ONLY according to this JSON schema: ${JSON.stringify(testCasesSchema)}.
    
    Respond with ONLY the raw JSON array. Do not add \`\`\`json markdown or any explanatory text.
    
    The analyzed requirement is: ${JSON.stringify(analyzedRequirement, null, 2)}`;

    try {
        // FIX: Use the stable 'gemini-1.5-flash' model
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        // FIX: Removed the generationConfig to avoid the v1beta API
        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        
        const jsonString = response.response.text();
        return JSON.parse(jsonString) as TestCase[];
    } catch (error) {
        console.error("Error generating test cases with Gemini:", error);
        throw new Error("Failed to generate test cases. Please check the console for details.");
    }
};