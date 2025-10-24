import type { AnalyzedRequirement, TestCase } from '../types';

export interface HistoryItem {
  id: string;
  timestamp: number;
  requirementText: string;
  analyzedRequirement: AnalyzedRequirement;
  testCases: TestCase[];
}

const HISTORY_KEY = 'test-case-generator-history';

export const getHistory = (): HistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const saveToHistory = (item: HistoryItem): void => {
  try {
    const history = getHistory();
    const newHistory = [item, ...history].slice(0, 50); // Keep latest 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save to history in localStorage", error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history in localStorage", error);
  }
};
