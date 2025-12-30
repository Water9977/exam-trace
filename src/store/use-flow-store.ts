import { create } from 'zustand';
import { Topic } from '@/lib/mock-data';

type FlowStatus = 'idle' | 'processing' | 'analysis';
type ViewState = 'upload' | 'analysis' | 'prediction';

interface FlowState {
    status: FlowStatus;
    currentView: ViewState;
    syllabusFile: File | null;
    pastPaperFiles: File[];
    hoveredQuestionId: string | null;
    analysisResults: Topic[];
    sidebarCollapsed: boolean;

    setSyllabus: (file: File | null) => void;
    addPastPaper: (file: File) => void;
    removePastPaper: (fileName: string) => void;
    startProcessing: () => void;
    completeProcessing: () => void;
    setAnalysisResults: (results: Topic[]) => void;
    setView: (view: ViewState) => void;
    setHoveredQuestion: (id: string | null) => void;
    toggleSidebar: () => void;
    reset: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
    status: 'idle',
    currentView: 'upload',
    syllabusFile: null,
    pastPaperFiles: [],
    hoveredQuestionId: null,
    analysisResults: [],
    sidebarCollapsed: false,

    setSyllabus: (file) => set({ syllabusFile: file }),
    addPastPaper: (file) => set((state) => ({
        pastPaperFiles: [...state.pastPaperFiles, file]
    })),
    removePastPaper: (fileName) => set((state) => ({
        pastPaperFiles: state.pastPaperFiles.filter(f => f.name !== fileName)
    })),
    startProcessing: () => set({ status: 'processing' }),
    completeProcessing: () => set({ status: 'analysis' }),
    setAnalysisResults: (results) => set({ analysisResults: results }),
    setView: (view) => set({ currentView: view }),
    setHoveredQuestion: (id) => set({ hoveredQuestionId: id }),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    reset: () => set({
        status: 'idle',
        currentView: 'upload',
        syllabusFile: null,
        pastPaperFiles: [],
        hoveredQuestionId: null,
        analysisResults: [],
        sidebarCollapsed: false
    }),
}));
