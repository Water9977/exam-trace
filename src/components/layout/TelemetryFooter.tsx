"use client";

import React from "react";

interface TelemetryFooterProps {
    isCollapsed: boolean;
}

export function TelemetryFooter({ isCollapsed }: TelemetryFooterProps) {
    if (isCollapsed) {
        return (
            <div className="px-4 mt-auto border-t border-white/[0.03] pt-6">
                <div className="flex justify-center">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 mt-auto border-t border-white/[0.03] pt-6">
            <div className="font-mono text-[10px] text-zinc-800 space-y-1.5">
                <div className="flex justify-between items-center">
                    <span className="tracking-wide">BUILD_VERSION</span>
                    <span className="text-zinc-700">v0.8.4-MVP</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="tracking-wide">SYSTEM_STATUS</span>
                    <span className="flex items-center gap-2 text-zinc-700">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        OPERATIONAL
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="tracking-wide">LATENCY</span>
                    <span className="text-zinc-700">14ms</span>
                </div>
            </div>
        </div>
    );
}
