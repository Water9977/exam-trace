"use client";

import React, { useEffect, useState } from "react";
import { useFlowStore } from "@/store/use-flow-store";
import { analyzePapers } from "@/lib/api";
import { Terminal } from "lucide-react";

const LOG_STEPS = [
    "Initializing scan sequence...",
    "Parsing Syllabus Structure...",
    "OCR processing Past Papers...",
    "Extracting semantic entities...",
    "Gemini 3 Flash: Cross-referencing entities...",
    "Calculating topic frequency...",
    "Generating Probability Matrix...",
    "Awaiting AI response..."
];

export function SystemLog() {
    const { syllabusFile, pastPaperFiles, completeProcessing, setAnalysisResults, setView } = useFlowStore();
    const [logs, setLogs] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [apiCalled, setApiCalled] = useState(false);

    // Call API on mount and track completion - only once
    useEffect(() => {
        if (!apiCalled && syllabusFile) {
            setApiCalled(true);

            analyzePapers(syllabusFile, pastPaperFiles)
                .then(results => {
                    console.log("Analysis complete, storing results:", results);
                    setAnalysisResults(results);
                    // Add small delay to ensure results are fully set before marking complete
                    setTimeout(() => {
                        setAnalysisComplete(true);
                    }, 300);
                })
                .catch(error => {
                    console.error("Analysis failed, using fallback:", error);
                    // Even on error, mark as complete so we don't hang forever
                    setAnalysisComplete(true);
                });
        }
    }, [syllabusFile, pastPaperFiles, apiCalled, setAnalysisResults]);

    // Animate logs
    useEffect(() => {
        if (currentStep >= LOG_STEPS.length) {
            // All logs shown, but don't transition until API is done
            if (analysisComplete) {
                const timer = setTimeout(() => {
                    completeProcessing();
                    setView("analysis"); // Auto-navigate to Analysis Matrix
                }, 800);
                return () => clearTimeout(timer);
            }
            return; // Wait for API to complete
        }

        const timer = setTimeout(() => {
            setLogs((prev) => [...prev, LOG_STEPS[currentStep]]);
            setCurrentStep((prev) => prev + 1);
        }, 650); // 650ms per step for smoother feel

        return () => clearTimeout(timer);
    }, [currentStep, analysisComplete, completeProcessing]);

    return (
        <div className="flex items-center justify-center h-[500px] animate-in fade-in duration-500">
            <div className="w-full max-w-xl rounded-lg border border-zinc-800 bg-zinc-950 p-6 font-mono text-sm shadow-2xl">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-4 mb-4 text-zinc-400">
                    <Terminal className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-widest">System Log</span>
                </div>

                <div className="space-y-2 h-[300px] overflow-hidden flex flex-col justify-end">
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-3 text-zinc-300 animate-in slide-in-from-left-2 duration-300">
                            <span className="text-zinc-600">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            <span className={i === LOG_STEPS.length - 1 ? "text-purple-500 font-bold" : ""}>
                                {log}
                            </span>
                        </div>
                    ))}
                    {!analysisComplete && currentStep >= LOG_STEPS.length && (
                        <div className="flex gap-3 text-purple-500 animate-pulse">
                            <span className="text-zinc-600">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            <span>Processing with Gemini AI...</span>
                        </div>
                    )}
                    <div className="animate-pulse text-purple-500">_</div>
                </div>
            </div>
        </div>
    );
}
