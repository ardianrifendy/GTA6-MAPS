"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapPoint } from "@/types";
import {
  mapPointToLeaflet,
  leafletToMapPoint,
  WORLD_BOUNDS,
} from "@/lib/map/coordinates";

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
}: MapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [cursorPos, setCursorPos] = useState<MapPoint | null>(null);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Fictional world bounds: (0, 0) top-left, (4096, 4096) bottom-right
    // In CRS.Simple with Leaflet: top-left is [4096, 0], bottom-right is [0, 4096]
    const southWest = L.latLng(0, 0);
    const northEast = L.latLng(WORLD_BOUNDS.height, WORLD_BOUNDS.width);
    const bounds = L.latLngBounds(southWest, northEast);

    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      maxBounds: bounds.pad(0.1),
      maxBoundsViscosity: 0.8,
      attributionControl: false,
    });

    // Add SVG Basemap Overlay
    L.imageOverlay("/images/leonida-basemap.svg", bounds).addTo(map);

    // Initial View: Center around Vice City Downtown & Ocean Beach
    const centerPoint = mapPointToLeaflet({ x: 2800, y: 2200 });
    map.setView(centerPoint, -0.5);

    // Create layer groups for markers & route polylines
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);

    // Mouse move coordinate tracker
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

  // Sync click listener when isPinMode or onMapClickAddPersonal changes
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

  // Update Markers when filters, markers, or selection change
  useEffect(() => {
    const layerGroup = markersLayerGroupRef.current;
    if (!layerGroup || !mapInstanceRef.current) return;

    layerGroup.clearLayers();

    const query = searchQuery.trim().toLowerCase();

    markers.forEach((m) => {
      // Check active layers
      if (activeLayers[m.category] === false) return;

      // Check search filter
      if (query) {
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesCategory = m.category.toLowerCase().includes(query);
        const matchesDesc = (m.description || "").toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) return;
      }

      const isSelected = m.id === selectedMarkerId;
      const latLng = mapPointToLeaflet(m.coordinates);

      // Create stylish custom SVG HTML icon
      const iconHtml = `
        <div class="relative group cursor-pointer flex items-center justify-center">
          <div class="w-7 h-7 rounded-full flex items-center justify-center transition-transform transform ${
            isSelected ? "scale-125 ring-2 ring-white" : "hover:scale-110"
          }" style="background-color: ${m.color}; box-shadow: 0 0 12px ${m.color}88;">
            <div class="w-3 h-3 rounded-full bg-white/90"></div>
          </div>
          ${
            isSelected
              ? `<span class="absolute -top-7 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-white whitespace-nowrap font-bold shadow-lg">${m.name}</span>`
              : ""
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-gta-marker",
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const leafletMarker = L.marker(latLng, { icon: customIcon });

      leafletMarker.on("click", (e: L.LeafletEvent) => {
        L.DomEvent.stopPropagation(e);
        onSelectMarker(m);
      });

      leafletMarker.addTo(layerGroup);
    });
  }, [markers, selectedMarkerId, activeLayers, searchQuery, onSelectMarker]);

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

      // Straight-line visual path with neon cyan glow
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
      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Pin Mode Indicator Banner */}
      {isPinMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-pink-600/90 text-white text-xs font-semibold shadow-xl border border-pink-400 flex items-center gap-2 animate-pulse">
          <span>Click anywhere on the map to place your personal waypoint</span>
        </div>
      )}

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

      {/* Map Legend (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 hidden lg:flex flex-col gap-1 p-2.5 rounded-lg bg-[#090f1f]/90 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 shadow-xl">
        <span className="font-bold text-slate-400 uppercase tracking-wider mb-1">
          Quick Legend
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]" />
          <span>Locations & POIs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff007a]" />
          <span>Vehicles (Hunter)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          <span>Money & Farming</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffb800]" />
          <span>Missions & Heists</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7928ca]" />
          <span>Collectibles</span>
        </div>
      </div>
    </div>
  );
}
