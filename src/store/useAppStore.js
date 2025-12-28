import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Student info from onboarding
      student: null,
      setStudent: (student) => set({ student }),
      
      // Auth token
      token: null,
      setToken: (token) => set({ token }),
      isAuthenticated: () => get().token !== null,
      
      // Current unit/lesson data
      currentUnit: null,
      setCurrentUnit: (unit) => set({ currentUnit: unit }),
      
      // Progress tracking
      currentStepIndex: 0,
      setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
      nextStep: () => set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
      resetProgress: () => set({ currentStepIndex: 0 }),
      
      // Attempts tracking for refinement loops
      attempts: {},
      incrementAttempt: (stepId) => set((state) => ({
        attempts: {
          ...state.attempts,
          [stepId]: (state.attempts[stepId] || 0) + 1
        }
      })),
      getAttempts: (stepId) => get().attempts[stepId] || 0,
      
      // Refinement state (showing video after failed attempts)
      showRefinement: false,
      setShowRefinement: (show) => set({ showRefinement: show }),
      
      // Logs for parent view
      logs: [],
      addLog: (log) => set((state) => ({
        logs: [...state.logs, {
          ...log,
          timestamp: new Date().toISOString(),
          studentName: state.student?.name
        }]
      })),
      
      // Unit completion status
      completedUnits: [],
      markUnitComplete: (unitId) => set((state) => ({
        completedUnits: [...state.completedUnits, unitId]
      })),
      
      // Reset everything
      resetAll: () => set({
        student: null,
        token: null,
        currentUnit: null,
        currentStepIndex: 0,
        attempts: {},
        showRefinement: false,
        logs: [],
        completedUnits: []
      }),
      
      // Logout (keep logs for parent view)
      logout: () => set({
        token: null,
        currentUnit: null,
        currentStepIndex: 0,
        attempts: {},
        showRefinement: false
      })
    }),
    {
      name: 'nava-miller-storage'
    }
  )
);

// Helper to inject dynamic variables into text
export const injectVariables = (text, student) => {
  if (!text || !student) return text;
  
  return text
    .replace(/{child_name}/g, student.name || '')
    .replace(/{grade}/g, student.grade || '')
    .replace(/{difficulty}/g, student.difficulty || '');
};

