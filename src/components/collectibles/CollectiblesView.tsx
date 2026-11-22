"use client";

import React, { useState } from "react";
import { CollectibleItem } from "@/types";
import { getStatusMetadata } from "@/lib/data-governance";
import { Sparkles, CheckCircle2, MapPin, Search } from "lucide-react";

interface CollectiblesViewProps {
  collectibles: CollectibleItem[];
  foundIds: string[];
  onToggleFound: (id: string) => void;
  onSelectOnMap: (col: CollectibleItem) => void;
}

export function CollectiblesView({
  collectibles,
  foundIds,
  onToggleFound,
  onSelectOnMap,
}: CollectiblesViewProps) {
  const [activeSet, setActiveSet] = useState<string>("ALL");

  const sets = ["ALL", ...Array.from(new Set(collectibles.map((c) => c.set)))];

  const filtered = collectibles.filter((c) => (activeSet === "ALL" ? true : c.set === activeSet));

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Collectibles & Secrets</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hidden contraband packages, stunt jump ramps, and Leonida folklore totems.
          </p>
        </div>

        {/* Set Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {sets.map((set) => {
            const setTotal =
              set === "ALL"
                ? collectibles.length
                : collectibles.filter((c) => c.set === set).length;
            const setFound =
              set === "ALL"
                ? collectibles.filter((c) => foundIds.includes(c.id)).length
                : collectibles.filter((c) => c.set === set && foundIds.includes(c.id)).length;

            return (
              <button
                key={set}
                onClick={() => setActiveSet(set)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeSet === set
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {set} ({setFound}/{setTotal})
              </button>
            );
          })}
        </div>
      </div>

      {/* Collectible Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isFound = foundIds.includes(item.id);
          const statusMeta = getStatusMetadata(item.verificationStatus);

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition bg-slate-900/60 ${
                isFound
                  ? "border-emerald-500/30 bg-emerald-950/10"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      {item.set} &bull; #{item.setIndex} of {item.setTotal}
                    </span>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isFound
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isFound ? "Collected" : "Missing"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
                  <span className="text-slate-400">{statusMeta.label}</span>
                </div>

                {item.clue && (
                  <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-850 italic">
                    &quot;{item.clue}&quot;
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectOnMap(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-slate-700 transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Show Map</span>
                </button>

                <button
                  onClick={() => onToggleFound(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isFound
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isFound ? "Found" : "Mark Found"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
