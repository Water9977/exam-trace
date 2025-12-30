"use client";

import React, { useState } from "react";
import { Topic } from "@/lib/mock-data";
import { useFlowStore } from "@/store/use-flow-store";
import { QuestionCard } from "./QuestionCard";
import {
    AlertCircle,
    BrainCircuit,
    History,
    Target,
    Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function QuestionGrid() {
    const { analysisResults } = useFlowStore();
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    // Filter high-probability questions (>= 70%)
    const predictedQuestions = analysisResults.filter(t => t.probability >= 70);

    if (analysisResults.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
                <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                    <Sparkles className="h-8 w-8 text-zinc-700" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-mono uppercase tracking-wide">No Analysis Data</p>
                    <p className="text-xs mt-1">Upload materials and run analysis first</p>
                </div>
            </div>
        );
    }

    if (predictedQuestions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
                <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                    <Target className="h-8 w-8 text-zinc-700" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-mono uppercase tracking-wide">No High-Probability Topics</p>
                    <p className="text-xs mt-1">All topics have probability below 70%</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-full overflow-y-auto scrollbar-hide">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Predicted Questions</h1>
                <p className="text-zinc-400 text-sm">
                    High-probability topics (≥70%) extracted from your analysis
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-8">
                {predictedQuestions.map(topic => (
                    <QuestionCard
                        key={topic.id}
                        topic={topic}
                        onClick={() => setSelectedTopic(topic)}
                        isSelected={selectedTopic?.id === topic.id}
                    />
                ))}
            </div>
        </div>
    );
}

function DetailPanel() {
    const { analysisResults } = useFlowStore();
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    // Listen to selected topic from grid (we'll need to lift state up or use store)
    // For now, using local state in parent component

    const predictedQuestions = analysisResults.filter(t => t.probability >= 70);
    const activeTopic = selectedTopic || (predictedQuestions.length > 0 ? predictedQuestions[0] : null);

    return (
        <div className="h-full overflow-y-auto w-full border-l border-zinc-800 bg-zinc-950/95 p-6 backdrop-blur">
            <div className="mb-6 flex items-center gap-2 text-purple-500 border-b border-zinc-800 pb-4">
                <BrainCircuit className="h-5 w-5" />
                <h2 className="text-sm font-mono tracking-widest font-bold uppercase">Topic Intelligence</h2>
            </div>

            {activeTopic ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
                        <h3 className="text-xs text-zinc-500 font-mono mb-2 uppercase tracking-wide">Selected Topic</h3>
                        <p className="text-zinc-200 font-semibold text-lg">{activeTopic.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
                            <div className="text-emerald-500 mb-2"><History className="h-5 w-5" /></div>
                            <h3 className="text-xs text-zinc-500 font-mono uppercase">Frequency</h3>
                            <p className="text-zinc-200 text-sm font-medium mt-1">{activeTopic.frequency}</p>
                        </div>
                        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
                            <div className="text-purple-500 mb-2"><AlertCircle className="h-5 w-5" /></div>
                            <h3 className="text-xs text-zinc-500 font-mono uppercase">Probability</h3>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-bold text-white">{activeTopic.probability}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
                        <h3 className="text-xs text-zinc-500 font-mono mb-2 uppercase tracking-wide">AI Reasoning</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed border-l-2 border-emerald-500 pl-3">
                            {activeTopic.reasoning}
                        </p>
                    </div>

                    {activeTopic.sampleQuestions && activeTopic.sampleQuestions.length > 0 && (
                        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur-sm">
                            <h3 className="text-xs text-zinc-500 font-mono mb-3 uppercase tracking-wide">Sample Questions</h3>
                            <div className="space-y-2">
                                {activeTopic.sampleQuestions.map((question, idx) => (
                                    <div key={idx} className="p-3 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-zinc-300 leading-relaxed">
                                        {idx + 1}. {question}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Badge variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300">
                            {activeTopic.unit}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300">
                            {activeTopic.trend === "up" ? "Rising" : activeTopic.trend === "down" ? "Declining" : "Stable"}
                        </Badge>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-600 space-y-4">
                    <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 animate-pulse">
                        <Target className="h-8 w-8 text-zinc-700" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-mono uppercase tracking-wide">No Data Available</p>
                        <p className="text-xs mt-1">Run analysis to see predictions</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export function PredictionView() {
    const { analysisResults } = useFlowStore();
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    const predictedQuestions = analysisResults.filter(t => t.probability >= 70);
    const activeTopic = selectedTopic || (predictedQuestions.length > 0 ? predictedQuestions[0] : null);

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-950">
            {/* Question Grid Container */}
            <div className="flex-1 h-full overflow-hidden bg-zinc-950">
                {analysisResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
                        <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                            <Sparkles className="h-8 w-8 text-zinc-700" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-mono uppercase tracking-wide">No Analysis Data</p>
                            <p className="text-xs mt-1">Upload materials and run analysis first</p>
                        </div>
                    </div>
                ) : predictedQuestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
                        <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                            <Target className="h-8 w-8 text-zinc-700" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-mono uppercase tracking-wide">No High-Probability Topics</p>
                            <p className="text-xs mt-1">All topics have probability below 70%</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 h-full overflow-y-auto scrollbar-hide">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Predicted Questions</h1>
                            <p className="text-zinc-400 text-sm">
                                High-probability topics (≥70%) extracted from your analysis
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-8">
                            {predictedQuestions.map(topic => (
                                <QuestionCard
                                    key={topic.id}
                                    topic={topic}
                                    onClick={() => setSelectedTopic(topic)}
                                    isSelected={selectedTopic?.id === topic.id}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            <div className="w-[400px]">
                <div className="h-full overflow-y-auto w-full border-l border-white/10 bg-zinc-950/95 p-6 backdrop-blur-xl">
                    <div className="mb-6 flex items-center gap-2 text-purple-500 border-b border-zinc-800 pb-4">
                        <BrainCircuit className="h-5 w-5" />
                        <h2 className="text-sm font-mono tracking-widest font-bold uppercase">Topic Intelligence</h2>
                    </div>

                    {activeTopic ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur-sm">
                                <h3 className="text-xs text-zinc-500 font-mono mb-2 uppercase tracking-wide">Selected Topic</h3>
                                <p className="text-zinc-200 font-semibold text-lg">{activeTopic.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur-sm">
                                    <div className="text-emerald-500 mb-2"><History className="h-5 w-5" /></div>
                                    <h3 className="text-xs text-zinc-500 font-mono uppercase">Frequency</h3>
                                    <p className="text-zinc-200 text-sm font-medium mt-1">{activeTopic.frequency}</p>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur-sm">
                                    <div className="text-purple-500 mb-2"><AlertCircle className="h-5 w-5" /></div>
                                    <h3 className="text-xs text-zinc-500 font-mono uppercase">Probability</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-2xl font-bold text-white">{activeTopic.probability}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur-sm">
                                <h3 className="text-xs text-zinc-500 font-mono mb-2 uppercase tracking-wide">AI Reasoning</h3>
                                <p className="text-zinc-300 text-sm leading-relaxed border-l-2 border-emerald-500 pl-3">
                                    {activeTopic.reasoning}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300">
                                    {activeTopic.unit}
                                </Badge>
                                <Badge variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300">
                                    {activeTopic.trend === "up" ? "Rising" : activeTopic.trend === "down" ? "Declining" : "Stable"}
                                </Badge>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-zinc-600 space-y-4">
                            <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 animate-pulse">
                                <Target className="h-8 w-8 text-zinc-700" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-mono uppercase tracking-wide">No Data Available</p>
                                <p className="text-xs mt-1">Run analysis to see predictions</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
