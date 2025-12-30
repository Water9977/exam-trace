"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, BarChart3, BrainCircuit, GraduationCap, Menu, X } from "lucide-react";
import { useFlowStore } from "@/store/use-flow-store";
import { TelemetryFooter } from "./TelemetryFooter";

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    isCollapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, isActive, onClick, disabled, isCollapsed }: NavItemProps) => {
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            onMouseMove={handleMouseMove}
            className={cn(
                "relative flex items-center gap-4 w-full h-12 overflow-hidden",
                "transition-all duration-[600ms] cubic-bezier(0.22, 1, 0.36, 1)",
                "group",
                isActive && !isCollapsed && "bg-white/[0.02]",
                disabled && "opacity-40 cursor-not-allowed",
                !disabled && "cursor-pointer active:scale-[0.99]",
                isCollapsed ? "px-0 pl-6 justify-start" : "px-8"
            )}
            style={{
                // @ts-ignore
                '--mouse-x': `${mousePos.x}%`,
                '--mouse-y': `${mousePos.y}%`,
            } as React.CSSProperties}
        >
            {/* Cursor-reactive hover background */}
            <div
                className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-400",
                    !disabled && "group-hover:opacity-100"
                )}
                style={{
                    background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.04) 0%, transparent 70%)`
                }}
            />

            {/* Left edge amber indicator - only show when NOT collapsed */}
            {!isCollapsed && (
                <div
                    className={cn(
                        "absolute left-0 top-[20%] bottom-[20%] w-[1.5px] bg-purple-500",
                        "transition-transform duration-[600ms] cubic-bezier(0.22, 1, 0.36, 1)",
                        isActive ? "scale-y-100" : "scale-y-0"
                    )}
                />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4 w-full">
                <Icon
                    className={cn(
                        "h-[18px] w-[18px] transition-all duration-[300ms] cubic-bezier(0.22, 1, 0.36, 1)",
                        // When collapsed and active: amber with glow
                        isActive && isCollapsed && "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]",
                        // When expanded and active: just amber
                        isActive && !isCollapsed && "text-purple-500",
                        // When not active: zinc
                        !isActive && "text-zinc-500",
                        !disabled && !isActive && "group-hover:text-zinc-300"
                    )}
                    strokeWidth={1.5}
                />
                <span
                    className={cn(
                        "text-sm font-light tracking-[0.02em]",
                        "transition-all duration-[300ms] cubic-bezier(0.22, 1, 0.36, 1)",
                        isActive ? "text-zinc-100" : "text-zinc-500",
                        !disabled && !isActive && "group-hover:text-zinc-300",
                        isCollapsed && "opacity-0 w-0 overflow-hidden"
                    )}
                >
                    {label}
                </span>
            </div>
        </button>
    );
};

export function Sidebar() {
    const { currentView, setView, sidebarCollapsed, toggleSidebar, status } = useFlowStore();

    // Disable navigation while processing
    const isProcessing = status === 'processing';

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-zinc-800",
                "bg-gradient-to-b from-[#111111] to-[#090909]",
                "flex flex-col py-12 pb-8",
                "transition-all duration-[600ms] cubic-bezier(0.22, 1, 0.36, 1)",
                sidebarCollapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            {/* Brand + Toggle */}
            <div className={cn(
                "mb-16 flex items-center transition-all duration-[600ms] cubic-bezier(0.22, 1, 0.36, 1)",
                sidebarCollapsed ? "justify-center px-0" : "justify-between px-8"
            )}>
                <h1
                    className={cn(
                        "text-lg font-normal tracking-[0.15em] uppercase text-zinc-100",
                        "transition-all duration-[300ms] cubic-bezier(0.22, 1, 0.36, 1)",
                        sidebarCollapsed && "opacity-0 w-0 overflow-hidden"
                    )}
                >
                    Exam Trace
                </h1>
                <button
                    onClick={toggleSidebar}
                    className={cn(
                        "p-2 rounded-md transition-all duration-300",
                        "hover:bg-white/[0.05] text-zinc-500 hover:text-zinc-300",
                        sidebarCollapsed && "ml-0"
                    )}
                >
                    {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 space-y-1">
                <NavItem
                    icon={Upload}
                    label="Upload Materials"
                    isActive={currentView === "upload"}
                    onClick={() => setView("upload")}
                    isCollapsed={sidebarCollapsed}
                    disabled={isProcessing}
                />
                <NavItem
                    icon={BarChart3}
                    label="Analysis Matrix"
                    isActive={currentView === "analysis"}
                    onClick={() => setView("analysis")}
                    isCollapsed={sidebarCollapsed}
                    disabled={isProcessing}
                />
                <div className="py-2">
                    <div className="h-[1px] bg-zinc-800" />
                </div>
                <NavItem
                    icon={BrainCircuit}
                    label="Prediction Engine"
                    isActive={currentView === "prediction"}
                    onClick={() => setView("prediction")}
                    isCollapsed={sidebarCollapsed}
                    disabled={isProcessing}
                />
                <div className="relative">
                    <NavItem
                        icon={GraduationCap}
                        label="AI Tutor"
                        disabled
                        isCollapsed={sidebarCollapsed}
                    />
                    {!sidebarCollapsed && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="px-2 py-0.5 rounded-sm bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-500/30 backdrop-blur-sm">
                                <p className="text-[9px] font-mono text-purple-500 uppercase tracking-wider whitespace-nowrap">
                                    SOON
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Telemetry Footer */}
            <TelemetryFooter isCollapsed={sidebarCollapsed} />
        </aside>
    );
}
