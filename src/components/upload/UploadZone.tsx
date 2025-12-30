"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { useFlowStore } from "@/store/use-flow-store";
import { FileCard } from "./FileCard";
import { UploadCloud, BookOpen, Layers, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CornerBrackets } from "@/components/ui/corner-brackets";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { SystemLog } from "@/components/processing/SystemLog";

export function UploadZone() {
    const {
        syllabusFile,
        pastPaperFiles,
        setSyllabus,
        addPastPaper,
        removePastPaper,
        startProcessing,
        status
    } = useFlowStore();

    const syllabusInputRef = useRef<HTMLInputElement>(null);
    const paperInputRef = useRef<HTMLInputElement>(null);
    const syllabusCardRef = useRef<HTMLDivElement>(null);
    const paperCardRef = useRef<HTMLDivElement>(null);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Global for backup? Or can remove?
    const [syllabusTilt, setSyllabusTilt] = useState({ x: 0, y: 0 });
    const [paperTilt, setPaperTilt] = useState({ x: 0, y: 0 });

    // Track local cursor position for lighting effects
    const [syllabusCursor, setSyllabusCursor] = useState({ x: -100, y: -100 });
    const [paperCursor, setPaperCursor] = useState({ x: -100, y: -100 });

    // Track mouse position globally
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate 3D tilt and local cursor for syllabus card
            if (syllabusCardRef.current) {
                const rect = syllabusCardRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Always update cursor position for the glow effect
                setSyllabusCursor({ x, y });

                if (e.clientX > rect.left && e.clientX < rect.right &&
                    e.clientY > rect.top && e.clientY < rect.bottom) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (e.clientY - rect.top - centerY) / 30;
                    const rotateY = -(e.clientX - rect.left - centerX) / 30;
                    setSyllabusTilt({ x: rotateX, y: rotateY });
                } else {
                    setSyllabusTilt({ x: 0, y: 0 });
                }
            }

            // Calculate 3D tilt and local cursor for paper card
            if (paperCardRef.current) {
                const rect = paperCardRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Always update cursor position for the glow effect
                setPaperCursor({ x, y });

                if (e.clientX > rect.left && e.clientX < rect.right &&
                    e.clientY > rect.top && e.clientY < rect.bottom) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (e.clientY - rect.top - centerY) / 30;
                    const rotateY = -(e.clientX - rect.left - centerX) / 30;
                    setPaperTilt({ x: rotateX, y: rotateY });
                } else {
                    setPaperTilt({ x: 0, y: 0 });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, type: "syllabus" | "paper") => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        if (type === "syllabus") {
            setSyllabus(files[0]);
        } else {
            files.forEach(file => addPastPaper(file));
        }
    }, [setSyllabus, addPastPaper]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "syllabus" | "paper") => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (type === "syllabus") {
            setSyllabus(files[0]);
        } else {
            Array.from(files).forEach(file => addPastPaper(file));
        }
    }, [setSyllabus, addPastPaper]);

    const handleClick = (type: "syllabus" | "paper") => {
        if (type === "syllabus") {
            syllabusInputRef.current?.click();
        } else {
            paperInputRef.current?.click();
        }
    };

    const canStartProcessing = syllabusFile !== null && pastPaperFiles.length > 0;

    return (
        <div className="space-y-8 relative">
            {/* Processing Overlay */}
            {status === "processing" && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <SystemLog />
                </div>
            )}

            {/* Hidden file inputs */}
            <input
                ref={syllabusInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileSelect(e, "syllabus")}
                className="hidden"
            />
            <input
                ref={paperInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => handleFileSelect(e, "paper")}
                className="hidden"
            />

            {/* Upload Cards Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Syllabus Card */}
                <div
                    ref={syllabusCardRef}
                    onDrop={(e) => handleDrop(e, "syllabus")}
                    onDragOver={handleDragOver}
                    onClick={() => handleClick("syllabus")}
                    className="relative group cursor-pointer"
                    style={{
                        transform: `perspective(1000px) rotateX(${syllabusTilt.x}deg) rotateY(${syllabusTilt.y}deg) scale3d(${syllabusTilt.x !== 0 || syllabusTilt.y !== 0 ? 1.02 : 1}, ${syllabusTilt.x !== 0 || syllabusTilt.y !== 0 ? 1.02 : 1}, 1)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                >
                    <div className={cn(
                        "relative flex flex-col rounded-[1.5rem] p-8 h-[400px]",
                        "bg-gradient-to-br from-zinc-900/50 to-black/50",
                        "border border-white/10",
                        "backdrop-blur-xl",
                        "transition-all duration-300",
                        "hover:border-purple-500/40",
                        "overflow-hidden"
                    )}>
                        {/* Radial gradient glow following cursor */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle 400px at ${syllabusCursor.x}px ${syllabusCursor.y}px, rgba(168, 85, 247, 0.08), transparent 70%)`
                            }}
                        />

                        {/* Glass reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none rounded-[1.5rem]" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4">
                                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-500 mb-2">
                                    Primary Intake
                                </div>
                                <h3 className="text-2xl font-light text-zinc-100 mb-2 font-['Space_Grotesk']">
                                    Course Syllabus
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                                    Provide the structural blueprint of your course. PDF format supported.
                                </p>
                            </div>

                            {/* Upload Icon or File Display */}
                            <div className="flex-1 flex flex-col items-center justify-center">
                                {!syllabusFile ? (
                                    <>
                                        <div className={cn(
                                            "w-16 h-16 rounded-full border border-dashed border-white/20",
                                            "flex items-center justify-center mb-4",
                                            "transition-all duration-500 group-hover:border-purple-500 group-hover:scale-110 group-hover:rotate-6",
                                            "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                        )}>
                                            <BookOpen className="h-6 w-6 text-zinc-500 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
                                            Drag & Drop Secure Document
                                        </span>
                                    </>
                                ) : (
                                    <FileCard
                                        file={syllabusFile}
                                        onRemove={() => setSyllabus(null)}
                                        type="syllabus"
                                    />
                                )}
                            </div>

                            {/* Telemetry */}
                            <div className="mt-auto">
                                <p className="text-[11px] font-mono text-zinc-700">
                                    INITIALIZING_CHANNEL... SECURE_HANDSHAKE_COMPLETE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Past Papers Card */}
                <div
                    ref={paperCardRef}
                    onDrop={(e) => handleDrop(e, "paper")}
                    onDragOver={handleDragOver}
                    onClick={() => handleClick("paper")}
                    className="relative group cursor-pointer"
                    style={{
                        transform: `perspective(1000px) rotateX(${paperTilt.x}deg) rotateY(${paperTilt.y}deg) scale3d(${paperTilt.x !== 0 || paperTilt.y !== 0 ? 1.02 : 1}, ${paperTilt.x !== 0 || paperTilt.y !== 0 ? 1.02 : 1}, 1)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                >
                    <div className={cn(
                        "relative flex flex-col rounded-[1.5rem] p-8 h-[400px]",
                        "bg-gradient-to-br from-zinc-900/50 to-black/50",
                        "border border-white/10",
                        "backdrop-blur-xl",
                        "transition-all duration-300",
                        "hover:border-purple-500/40",
                        "overflow-hidden"
                    )}>
                        {/* Diagonal stripe pattern */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{
                                backgroundImage: `repeating-linear-gradient(45deg, #18181b, #18181b 10px, #27272a 10px, #27272a 20px)`
                            }}
                        />

                        {/* Radial gradient glow following cursor */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle 400px at ${paperCursor.x}px ${paperCursor.y}px, rgba(168, 85, 247, 0.08), transparent 70%)`
                            }}
                        />

                        {/* Glass reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none rounded-[1.5rem]" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4">
                                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-500 mb-2">
                                    Secondary Evidence
                                </div>
                                <h3 className="text-2xl font-light text-zinc-100 mb-2 font-['Space_Grotesk']">
                                    Past Papers
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                                    Accumulate history to predict the future. The more data, the higher the resolution.
                                </p>
                            </div>

                            {/* Upload Icon or File List */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {pastPaperFiles.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <div className={cn(
                                            "w-16 h-16 rounded-full border border-dashed border-white/20",
                                            "flex items-center justify-center mb-4",
                                            "transition-all duration-500 group-hover:border-purple-500 group-hover:scale-110 group-hover:rotate-6",
                                            "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                        )}>
                                            <Layers className="h-6 w-6 text-zinc-500 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
                                            Drag & Drop Multiple Files
                                        </span>
                                    </div>
                                ) : (
                                    <div className="space-y-2 overflow-y-auto scrollbar-hide">
                                        {pastPaperFiles.map((file, index) => (
                                            <FileCard
                                                key={index}
                                                file={file}
                                                onRemove={() => removePastPaper(file.name)}
                                                type="paper"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Telemetry */}
                            <div className="mt-auto">
                                <p className="text-[11px] font-mono text-zinc-700">
                                    AWAITING_INPUT_STREAM_V4.2...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Initiate Sequence Button */}
            <div className="flex justify-center pt-4">
                <Button
                    onClick={startProcessing}
                    disabled={!canStartProcessing}
                    className={cn(
                        "px-8 py-6 text-sm font-mono uppercase tracking-[0.2em]",
                        "bg-gradient-to-r from-purple-900/20 to-purple-800/20",
                        "border border-purple-500/30",
                        "backdrop-blur-sm rounded-xl",
                        "text-purple-500/90",
                        "transition-all duration-300",
                        "hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
                        "hover:scale-105 hover:text-white",
                        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:text-zinc-600"
                    )}
                >
                    <ScanLine className="inline-block mr-2 h-4 w-4" />
                    Initiate Sequence
                </Button>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            `}</style>
        </div>
    );
}
