import React from "react";
import { Sidebar } from "./Sidebar";
import { useFlowStore } from "@/store/use-flow-store";
import { cn } from "@/lib/utils";

interface ShellProps {
    children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
    const { sidebarCollapsed } = useFlowStore();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500/30">
            <Sidebar />
            <main className={cn(
                "min-h-screen relative transition-all duration-[600ms] cubic-bezier(0.22, 1, 0.36, 1)",
                sidebarCollapsed ? "pl-[72px]" : "pl-[260px]"
            )}>
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern" />
                <div className="relative z-10 p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
