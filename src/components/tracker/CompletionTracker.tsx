"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, MapPin, Car, Target, Sparkles, RefreshCw } from "lucide-react";

interface CompletionTrackerProps {
  totalLocations: number;
  foundLocationsCount: number;
  totalVehicles: number;
  foundVehiclesCount: number;
  totalMissions: number;
  completedMissionsCount: number;
  totalCollectibles: number;
  foundCollectiblesCount: number;
  onResetAllData: () => void;
}

export function CompletionTracker({
  totalLocations,
  foundLocationsCount,
  totalVehicles,
  foundVehiclesCount,
  totalMissions,
  completedMissionsCount,
  totalCollectibles,
  foundCollectiblesCount,
  onResetAllData,
}: CompletionTrackerProps) {
  const totalItems = totalLocations + totalVehicles + totalMissions + totalCollectibles;
  const completedItems =
    foundLocationsCount + foundVehiclesCount + completedMissionsCount + foundCollectiblesCount;
  const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const categories = [
    {
      name: "Locations & Points of Interest",
      icon: MapPin,
      found: foundLocationsCount,
      total: totalLocations,
      color: "#00f0ff",
    },
    {
      name: "Vehicles & Spawns",
      icon: Car,
      found: foundVehiclesCount,
      total: totalVehicles,
      color: "#ff007a",
    },
    {
      name: "Missions & Heists",
      icon: Target,
      found: completedMissionsCount,
      total: totalMissions,
      color: "#ffb800",
    },
    {
      name: "Collectibles & Secrets",
      icon: Sparkles,
      found: foundCollectiblesCount,
      total: totalCollectibles,
      color: "#7928ca",
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">Completion Tracker</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your exploration, completed narrative heists, and found contraband across Leonida.
        </p>
      </div>

      {/* Mandatory Partial Checklist Warning */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-300">Notice: Partial Checklist Tracking</h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            This companion uses a <strong>partial checklist</strong> based on verified trailers, hands-on leaks, and cartography consensus. Rockstar Games has not yet published official 100% completion criteria. Progress displayed here reflects verified data currently in this database, not a definitive final game completion claim.
          </p>
        </div>
      </div>

      {/* Main Overall Progress Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0d1629] border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Current Database Checklist
            </span>
            <h3 className="text-2xl font-black text-white">
              {completedItems} of {totalItems} Items Completed
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Locally persisted in your browser&apos;s LocalStorage.
            </p>
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ff007a]">
            {overallPercentage}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800/80 mt-6 overflow-hidden p-[2px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const pct = cat.total > 0 ? Math.round((cat.found / cat.total) * 100) : 0;
          return (
            <div
              key={cat.name}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: cat.color }} />
                  <h4 className="text-xs font-bold text-slate-200">{cat.name}</h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {cat.found}/{cat.total}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: cat.color }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Completed</span>
                <span className="font-semibold text-slate-300">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={() => {
            if (confirm("Are you sure you want to reset all tracked progress and personal bookmarks?")) {
              onResetAllData();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Local Progress</span>
        </button>
      </div>
    </div>
  );
}
