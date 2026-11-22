"use client";

import React, { useState } from "react";
import { MoneyOpportunity, MoneyType } from "@/types";
import { getStatusMetadata } from "@/lib/data-governance";
import { DollarSign, MapPin, Route, Clock, Zap, TrendingUp, AlertOctagon } from "lucide-react";

interface MoneyFinderProps {
  opportunities: MoneyOpportunity[];
  onSelectOnMap: (opp: MoneyOpportunity) => void;
  onAddToRoute: (opp: MoneyOpportunity) => void;
  routeIds: string[];
}

export function MoneyFinder({
  opportunities,
  onSelectOnMap,
  onAddToRoute,
  routeIds,
}: MoneyFinderProps) {
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"payout" | "efficiency">("efficiency");

  const filtered = opportunities
    .filter((opp) => (typeFilter === "ALL" ? true : opp.type === typeFilter))
    .sort((a, b) => {
      if (sortBy === "efficiency") {
        // $/min calculation
        const effA = typeof a.estimatedMinutes === "number" ? a.maxPayout / a.estimatedMinutes : 0;
        const effB = typeof b.estimatedMinutes === "number" ? b.maxPayout / b.estimatedMinutes : 0;
        return effB - effA;
      }
      return b.maxPayout - a.maxPayout;
    });

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Money Opportunity Finder</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare earning efficiency, robbery payouts, repeatable farming loops, and heist risk factors.
          </p>
        </div>

        {/* Sort Switch */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-xs">
          <span className="text-slate-400 text-[11px] px-2 font-medium">Rank by:</span>
          <button
            onClick={() => setSortBy("efficiency")}
            className={`px-3 py-1 rounded font-semibold transition ${
              sortBy === "efficiency"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            $/Min Efficiency
          </button>
          <button
            onClick={() => setSortBy("payout")}
            className={`px-3 py-1 rounded font-semibold transition ${
              sortBy === "payout"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Max Payout
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: "ALL", label: "All Opportunities" },
          { id: "FAST_CASH", label: "Fast Cash" },
          { id: "HIGH_VALUE", label: "High Value Heists" },
          { id: "REPEATABLE_FARMING", label: "Repeatable Farming" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
              typeFilter === tab.id
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((opp) => {
          const statusMeta = getStatusMetadata(opp.verificationStatus);
          const inRoute = routeIds.includes(opp.id);
          const perMin =
            typeof opp.estimatedMinutes === "number"
              ? Math.round(opp.maxPayout / opp.estimatedMinutes)
              : null;

          return (
            <div
              key={opp.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between hover:border-emerald-500/40 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {opp.type.replace("_", " ")}
                    </span>
                    <h3 className="text-base font-bold text-white">{opp.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-400 font-mono">
                      ${opp.minPayout.toLocaleString()} - ${opp.maxPayout.toLocaleString()}
                    </div>
                    {perMin !== null && (
                      <div className="text-[10px] text-cyan-400 font-bold">
                        ~${perMin.toLocaleString()} / min
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
                  <span className="text-slate-400">{statusMeta.label}</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Duration</span>
                    <span className="font-semibold text-slate-200">
                      {opp.estimatedMinutes ? `${opp.estimatedMinutes} mins` : "UNKNOWN"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Repeatability</span>
                    <span className="font-semibold text-slate-200">
                      {opp.repeatability.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Risk / Diff.</span>
                    <span className="font-semibold text-amber-300">
                      {opp.riskLevel} / {opp.difficulty}
                    </span>
                  </div>
                </div>

                {opp.prerequisites && opp.prerequisites.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500 font-medium">Prerequisites: </span>
                    <span>{opp.prerequisites.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                {opp.coordinates && (
                  <button
                    onClick={() => onSelectOnMap(opp)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View Map</span>
                  </button>
                )}
                {opp.coordinates && (
                  <button
                    onClick={() => onAddToRoute(opp)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      inRoute
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                    }`}
                  >
                    <Route className="w-3.5 h-3.5" />
                    <span>{inRoute ? "In Route" : "+ Farm Route"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
