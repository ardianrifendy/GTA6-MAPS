"use client";

import React, { useState } from "react";
import { PersonalMarker, UserDataState } from "@/types";
import { Bookmark, Plus, Trash2, MapPin, Download, Upload, ShieldCheck, Check, AlertCircle } from "lucide-react";
import { exportUserStateJSON, importUserStateJSON } from "@/lib/storage/user-state";

interface MyLocationsProps {
  markers: PersonalMarker[];
  userState: UserDataState;
  onAddMarker: (marker: Omit<PersonalMarker, "id" | "createdAt">) => void;
  onDeleteMarker: (id: string) => void;
  onSelectOnMap: (marker: PersonalMarker) => void;
  onRestoreState: (state: UserDataState) => void;
  onEnablePinMode: () => void;
  isPinMode: boolean;
}

export function MyLocations({
  markers,
  userState,
  onAddMarker,
  onDeleteMarker,
  onSelectOnMap,
  onRestoreState,
  onEnablePinMode,
  isPinMode,
}: MyLocationsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [x, setX] = useState<number>(2500);
  const [y, setY] = useState<number>(2000);
  const [color, setColor] = useState("#F97316");
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddMarker({
      title,
      note,
      color,
      coordinates: { x: Number(x), y: Number(y) },
    });
    setTitle("");
    setNote("");
    setShowAddForm(false);
  };

  const handleExport = () => {
    const jsonStr = exportUserStateJSON(userState);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta6-companion-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = importUserStateJSON(text);
      if (result.success && result.state) {
        onRestoreState(result.state);
        setImportStatus("Backup successfully restored!");
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus(`Import failed: ${result.error}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Personal Markers & Portable State
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create custom tactical waypoints, take notes, and backup your progress across devices.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEnablePinMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isPinMode
                ? "bg-pink-600 text-white border-pink-400 shadow-lg shadow-pink-500/30 animate-pulse"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isPinMode ? "Click Map to Pin" : "Click-to-Pin Mode"}</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Waypoint</span>
          </button>
        </div>
      </div>

      {/* Manual Marker Modal / Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl border border-orange-500/30 bg-slate-900/90 space-y-3"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Create New Custom Waypoint
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Secret Stash Garage"
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Color Tag</label>
              <div className="flex items-center gap-2">
                {["#F97316", "#00F0FF", "#FF007A", "#10B981", "#7928CA", "#EAB308"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      color === c ? "border-white scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Coordinate X (0 - 4096)</label>
              <input
                type="number"
                min="0"
                max="4096"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Coordinate Y (0 - 4096)</label>
              <input
                type="number"
                min="0"
                max="4096"
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-xs">Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Parked banshee here, back alley getaway ready."
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs"
            >
              Add Waypoint
            </button>
          </div>
        </form>
      )}

      {/* Markers List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Saved Personal Waypoints ({markers.length})
        </h3>
        {markers.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center bg-slate-900/30 text-xs text-slate-500">
            No personal waypoints yet. Use &quot;Click-to-Pin Mode&quot; or &quot;Manual Waypoint&quot; to bookmark spots.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {markers.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-lg border border-slate-800 bg-slate-900/70 flex items-start justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: m.color }}
                    />
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    X: {m.coordinates.x} &bull; Y: {m.coordinates.y}
                  </div>
                  {m.note && <p className="text-xs text-slate-300 italic">&quot;{m.note}&quot;</p>}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onSelectOnMap(m)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
                    title="View on Map"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteMarker(m.id)}
                    className="p-1.5 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backup & Restore Section */}
      <div className="pt-6 border-t border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          State Backup & Sync (JSON Transfer)
        </h3>
        <p className="text-xs text-slate-400">
          Transfer your favorites, completed missions, and custom waypoints between your Xbox smartphone browser and PC without accounts or clouds.
        </p>

        {importStatus && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Backup (.json)</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import Backup (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
