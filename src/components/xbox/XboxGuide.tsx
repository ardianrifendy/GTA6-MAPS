"use client";

import React, { useState } from "react";
import { XboxGuideItem } from "@/types";
import { getStatusMetadata } from "@/lib/data-governance";
import { Gamepad2, ShieldAlert, Key, CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react";

interface XboxGuideProps {
  guideItems: XboxGuideItem[];
}

export function XboxGuide({ guideItems }: XboxGuideProps) {
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const tabs = [
    { id: "ALL", label: "All Guides" },
    { id: "CONTROLS", label: "Xbox Controller Schemes" },
    { id: "SHORTCUTS", label: "Shortcuts & Hot-swaps" },
    { id: "CHEAT_CODES", label: "Cheat Codes & Policy" },
  ];

  const filtered = guideItems.filter((item) =>
    activeTab === "ALL" ? true : item.category === activeTab
  );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">
            Xbox Series X Companion Guide
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Wireless controller bindings, dual-protagonist swap shortcuts, and verified cheat policies.
        </p>
      </div>

      {/* Fraudulent Cheat Generator Warning */}
      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-rose-300">Security Warning: Fake Cheat Generators</h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Rockstar Games has <strong>not yet released official button sequence cheat codes</strong> for GTA VI. Any external website or app claiming to provide &quot;GTA 6 Money Cheats&quot; or download generators is fraudulent and poses malware risks. Legacy codes below are for historical reference only.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Guide Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const statusMeta = getStatusMetadata(item.verificationStatus);

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {item.category.replace("_", " ")}
                  </span>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {item.disablesAchievements && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      Disables Achievements
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1.5 ${statusMeta.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
                    <span>{statusMeta.label}</span>
                  </span>
                </div>
              </div>

              {/* Input Sequences (Xbox Buttons) */}
              {item.inputSequence && item.inputSequence.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 py-2">
                  {item.inputSequence.map((btn, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-cyan-300 shadow-sm"
                    >
                      {btn}
                    </span>
                  ))}
                </div>
              )}

              {/* Effect Description */}
              <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                {item.effect}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
