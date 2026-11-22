"use client";

import React, { useState } from "react";
import { MissionItem } from "@/types";
import { getStatusMetadata } from "@/lib/data-governance";
import { Target, CheckCircle2, Eye, EyeOff, MapPin, Award, GitBranch } from "lucide-react";

interface MissionGuideProps {
  missions: MissionItem[];
  completedIds: string[];
  onToggleComplete: (id: string) => void;
  onSelectOnMap: (mission: MissionItem) => void;
}

export function MissionGuide({
  missions,
  completedIds,
  onToggleComplete,
  onSelectOnMap,
}: MissionGuideProps) {
  const [showSpoilers, setShowSpoilers] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Missions & Heist Walkthrough</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Story quests, dual-protagonist narrative objectives, and unlock prerequisites.
          </p>
        </div>

        {/* Spoiler Toggle Button */}
        <button
          onClick={() => setShowSpoilers(!showSpoilers)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            showSpoilers
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
          }`}
        >
          {showSpoilers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{showSpoilers ? "Spoilers Visible" : "Spoilers Hidden"}</span>
        </button>
      </div>

      {/* Mission Timeline / Cards */}
      <div className="space-y-4">
        {missions.map((mis, idx) => {
          const isDone = completedIds.includes(mis.id);
          const statusMeta = getStatusMetadata(mis.verificationStatus);
          const isBlurred = mis.hasSpoilers && !showSpoilers && !isDone;

          return (
            <div
              key={mis.id}
              className={`rounded-xl border p-4 transition bg-slate-900/60 ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-950/10"
                  : "border-slate-800 hover:border-slate-750"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {mis.type}
                    </span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{mis.title}</span>
                      {mis.hasSpoilers && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                          Spoiler
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Giver: <strong className="text-slate-200">{mis.giver || "Unknown"}</strong></span>
                    <span>&bull;</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
                      <span>{statusMeta.label}</span>
                    </div>
                  </div>

                  {/* Narrative Summary with Spoiler Blur */}
                  <div className="relative">
                    <p
                      className={`text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850 ${
                        isBlurred ? "blur-sm select-none" : ""
                      }`}
                    >
                      {mis.summary}
                    </p>
                    {isBlurred && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => setShowSpoilers(true)}
                          className="px-3 py-1 rounded bg-slate-900/90 text-xs font-semibold text-slate-300 border border-slate-700 shadow-lg hover:text-white"
                        >
                          Click to Reveal Spoiler
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Prerequisites & Rewards */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    {mis.prerequisites && mis.prerequisites.length > 0 && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Requires: {mis.prerequisites.join(", ")}</span>
                      </div>
                    )}
                    {mis.rewards && (
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>
                          Reward: {mis.rewards.cash ? `$${mis.rewards.cash.toLocaleString()}` : "Items"}
                          {mis.rewards.items && ` (${mis.rewards.items.join(", ")})`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right controls: Done toggle & Map */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleComplete(mis.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isDone
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isDone ? "Completed" : "Mark Done"}</span>
                  </button>

                  {mis.coordinates && (
                    <button
                      onClick={() => onSelectOnMap(mis)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-slate-700 transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Map</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
