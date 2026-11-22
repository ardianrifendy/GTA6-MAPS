"use client";

import React from "react";
import { Search, Compass, ShieldCheck, MapPin, ExternalLink, RefreshCw } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeView: string;
  onResetView: () => void;
  favoritesCount: number;
  totalFoundCount: number;
}

export function Header({
  searchQuery,
  onSearchChange,
  activeView,
  onResetView,
  favoritesCount,
  totalFoundCount,
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#090f1f]/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Companion title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff007a] to-[#00f0ff] p-[1.5px] flex items-center justify-center shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-[#090f1f] rounded-[6px] flex items-center justify-center">
              <span className="font-black text-xs bg-gradient-to-r from-[#ff007a] to-[#00f0ff] bg-clip-text text-transparent">
                VI
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-xs sm:text-sm tracking-wider uppercase text-slate-100">
                Leonida Map
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-pink-500/20 text-[#ff007a] border border-pink-500/30">
                COMPANION
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Xbox Series X &bull; Non-Tracker Hunter &bull; Money Routes
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-2 sm:mx-6">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search locations, vehicles, money, missions..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats, Status, and Controls */}
      <div className="flex items-center gap-2">
        {/* Progress badge */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-medium">Found:</span>
          <span className="text-emerald-400 font-bold">{totalFoundCount}</span>
        </div>

        {/* Reset / Center Map Button */}
        <button
          onClick={onResetView}
          title="Center / Reset Map View"
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs text-slate-300 hover:text-[#00f0ff] transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/ardianrifendy/GTA6-MAPS"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition"
          title="View Source on GitHub"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}
