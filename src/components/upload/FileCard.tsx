import { FileText, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileCardProps {
    file: File;
    onRemove?: () => void;
    type: "syllabus" | "paper";
}

export function FileCard({ file, onRemove, type }: FileCardProps) {
    return (
        <div className={cn(
            "group relative flex items-center gap-3 rounded-md border p-3 transition-all",
            "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
        )}>
            <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-sm bg-zinc-950 border border-zinc-800",
                type === "syllabus" ? "text-purple-500" : "text-emerald-500"
            )}>
                <FileText className="h-5 w-5" />
            </div>

            <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-zinc-200">
                    {file.name}
                </p>
                <p className="text-xs text-zinc-500">
                    {(file.size / 1024).toFixed(1)} KB
                </p>
            </div>

            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-800 rounded-sm"
                >
                    <X className="h-4 w-4 text-zinc-500 hover:text-red-400" />
                </button>
            )}

            {!onRemove && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
        </div>
    );
}
