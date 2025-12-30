"use client";

import React from "react";
import { useFlowStore } from "@/store/use-flow-store";
import { MOCK_RESULTS } from "@/lib/mock-data";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Target,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

function FrequencyVisual({ frequency }: { frequency: string }) {
    const [current, total] = frequency.split('/').map(n => parseInt(n.replace(' Years', '')));

    return (
        <div className="flex items-center gap-3">
            <div className="flex gap-1">
                {Array(total).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-1.5 h-6 rounded-full transition-all",
                            i < current
                                ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                : "bg-white/20"
                        )}
                    />
                ))}
            </div>
            <span className="font-mono text-sm text-zinc-500 min-w-[60px]">{frequency}</span>
        </div>
    );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
    if (trend === "up") {
        return <TrendingUp className="h-5 w-5 text-red-500" />;
    }
    if (trend === "down") {
        return <TrendingDown className="h-5 w-5 text-emerald-500" />;
    }
    return <Minus className="h-5 w-5 text-zinc-600" />;
}

function ProbabilityBadge({ probability }: { probability: number }) {
    const getColorClasses = () => {
        if (probability >= 90) return "bg-red-500/10 border-red-500/30 text-red-500";
        if (probability >= 70) return "bg-purple-500/10 border-purple-500/30 text-purple-500";
        return "bg-zinc-800 border-zinc-700 text-zinc-400";
    };

    return (
        <div className={cn(
            "px-4 py-2 rounded-lg border font-mono text-base font-bold backdrop-blur-sm",
            getColorClasses()
        )}>
            {probability}%
        </div>
    );
}

export function ResultsTable() {
    const { analysisResults } = useFlowStore();
    const displayResults = analysisResults.length > 0 ? analysisResults : [];

    // Empty state
    if (displayResults.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-600 space-y-4">
                <div className="p-4 rounded-full bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
                    <Sparkles className="h-8 w-8 text-zinc-700" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-mono uppercase tracking-wide">No Analysis Data</p>
                    <p className="text-xs mt-1">Upload materials and run analysis first</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter text-white mb-2">
                        Probability Matrix
                    </h2>
                    <p className="text-sm text-zinc-400">
                        AI-analyzed topic predictions based on historical patterns
                    </p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 border border-emerald-500/30 backdrop-blur-sm">
                    <p className="text-xs font-mono text-emerald-500 uppercase tracking-wider">
                        Confidence: <span className="text-white font-bold">94%</span>
                    </p>
                </div>
            </div>

            {/* Table Container with Glassmorphism */}
            <div className="rounded-2xl bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/10 backdrop-blur-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1fr_1.5fr_0.8fr_1fr] gap-6 px-8 py-5 border-b border-white/10 bg-white/[0.02]">
                    <div className="text-xs font-mono uppercase tracking-[0.2em] text-purple-500">Topic</div>
                    <div className="text-xs font-mono uppercase tracking-[0.2em] text-purple-500">Unit</div>
                    <div className="text-xs font-mono uppercase tracking-[0.2em] text-purple-500">Frequency</div>
                    <div className="text-xs font-mono uppercase tracking-[0.2em] text-purple-500">Trend</div>
                    <div className="text-xs font-mono uppercase tracking-[0.2em] text-purple-500">Probability</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-white/5">
                    {displayResults.map((topic, index) => (
                        <div
                            key={topic.id}
                            className={cn(
                                "grid grid-cols-[2fr_1fr_1.5fr_0.8fr_1fr] gap-6 px-8 py-6",
                                "transition-all duration-200 hover:bg-white/[0.03]",
                                "group cursor-pointer"
                            )}
                        >
                            {/* Topic Name */}
                            <div className="flex items-center">
                                <p className="text-base font-medium text-zinc-100 group-hover:text-white transition-colors">
                                    {topic.name}
                                </p>
                            </div>

                            {/* Unit */}
                            <div className="flex items-center">
                                <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 backdrop-blur-sm">
                                    <p className="text-sm font-mono text-zinc-300">{topic.unit}</p>
                                </div>
                            </div>

                            {/* Frequency */}
                            <div className="flex items-center">
                                <FrequencyVisual frequency={topic.frequency} />
                            </div>

                            {/* Trend */}
                            <div className="flex items-center justify-center">
                                <TrendIcon trend={topic.trend} />
                            </div>

                            {/* Probability */}
                            <div className="flex items-center">
                                <ProbabilityBadge probability={topic.probability} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">Total Topics</p>
                    <p className="text-2xl font-bold text-white">{displayResults.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">High Priority</p>
                    <p className="text-2xl font-bold text-red-500">
                        {displayResults.filter(t => t.probability >= 90).length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">Medium Priority</p>
                    <p className="text-2xl font-bold text-purple-500">
                        {displayResults.filter(t => t.probability >= 70 && t.probability < 90).length}
                    </p>
                </div>
            </div>
        </div>
    );
}
