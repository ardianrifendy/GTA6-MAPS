"use client";

import React from "react";
import {
  Map,
  Car,
  DollarSign,
  Target,
  Sparkles,
  Route,
  CheckCircle2,
  Gamepad2,
  Bookmark,
  Layers,
  Eye,
  EyeOff,
  CheckCheck,
  XCircle,
} from "lucide-react";

export type ActiveView =
  | "map"
  | "vehicles"
  | "money"
  | "missions"
  | "collectibles"
  | "route"
  | "tracker"
  | "xbox"
  | "personal";

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  activeLayers: Record<string, boolean>;
  onToggleLayer: (layerId: string) => void;
  onShowAllLayers?: () => void;
  onHideAllLayers?: () => void;
  categories: Array<{ id: string; name: string; color: string }>;
  layerStats?: Record<string, { found: number; total: number }>;
  routeStopCount: number;
}

export function Sidebar({
  activeView,
  onViewChange,
  activeLayers,
  onToggleLayer,
  onShowAllLayers,
  onHideAllLayers,
  categories,
  layerStats = {},
  routeStopCount,
}: SidebarProps) {
  const navItems = [
    { id: "map", label: "Interactive Map", icon: Map },
    { id: "vehicles", label: "Vehicle Finder", icon: Car, badge: "Hunter" },
    { id: "money", label: "Money Finder", icon: DollarSign, badge: "$/Min" },
    { id: "missions", label: "Missions & Heists", icon: Target },
    { id: "collectibles", label: "Collectibles", icon: Sparkles },
    { id: "route", label: "Route Planner", icon: Route, count: routeStopCount },
    { id: "tracker", label: "Completion Tracker", icon: CheckCircle2 },
    { id: "xbox", label: "Xbox Guide & Cheats", icon: Gamepad2 },
    { id: "personal", label: "My Pinned Markers", icon: Bookmark },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#090f1f]/95 flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto">
      {/* Primary Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation & Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ActiveView)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-pink-500/20 to-cyan-500/10 text-white border-l-2 border-[#ff007a] font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#00f0ff]" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-[#ff007a]/20 text-[#ff007a]">
                  {item.badge}
                </span>
              )}
              {typeof item.count === "number" && item.count > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-cyan-500/20 text-[#00f0ff]">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* MapGenie Style Category Layers Section (visible when on map view) */}
        {activeView === "map" && (
          <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
            <div className="px-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Categories & Layers</span>
              </div>

              {/* Show All / Hide All (MapGenie signature buttons) */}
              <div className="flex items-center gap-1 text-[9px]">
                {onShowAllLayers && (
                  <button
                    onClick={onShowAllLayers}
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold"
                    title="Show All Layers"
                  >
                    SHOW ALL
                  </button>
                )}
                {onHideAllLayers && (
                  <button
                    onClick={onHideAllLayers}
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold"
                    title="Hide All Layers"
                  >
                    HIDE ALL
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1 px-1">
              {categories.map((cat) => {
                const isVisible = activeLayers[cat.id] !== false;
                const stats = layerStats[cat.id];

                return (
                  <button
                    key={cat.id}
                    onClick={() => onToggleLayer(cat.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800/60 transition group"
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {stats && stats.total > 0 && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {stats.found}/{stats.total}
                        </span>
                      )}
                      {isVisible ? (
                        <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60 m-2 rounded-lg text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-300 font-semibold">
          <span>Map Engine</span>
          <span className="text-[10px] px-1 bg-cyan-500/20 text-cyan-400 rounded">MapGenie / Leaflet</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Supports custom XYZ tile endpoints & raster overlays. LocalStorage state tracking.
        </p>
      </div>
    </aside>
  );
}
