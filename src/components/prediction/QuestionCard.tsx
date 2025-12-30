"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Target, TrendingUp, Calendar } from "lucide-react";
import { Topic } from "@/lib/mock-data";

interface QuestionCardProps {
    topic: Topic;
    onClick: () => void;
    isSelected: boolean;
}

export function QuestionCard({ topic, onClick, isSelected }: QuestionCardProps) {
    // Determine color based on probability
    const getProbabilityColor = (prob: number) => {
        if (prob >= 90) return "text-red-500 border-red-500/30 bg-red-500/10";
        if (prob >= 70) return "text-purple-500 border-purple-500/30 bg-purple-500/10";
        return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    };

    const colorClass = getProbabilityColor(topic.probability);

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative p-6 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl",
                "bg-white/[0.02] hover:bg-white/[0.05]",
                isSelected
                    ? "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-white/[0.08]"
                    : "border-white/10 hover:border-purple-500/40"
            )}
        >
            {/* Probability Badge */}
            <div className="absolute top-4 right-4">
                <div className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm font-bold font-mono backdrop-blur-sm",
                    colorClass
                )}>
                    {topic.probability}%
                </div>
            </div>

            {/* Topic Name */}
            <div className="pr-16 mb-4">
                <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {topic.name}
                </h3>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span className="font-mono">{topic.frequency}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    <span>{topic.unit}</span>
                </div>
            </div>

            {/* Trend Indicator */}
            {topic.trend === "up" && (
                <div className="absolute bottom-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                </div>
            )}

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
            </div>

            {/* Glass reflection effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50" />
            </div>
        </div>
    );
}
