import React from "react";
import { cn } from "@/lib/utils";

export function CornerBrackets({ className }: { className?: string }) {
    return (
        <div className={cn("absolute inset-0 pointer-events-none", className)}>
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-purple-500/50" />
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-purple-500/50" />
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-purple-500/50" />
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-purple-500/50" />
        </div>
    );
}
