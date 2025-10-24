import { GoogleGenAI, Type } from "@google/genai";
import type { AnalyzedRequirement, TestCase } from '../types';

// FIX: Initialize GoogleGenAI with apiKey from process.env.API_KEY directly, removing the warning and fallback key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const analyzeRequirement = async (requirementText: string): Promise<AnalyzedRequirement> => {
    const prompt = `Analyze the following healthcare software requirement. Extract key information and structure it according to the provided JSON schema. The requirement is: "${requirementText}"`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: requirementSchema,
            },
        });
        
        const jsonString = response.text;
        return JSON.parse(jsonString) as AnalyzedRequirement;
    } catch (error) {
        console.error("Error analyzing requirement with Gemini:", error);
        throw new Error("Failed to analyze requirement. Please check the console for details.");
    }
};

export const generateTestCases = async (analyzedRequirement: AnalyzedRequirement): Promise<TestCase[]> => {
    const prompt = `Based on the following analyzed healthcare software requirement, generate a comprehensive set of structured test cases. Ensure you cover various scenarios (positive, negative, boundary). The analyzed requirement is: ${JSON.stringify(analyzedRequirement, null, 2)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: testCasesSchema,
            },
        });
        
        const jsonString = response.text;
        return JSON.parse(jsonString) as TestCase[];
    } catch (error) {
        console.error("Error generating test cases with Gemini:", error);
        throw new Error("Failed to generate test cases. Please check the console for details.");
    }
};