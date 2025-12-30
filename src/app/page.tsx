"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Sidebar } from "@/components/layout/Sidebar";
import { UploadZone } from "@/components/upload/UploadZone";
import { SystemLog } from "@/components/processing/SystemLog";
import { ResultsTable } from "@/components/dashboard/ResultsTable";
import { PredictionView } from "@/components/prediction/PredictionView";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { CursorProbe } from "@/components/ui/cursor-probe";
import { useFlowStore } from "@/store/use-flow-store";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { status, currentView } = useFlowStore();
  const [showLanding, setShowLanding] = useState(true);

  // Prediction View - Full screen layout
  if (currentView === "prediction") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <Sidebar />
        <main className="pl-64 h-screen">
          <PredictionView />
        </main>
      </div>
    );
  }

  // Analysis Matrix View - Results table only
  if (currentView === "analysis") {
    return (
      <>
        <AnimatePresence>
          {showLanding && (
            <motion.div
              key="landing"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] bg-zinc-950"
            >
              <BackgroundPaths onDiscover={() => setShowLanding(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={showLanding ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="min-h-screen"
        >
          <Shell>
            <div className="max-w-4xl mx-auto pt-8">
              <ResultsTable />
            </div>
          </Shell>
        </motion.div>
      </>
    );
  }

  // Upload View - Upload zone with full-screen processing
  return (
    <>
      <AnimatePresence>
        {showLanding && (
          <motion.div
            key="landing"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-zinc-950"
          >
            <BackgroundPaths onDiscover={() => setShowLanding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={showLanding ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="min-h-screen"
      >
        <Shell>
          <div className="max-w-4xl mx-auto pt-8">
            <div className="mb-8 border-b border-zinc-800 pb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold tracking-tighter text-white">
                  New Analysis
                </h1>
                <div className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1">
                  <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                    Session ID: <span className="text-zinc-300">8F-2A-9C</span>
                  </p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm max-w-lg">
                Upload syllabus and past papers to generate topic probability matrix.
              </p>
            </div>

            <UploadZone />
          </div>
        </Shell>
      </motion.div>
    </>
  );
}
