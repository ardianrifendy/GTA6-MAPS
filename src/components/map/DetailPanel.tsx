"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Car,
  DollarSign,
  Target,
  Sparkles,
  Bookmark,
  Share2,
  CheckCircle2,
  Route,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
} from "lucide-react";
import { UnifiedMapMarker } from "./MapCanvas";
import { getStatusMetadata } from "@/lib/data-governance";
import { VerificationStatus } from "@/types";

interface DetailPanelProps {
  marker: UnifiedMapMarker | null;
  onClose: () => void;
  isFound: boolean;
  onToggleFound: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isInRoute: boolean;
  onToggleRoute: (marker: UnifiedMapMarker) => void;
  userNote?: string;
  onSaveNote?: (id: string, note: string) => void;
}

export function DetailPanel({
  marker,
  onClose,
  isFound,
  onToggleFound,
  isFavorite,
  onToggleFavorite,
  isInRoute,
  onToggleRoute,
  userNote = "",
  onSaveNote,
}: DetailPanelProps) {
  const [noteText, setNoteText] = useState(userNote);
  const [isCopied, setIsCopied] = useState(false);

  if (!marker) return null;

  const raw = marker.rawItem || {};
  const statusMeta = getStatusMetadata(
    (marker.verificationStatus as VerificationStatus) || "UNKNOWN"
  );

  const handleShare = () => {
    const url = `${window.location.origin}/?marker=${marker.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 border-l border-slate-800 bg-[#0a1122]/95 backdrop-blur-md flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto z-20 shadow-2xl">
      <div className="p-4 space-y-4">
        {/* Header & Close */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: marker.color }}
              />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {marker.category}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-wide leading-snug">
              {marker.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Status Banner */}
        <div
          className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${statusMeta.badgeClass}`}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 mt-1 ${statusMeta.dotColor}`}
          />
          <div>
            <div className="font-semibold">{statusMeta.label}</div>
            <p className="text-[11px] opacity-80 mt-0.5 leading-tight">
              {statusMeta.description}
            </p>
          </div>
        </div>

        {/* Location & Region Badge */}
        <div className="flex items-center justify-between text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Coordinates:</span>
          </div>
          <div className="font-mono text-cyan-300 font-semibold">
            X: {marker.coordinates.x} &bull; Y: {marker.coordinates.y}
          </div>
        </div>

        {/* Description */}
        {marker.description && (
          <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
            {marker.description}
          </div>
        )}

        {/* Vehicle Specific Details */}
        {marker.category === "vehicles" && (
          <div className="space-y-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              <span>Vehicle Intelligence</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-slate-500">Tracker Status:</span>
                <div className="font-semibold text-slate-200">
                  {raw.trackerStatus === "NON_TRACKER" ? (
                    <span className="text-emerald-400 font-bold">NON-TRACKER</span>
                  ) : raw.trackerStatus === "TRACKER" ? (
                    <span className="text-rose-400 font-bold">TRACKER</span>
                  ) : (
                    <span className="text-slate-400">UNKNOWN</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Class:</span>
                <div className="font-semibold text-slate-200">{raw.class || "Unknown"}</div>
              </div>
              <div>
                <span className="text-slate-500">Selling Eligibility:</span>
                <div className="font-semibold text-slate-200">
                  {raw.sellingEligibility || "UNKNOWN"}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Storage / Garage:</span>
                <div className="font-semibold text-slate-200">
                  {raw.storageEligibility || "UNKNOWN"}
                </div>
              </div>
            </div>
            {raw.spawnConditions && (
              <div className="pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400 font-medium">Spawn Conditions: </span>
                <span className="text-slate-300">{raw.spawnConditions}</span>
              </div>
            )}
          </div>
        )}

        {/* Money Opportunity Specific Details */}
        {marker.category === "money" && (
          <div className="space-y-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Money Payout & Efficiency</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-slate-500">Estimated Payout:</span>
                <div className="font-bold text-emerald-400">
                  ${raw.minPayout?.toLocaleString()} - ${raw.maxPayout?.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Estimated Duration:</span>
                <div className="font-semibold text-slate-200">
                  {raw.estimatedMinutes ? `${raw.estimatedMinutes} mins` : "UNKNOWN"}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Repeatability:</span>
                <div className="font-semibold text-slate-200">
                  {raw.repeatability || "COOLDOWN_BASED"}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Risk & Difficulty:</span>
                <div className="font-semibold text-amber-300">
                  {raw.riskLevel} / {raw.difficulty}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mission Details */}
        {marker.category === "missions" && (
          <div className="space-y-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              <span>Mission Intel</span>
            </div>
            <div className="text-[11px] space-y-1">
              <div>
                <span className="text-slate-500">Giver: </span>
                <span className="text-slate-200 font-medium">{raw.giver || "Unknown"}</span>
              </div>
              {raw.rewards && (
                <div>
                  <span className="text-slate-500">Reward: </span>
                  <span className="text-emerald-400 font-bold">
                    {raw.rewards.cash ? `$${raw.rewards.cash.toLocaleString()}` : "Reputation"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collectible Clue */}
        {marker.category === "collectibles" && raw.clue && (
          <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800/40 text-xs">
            <span className="text-[10px] font-bold uppercase text-purple-400 block mb-1">
              Hunting Clue
            </span>
            <p className="text-slate-300 text-[11px] italic">&quot;{raw.clue}&quot;</p>
          </div>
        )}

        {/* Traceable Source Citations */}
        {raw.sources && raw.sources.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-cyan-400" />
              <span>Source References</span>
            </span>
            <div className="space-y-1">
              {raw.sources.map((src: any, i: number) => (
                <div
                  key={i}
                  className="text-[10px] p-2 rounded bg-slate-900/70 border border-slate-800 text-slate-400"
                >
                  <div className="font-semibold text-slate-300">{src.title}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-slate-400">
                    <span>Type: {src.sourceType}</span>
                    {src.publisher && <span>&bull; {src.publisher}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Notes Input */}
        {onSaveNote && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Personal Note
            </span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add tactical note..."
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => onSaveNote(marker.id, noteText)}
                className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Buttons */}
      <div className="p-3 border-t border-slate-800 bg-[#080d19] grid grid-cols-2 gap-2">
        <button
          onClick={() => onToggleRoute(marker)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
            isInRoute
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
              : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
          }`}
        >
          <Route className="w-3.5 h-3.5" />
          <span>{isInRoute ? "Remove Route" : "Add to Route"}</span>
        </button>

        <button
          onClick={() => onToggleFound(marker.id)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
            isFound
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
              : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isFound ? "Found" : "Mark Found"}</span>
        </button>

        <button
          onClick={() => onToggleFavorite(marker.id)}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            isFavorite
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "bg-slate-800/80 text-slate-400 border border-slate-850 hover:bg-slate-800"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{isFavorite ? "Favorited" : "Favorite"}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-850 hover:bg-slate-800 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isCopied ? "Copied!" : "Share Link"}</span>
        </button>
      </div>
    </aside>
  );
}
