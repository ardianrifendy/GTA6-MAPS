"use client";

import React, { useState } from "react";
import { VehicleItem, TrackerStatus } from "@/types";
import { getStatusMetadata } from "@/lib/data-governance";
import { Car, MapPin, Route, ShieldCheck, Filter, AlertTriangle } from "lucide-react";

interface VehicleFinderProps {
  vehicles: VehicleItem[];
  onSelectOnMap: (vehicle: VehicleItem) => void;
  onAddToRoute: (vehicle: VehicleItem) => void;
  routeIds: string[];
}

export function VehicleFinder({
  vehicles,
  onSelectOnMap,
  onAddToRoute,
  routeIds,
}: VehicleFinderProps) {
  const [trackerFilter, setTrackerFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const classes = ["ALL", ...Array.from(new Set(vehicles.map((v) => v.class)))];

  const filtered = vehicles.filter((v) => {
    if (trackerFilter !== "ALL" && v.trackerStatus !== trackerFilter) return false;
    if (classFilter !== "ALL" && v.class !== classFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchManuf = v.manufacturer.toLowerCase().includes(q);
      const matchMethod = v.acquisitionMethod.toLowerCase().includes(q);
      if (!matchName && !matchManuf && !matchMethod) return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#ff007a]" />
            <h2 className="text-xl font-bold text-white tracking-wide">Vehicle Intelligence Finder</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hunter database for rare spawns. Explicit Non-Tracker vs Tracker classification with verified acquisition data.
          </p>
        </div>

        {/* Quick highlight counts */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
            {vehicles.filter((v) => v.trackerStatus === "NON_TRACKER").length} Non-Trackers
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 font-semibold">
            {vehicles.length} Total Registered
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 mr-2 font-medium">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tracker Filter:</span>
          </div>
          {["ALL", "NON_TRACKER", "TRACKER", "UNKNOWN"].map((status) => (
            <button
              key={status}
              onClick={() => setTrackerFilter(status)}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                trackerFilter === status
                  ? "bg-[#ff007a] text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {status === "ALL" ? "All Vehicles" : status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Class:</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vehicle) => {
          const statusMeta = getStatusMetadata(vehicle.verificationStatus);
          const inRoute = routeIds.includes(vehicle.id);
          const isNonTracker = vehicle.trackerStatus === "NON_TRACKER";

          return (
            <div
              key={vehicle.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition hover:shadow-xl bg-slate-900/60 ${
                isNonTracker
                  ? "border-emerald-500/30 hover:border-emerald-500/60"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {vehicle.manufacturer} &bull; {vehicle.class}
                    </span>
                    <h3 className="text-base font-bold text-white">{vehicle.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      isNonTracker
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : vehicle.trackerStatus === "TRACKER"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}
                  >
                    {vehicle.trackerStatus.replace("_", " ")}
                  </span>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
                  <span className="text-slate-400">{statusMeta.label}</span>
                </div>

                {/* Acquisition & Spawn info */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  {vehicle.acquisitionMethod}
                </p>

                {/* Properties table */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-500">Resale Price:</span>
                    <div className="font-semibold text-slate-200">
                      {typeof vehicle.confirmedResalePrice === "number"
                        ? `$${vehicle.confirmedResalePrice.toLocaleString()}`
                        : "UNKNOWN"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Storage / Garage:</span>
                    <div className="font-semibold text-slate-200">
                      {vehicle.storageEligibility === "CAN_STORE_GARAGE"
                        ? "Can Store"
                        : vehicle.storageEligibility === "CANNOT_STORE"
                        ? "Cannot Store"
                        : "UNKNOWN"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                {vehicle.coordinates && (
                  <button
                    onClick={() => onSelectOnMap(vehicle)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View Map</span>
                  </button>
                )}
                {vehicle.coordinates && (
                  <button
                    onClick={() => onAddToRoute(vehicle)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      inRoute
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500/30"
                    }`}
                  >
                    <Route className="w-3.5 h-3.5" />
                    <span>{inRoute ? "In Route" : "+ Route"}</span>
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
