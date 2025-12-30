"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position
            } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position
            } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position
            } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-zinc-800"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    onDiscover,
}: {
    onDiscover?: () => void;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 overflow-hidden">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 to-zinc-500 mb-6">
                        EXAM TRACE
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-mono">
                        Analysis • Prediction • Strategy
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="flex justify-center"
                    >
                        <ShimmerButton
                            onClick={onDiscover}
                            shimmerColor="#a855f7"
                            shimmerSize="0.05em"
                            shimmerDuration="3s"
                            borderRadius="9999px"
                            background="rgba(0, 0, 0, 0.9)"
                            className="px-8 py-3 text-sm font-medium uppercase tracking-widest shadow-2xl"
                        >
                            <span className="relative z-10 text-white">Go to Dashboard</span>
                        </ShimmerButton>
                    </motion.div>
                </motion.div>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
        </div>
    );
}
