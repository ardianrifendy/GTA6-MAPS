"use client";

import React from "react";
import { RouteStop, optimizeRouteOrder } from "@/lib/route/optimizer";
import { formatDistance } from "@/lib/map/coordinates";
import { Route, Trash2, ArrowUpDown, MapPin, AlertCircle, ArrowUp, ArrowDown, Download } from "lucide-react";

interface RoutePlannerProps {
  stops: RouteStop[];
  onUpdateStops: (newStops: RouteStop[]) => void;
  onViewOnMap: () => void;
  onClearRoute: () => void;
}

export function RoutePlanner({
  stops,
  onUpdateStops,
  onViewOnMap,
  onClearRoute,
}: RoutePlannerProps) {
  const handleOptimize = () => {
    if (stops.length <= 1) return;
    const result = optimizeRouteOrder(stops);
    onUpdateStops(result.orderedStops);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onUpdateStops(updated);
  };

  const handleRemove = (index: number) => {
    const updated = stops.filter((_, i) => i !== index);
    onUpdateStops(updated);
  };

  const routeCalc = optimizeRouteOrder(stops);

  const handleExportRouteJSON = () => {
    const blob = new Blob([JSON.stringify(stops, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta6-companion-route-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Multi-Stop Route Planner</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build optimal routes for money farming, car hunting, and exploration waypoints.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            {stops.length} Stops &bull; Est. {formatDistance(routeCalc.totalDistance)}
          </div>
        </div>
      </div>

      {/* Geometry Disclaimer */}
      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-200">Straight-Line Geometry Disclaimer: </span>
          Distance calculation uses Euclidean straight-line geometry on the 4096-pixel coordinate grid. Actual driving distance will vary by road network topology.
        </div>
      </div>

      {/* Route Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleOptimize}
            disabled={stops.length <= 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-pink-500 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition shadow-lg shadow-pink-500/20"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Optimize Order (Nearest Neighbor)</span>
          </button>

          <button
            onClick={onViewOnMap}
            disabled={stops.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 disabled:opacity-50 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View on Map</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportRouteJSON}
            disabled={stops.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onClearRoute}
            disabled={stops.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 disabled:opacity-50 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Route</span>
          </button>
        </div>
      </div>

      {/* Stop List */}
      {stops.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 space-y-2">
          <Route className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">Your Route is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse locations, vehicles, or money opportunities and click &quot;+ Add to Route&quot; to build an expedition route.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {stops.map((stop, index) => (
            <div
              key={`${stop.id}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-750 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-white">{stop.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="uppercase">{stop.category}</span>
                    <span>&bull;</span>
                    <span>X: {stop.coordinates.x}, Y: {stop.coordinates.y}</span>
                  </div>
                </div>
              </div>

              {/* Order buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === stops.length - 1}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="p-1.5 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
