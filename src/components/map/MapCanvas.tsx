"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapPoint, BasemapConfig, BasemapMode } from "@/types";
import {
  mapPointToLeaflet,
  leafletToMapPoint,
  WORLD_BOUNDS,
} from "@/lib/map/coordinates";
import { Layers, Settings, CheckCircle2, Route, Info } from "lucide-react";

export interface UnifiedMapMarker {
  id: string;
  name: string;
  category: string;
  regionId?: string;
  coordinates: MapPoint;
  description?: string;
  color: string;
  verificationStatus?: string;
  isPersonal?: boolean;
  rawItem?: any;
}

interface MapCanvasProps {
  markers: UnifiedMapMarker[];
  selectedMarkerId?: string;
  onSelectMarker: (marker: UnifiedMapMarker | null) => void;
  activeLayers: Record<string, boolean>;
  searchQuery?: string;
  routeStops?: Array<{ id: string; coordinates: MapPoint }>;
  onMapClickAddPersonal?: (point: MapPoint) => void;
  isPinMode?: boolean;
  foundIds?: string[];
  onToggleFound?: (id: string) => void;
  onToggleRoute?: (marker: UnifiedMapMarker) => void;
  isInRoute?: (id: string) => boolean;
}

export default function MapCanvas({
  markers,
  selectedMarkerId,
  onSelectMarker,
  activeLayers,
  searchQuery = "",
  routeStops = [],
  onMapClickAddPersonal,
  isPinMode = false,
  foundIds = [],
  onToggleFound,
  onToggleRoute,
  isInRoute,
}: MapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const basemapLayerRef = useRef<L.Layer | null>(null);

  const [cursorPos, setCursorPos] = useState<MapPoint | null>(null);

  // Basemap Configuration (supports IGN/MapGenie tile servers, custom images, and vector SVG)
  const [basemapMode, setBasemapMode] = useState<BasemapMode>("dark_gis");
  const [tileUrlInput, setTileUrlInput] = useState<string>("/tiles/{z}/{x}/{y}.png");
  const [customImageUrlInput, setCustomImageUrlInput] = useState<string>("/images/leonida-basemap.svg");
  const [showBasemapSettings, setShowBasemapSettings] = useState<boolean>(false);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const southWest = L.latLng(0, 0);
    const northEast = L.latLng(WORLD_BOUNDS.height, WORLD_BOUNDS.width);
    const bounds = L.latLngBounds(southWest, northEast);

    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 3,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      maxBounds: bounds.pad(0.15),
      maxBoundsViscosity: 0.85,
      attributionControl: false,
    });

    // Initial default image overlay
    const initialOverlay = L.imageOverlay("/images/leonida-basemap.svg", bounds).addTo(map);
    basemapLayerRef.current = initialOverlay;

    // Center view
    const centerPoint = mapPointToLeaflet({ x: 2800, y: 2200 });
    map.setView(centerPoint, -0.5);

    // Layer groups for markers & route polylines
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);

    // Mouse tracking
    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      const pt = leafletToMapPoint(e.latlng.lat, e.latlng.lng);
      setCursorPos(pt);
    });

    map.on("mouseout", () => {
      setCursorPos(null);
    });

    // Map click
    map.on("click", (e: L.LeafletMouseEvent) => {
      const pt = leafletToMapPoint(e.latlng.lat, e.latlng.lng);
      if (isPinMode && onMapClickAddPersonal) {
        onMapClickAddPersonal(pt);
      } else {
        onSelectMarker(null);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Layer when mode or custom URLs change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const southWest = L.latLng(0, 0);
    const northEast = L.latLng(WORLD_BOUNDS.height, WORLD_BOUNDS.width);
    const bounds = L.latLngBounds(southWest, northEast);

    // Remove existing basemap layer
    if (basemapLayerRef.current) {
      map.removeLayer(basemapLayerRef.current);
      basemapLayerRef.current = null;
    }

    if (basemapMode === "custom_tiles") {
      // MapGenie / XYZ Slippy Map Tiles Layer
      const tileLayer = L.tileLayer(tileUrlInput, {
        minZoom: -2,
        maxZoom: 3,
        bounds: bounds,
        noWrap: true,
      });
      tileLayer.addTo(map);
      basemapLayerRef.current = tileLayer;
    } else if (basemapMode === "custom_image") {
      // Custom High-Res Image Overlay
      const imgLayer = L.imageOverlay(customImageUrlInput, bounds);
      imgLayer.addTo(map);
      basemapLayerRef.current = imgLayer;
    } else {
      // Default Vector SVG Basemap
      const svgLayer = L.imageOverlay("/images/leonida-basemap.svg", bounds);
      svgLayer.addTo(map);
      basemapLayerRef.current = svgLayer;
    }
  }, [basemapMode, tileUrlInput, customImageUrlInput]);

  // Click-to-Pin Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.off("click");
    map.on("click", (e: L.LeafletMouseEvent) => {
      const pt = leafletToMapPoint(e.latlng.lat, e.latlng.lng);
      if (isPinMode && onMapClickAddPersonal) {
        onMapClickAddPersonal(pt);
      } else {
        onSelectMarker(null);
      }
    });
  }, [isPinMode, onMapClickAddPersonal, onSelectMarker]);

  // Render Markers & MapGenie-style Interactive Popups
  useEffect(() => {
    const layerGroup = markersLayerGroupRef.current;
    if (!layerGroup || !mapInstanceRef.current) return;

    layerGroup.clearLayers();

    const query = searchQuery.trim().toLowerCase();

    markers.forEach((m) => {
      if (activeLayers[m.category] === false) return;

      if (query) {
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesCategory = m.category.toLowerCase().includes(query);
        const matchesDesc = (m.description || "").toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) return;
      }

      const isSelected = m.id === selectedMarkerId;
      const isFound = foundIds.includes(m.id);
      const latLng = mapPointToLeaflet(m.coordinates);

      // Icon: dimmed if found (MapGenie style)
      const iconHtml = `
        <div class="relative group cursor-pointer flex items-center justify-center">
          <div class="w-7 h-7 rounded-full flex items-center justify-center transition-all transform ${
            isSelected
              ? "scale-125 ring-2 ring-white shadow-lg"
              : "hover:scale-110"
          } ${isFound ? "opacity-40 grayscale" : "opacity-100"}" style="background-color: ${
        m.color
      }; box-shadow: 0 0 10px ${m.color}88;">
            <div class="w-3 h-3 rounded-full bg-white/90"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-gta-marker",
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const leafletMarker = L.marker(latLng, { icon: customIcon });

      // MapGenie-style Popup Content
      const popupHtml = document.createElement("div");
      popupHtml.className = "text-xs space-y-2 p-1 min-w-[190px]";
      popupHtml.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5">
          <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded text-white" style="background-color: ${m.color}aa;">
            ${m.category}
          </span>
          <span class="text-[10px] text-slate-400 font-mono">${m.coordinates.x}, ${m.coordinates.y}</span>
        </div>
        <div class="font-bold text-sm text-white leading-tight">${m.name}</div>
        ${m.description ? `<p class="text-[11px] text-slate-300 line-clamp-2">${m.description}</p>` : ""}
        <div class="pt-1.5 border-t border-slate-700/80 flex items-center justify-between gap-1">
          <button id="btn-toggle-found-${m.id}" class="px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 ${
        isFound
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }">
            ${isFound ? "✓ Found" : "Mark Found"}
          </button>
          <button id="btn-open-panel-${m.id}" class="px-2 py-1 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30">
            Details →
          </button>
        </div>
      `;

      // Attach click listeners to popup buttons
      leafletMarker.bindPopup(popupHtml, {
        closeButton: false,
        className: "mapgenie-style-popup",
      });

      leafletMarker.on("popupopen", () => {
        const foundBtn = document.getElementById(`btn-toggle-found-${m.id}`);
        if (foundBtn && onToggleFound) {
          foundBtn.onclick = (e) => {
            e.stopPropagation();
            onToggleFound(m.id);
            leafletMarker.closePopup();
          };
        }

        const openBtn = document.getElementById(`btn-open-panel-${m.id}`);
        if (openBtn) {
          openBtn.onclick = (e) => {
            e.stopPropagation();
            onSelectMarker(m);
            leafletMarker.closePopup();
          };
        }
      });

      leafletMarker.on("click", (e: L.LeafletEvent) => {
        L.DomEvent.stopPropagation(e);
        onSelectMarker(m);
      });

      leafletMarker.addTo(layerGroup);
    });
  }, [markers, selectedMarkerId, activeLayers, searchQuery, foundIds, onSelectMarker, onToggleFound]);

  // Pan to selected marker
  useEffect(() => {
    if (!selectedMarkerId || !mapInstanceRef.current) return;
    const target = markers.find((m) => m.id === selectedMarkerId);
    if (target) {
      const latLng = mapPointToLeaflet(target.coordinates);
      mapInstanceRef.current.panTo(latLng, { animate: true, duration: 0.5 });
    }
  }, [selectedMarkerId, markers]);

  // Render Route Polyline
  useEffect(() => {
    const routeGroup = routeLayerGroupRef.current;
    if (!routeGroup || !mapInstanceRef.current) return;

    routeGroup.clearLayers();

    if (routeStops.length >= 2) {
      const latLngs = routeStops.map((stop) => mapPointToLeaflet(stop.coordinates));
      const polyline = L.polyline(latLngs, {
        color: "#00f0ff",
        weight: 3.5,
        dashArray: "8, 6",
        opacity: 0.85,
      });
      polyline.addTo(routeGroup);
    }
  }, [routeStops]);

  return (
    <div className="relative w-full h-full bg-[#060c18] overflow-hidden select-none">
      {/* Leaflet Map DOM */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Pin Mode Indicator Banner */}
      {isPinMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-pink-600/90 text-white text-xs font-semibold shadow-xl border border-pink-400 flex items-center gap-2 animate-pulse">
          <span>Click anywhere on the map to place your personal waypoint</span>
        </div>
      )}

      {/* Basemap Switcher & Settings Floating Button (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        <button
          onClick={() => setShowBasemapSettings(!showBasemapSettings)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090f1f]/90 backdrop-blur-md border border-slate-700 text-xs text-slate-200 hover:text-cyan-400 transition shadow-xl"
          title="Basemap & Tile Configuration (MapGenie / Custom XYZ)"
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline font-semibold">Basemap Source</span>
        </button>

        {showBasemapSettings && (
          <div className="w-72 sm:w-80 p-4 rounded-xl bg-[#090f1f]/95 backdrop-blur-lg border border-slate-700 shadow-2xl text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-cyan-400" />
                <span>Map Tile Configuration</span>
              </span>
              <button
                onClick={() => setShowBasemapSettings(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Mode selection */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Select Mode:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setBasemapMode("dark_gis")}
                  className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border transition ${
                    basemapMode === "dark_gis"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                >
                  Dark GIS Vector
                </button>
                <button
                  onClick={() => setBasemapMode("custom_tiles")}
                  className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border transition ${
                    basemapMode === "custom_tiles"
                      ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                      : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                >
                  XYZ Tiles (IGN/MapGenie)
                </button>
              </div>
              <button
                onClick={() => setBasemapMode("custom_image")}
                className={`w-full px-2.5 py-1.5 rounded text-[11px] font-semibold border transition ${
                  basemapMode === "custom_image"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200"
                }`}
              >
                Custom High-Res Raster Image Overlay
              </button>
            </div>

            {/* XYZ Tile URL Template Input */}
            {basemapMode === "custom_tiles" && (
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-medium">
                  Tile URL Template ({`{z}/{x}/{y}`}):
                </label>
                <input
                  type="text"
                  value={tileUrlInput}
                  onChange={(e) => setTileUrlInput(e.target.value)}
                  placeholder="https://.../{z}/{x}/{y}.png or /tiles/{z}/{x}/{y}.png"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                />
                <span className="text-[10px] text-slate-500 block">
                  Tip: Point to your local `/tiles/{`{z}/{x}/{y}`}.png` or online MapGenie tile endpoint.
                </span>
              </div>
            )}

            {/* Custom Image URL Input */}
            {basemapMode === "custom_image" && (
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-medium">Image URL or Local Path:</label>
                <input
                  type="text"
                  value={customImageUrlInput}
                  onChange={(e) => setCustomImageUrlInput(e.target.value)}
                  placeholder="/images/your_map.jpg or https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Coordinate & GIS Status HUD */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-md bg-[#090f1f]/85 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-400">CRS:</span>
          <span className="text-cyan-400 font-semibold">Leonida 2D (4096px)</span>
        </div>
        <span className="text-slate-600">|</span>
        <div>
          {cursorPos ? (
            <span>
              X: <span className="text-[#00f0ff]">{cursorPos.x}</span> &bull; Y:{" "}
              <span className="text-[#ff007a]">{cursorPos.y}</span>
            </span>
          ) : (
            <span className="text-slate-500">Hover over map for coordinates</span>
          )}
        </div>
      </div>
    </div>
  );
}
