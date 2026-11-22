"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Sidebar, ActiveView } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DetailPanel } from "@/components/map/DetailPanel";
import { UnifiedMapMarker } from "@/components/map/MapCanvas";

// Intelligence Views
import { VehicleFinder } from "@/components/vehicles/VehicleFinder";
import { MoneyFinder } from "@/components/money/MoneyFinder";
import { MissionGuide } from "@/components/missions/MissionGuide";
import { CollectiblesView } from "@/components/collectibles/CollectiblesView";
import { RoutePlanner } from "@/components/route/RoutePlanner";
import { CompletionTracker } from "@/components/tracker/CompletionTracker";
import { XboxGuide } from "@/components/xbox/XboxGuide";
import { MyLocations } from "@/components/personal/MyLocations";

// Datasets
import rawLocations from "@/data/locations.json";
import rawVehicles from "@/data/vehicles.json";
import rawMoney from "@/data/money-opportunities.json";
import rawMissions from "@/data/missions.json";
import rawCollectibles from "@/data/collectibles.json";
import rawCategories from "@/data/categories.json";
import rawXboxGuide from "@/data/xbox-guide.json";

// Types & Libs
import {
  LocationItem,
  VehicleItem,
  MoneyOpportunity,
  MissionItem,
  CollectibleItem,
  PersonalMarker,
  UserDataState,
  XboxGuideItem,
  MapPoint,
} from "@/types";
import { RouteStop } from "@/lib/route/optimizer";
import {
  loadUserState,
  saveUserState,
  DEFAULT_USER_STATE,
} from "@/lib/storage/user-state";

// Dynamic Import of MapCanvas with SSR disabled
const MapCanvas = dynamic(() => import("@/components/map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#060c18] flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 border-2 border-cyan-400 border-t-pink-500 rounded-full animate-spin" />
      <span className="text-xs font-mono text-slate-400 tracking-wider">
        INITIALIZING LEONIDA GIS ENGINE (CRS.SIMPLE)...
      </span>
    </div>
  ),
});

export default function CompanionApp() {
  const [activeView, setActiveView] = useState<ActiveView>("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarker, setSelectedMarker] = useState<UnifiedMapMarker | null>(null);
  const [isPinMode, setIsPinMode] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);

  // User State from LocalStorage
  const [userState, setUserState] = useState<UserDataState>(DEFAULT_USER_STATE);
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  // Active Map Layers
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    locations: true,
    vehicles: true,
    money: true,
    missions: true,
    collectibles: true,
    services: true,
    personal: true,
  });

  // Load state on mount
  useEffect(() => {
    const loaded = loadUserState();
    setUserState(loaded);
    setIsStateLoaded(true);
  }, []);

  // Save state on change
  const updateState = (updater: (prev: UserDataState) => UserDataState) => {
    setUserState((prev) => {
      const next = updater(prev);
      saveUserState(next);
      return next;
    });
  };

  // Convert raw datasets into Unified Map Markers
  const unifiedMarkers: UnifiedMapMarker[] = useMemo(() => {
    const list: UnifiedMapMarker[] = [];

    // 1. Locations
    (rawLocations as LocationItem[]).forEach((loc) => {
      list.push({
        id: loc.id,
        name: loc.name,
        category: "locations",
        regionId: loc.regionId,
        coordinates: loc.coordinates,
        description: loc.description,
        color: "#00F0FF",
        verificationStatus: loc.verificationStatus,
        rawItem: loc,
      });
    });

    // 2. Vehicles
    (rawVehicles as VehicleItem[]).forEach((veh) => {
      if (veh.coordinates) {
        list.push({
          id: veh.id,
          name: `${veh.name} (${veh.trackerStatus === "NON_TRACKER" ? "Non-Tracker" : "Tracker"})`,
          category: "vehicles",
          regionId: veh.regionId,
          coordinates: veh.coordinates,
          description: veh.acquisitionMethod,
          color: "#FF007A",
          verificationStatus: veh.verificationStatus,
          rawItem: veh,
        });
      }
    });

    // 3. Money Opportunities
    (rawMoney as MoneyOpportunity[]).forEach((m) => {
      if (m.coordinates) {
        list.push({
          id: m.id,
          name: m.title,
          category: "money",
          regionId: m.regionId,
          coordinates: m.coordinates,
          description: `Payout: $${m.minPayout.toLocaleString()} - $${m.maxPayout.toLocaleString()} | Risk: ${m.riskLevel}`,
          color: "#10B981",
          verificationStatus: m.verificationStatus,
          rawItem: m,
        });
      }
    });

    // 4. Missions
    (rawMissions as MissionItem[]).forEach((mis) => {
      if (mis.coordinates) {
        list.push({
          id: mis.id,
          name: mis.title,
          category: "missions",
          coordinates: mis.coordinates,
          description: mis.summary,
          color: "#FFB800",
          verificationStatus: mis.verificationStatus,
          rawItem: mis,
        });
      }
    });

    // 5. Collectibles
    (rawCollectibles as CollectibleItem[]).forEach((c) => {
      list.push({
        id: c.id,
        name: `${c.name} (${c.set})`,
        category: "collectibles",
        regionId: c.regionId,
        coordinates: c.coordinates,
        description: c.clue,
        color: "#7928CA",
        verificationStatus: c.verificationStatus,
        rawItem: c,
      });
    });

    // 6. User Personal Markers
    userState.personalMarkers.forEach((pm) => {
      list.push({
        id: pm.id,
        name: pm.title,
        category: "personal",
        coordinates: pm.coordinates,
        description: pm.note,
        color: pm.color || "#F97316",
        isPersonal: true,
        verificationStatus: "CONFIRMED",
        rawItem: pm,
      });
    });

    return list;
  }, [userState.personalMarkers]);

  // Route Stops derived from activeRouteIds
  const routeStops: RouteStop[] = useMemo(() => {
    return userState.activeRouteIds
      .map((id) => {
        const m = unifiedMarkers.find((item) => item.id === id);
        if (!m) return null;
        return {
          id: m.id,
          name: m.name,
          category: m.category,
          coordinates: m.coordinates,
        };
      })
      .filter((stop): stop is RouteStop => stop !== null);
  }, [userState.activeRouteIds, unifiedMarkers]);

  // Actions
  // Layer Stats (Found / Total per Category for MapGenie-style counters)
  const layerStats = useMemo(() => {
    const stats: Record<string, { found: number; total: number }> = {};
    rawCategories.forEach((cat) => {
      const itemsInCat = unifiedMarkers.filter((m) => m.category === cat.id);
      const foundInCat = itemsInCat.filter((m) => userState.foundItemIds.includes(m.id));
      stats[cat.id] = { found: foundInCat.length, total: itemsInCat.length };
    });
    return stats;
  }, [unifiedMarkers, userState.foundItemIds]);

  const handleShowAllLayers = () => {
    const allTrue: Record<string, boolean> = {};
    rawCategories.forEach((c) => {
      allTrue[c.id] = true;
    });
    setActiveLayers(allTrue);
  };

  const handleHideAllLayers = () => {
    const allFalse: Record<string, boolean> = {};
    rawCategories.forEach((c) => {
      allFalse[c.id] = false;
    });
    setActiveLayers(allFalse);
  };

  const handleToggleLayer = (layerId: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: prev[layerId] === false ? true : false,
    }));
  };

  const handleToggleFound = (id: string) => {
    updateState((prev) => {
      const exists = prev.foundItemIds.includes(id);
      return {
        ...prev,
        foundItemIds: exists
          ? prev.foundItemIds.filter((item) => item !== id)
          : [...prev.foundItemIds, id],
      };
    });
  };

  const handleToggleFavorite = (id: string) => {
    updateState((prev) => {
      const exists = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((item) => item !== id)
          : [...prev.favorites, id],
      };
    });
  };

  const handleToggleMissionComplete = (id: string) => {
    updateState((prev) => {
      const exists = prev.completedMissionIds.includes(id);
      return {
        ...prev,
        completedMissionIds: exists
          ? prev.completedMissionIds.filter((item) => item !== id)
          : [...prev.completedMissionIds, id],
      };
    });
  };

  const handleToggleRoute = (marker: { id: string }) => {
    updateState((prev) => {
      const exists = prev.activeRouteIds.includes(marker.id);
      return {
        ...prev,
        activeRouteIds: exists
          ? prev.activeRouteIds.filter((item) => item !== marker.id)
          : [...prev.activeRouteIds, marker.id],
      };
    });
  };

  const handleSaveNote = (id: string, note: string) => {
    updateState((prev) => ({
      ...prev,
      personalNotes: {
        ...prev.personalNotes,
        [id]: note,
      },
    }));
  };

  const handleAddPersonalMarker = (markerData: Omit<PersonalMarker, "id" | "createdAt">) => {
    const newMarker: PersonalMarker = {
      ...markerData,
      id: `personal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    updateState((prev) => ({
      ...prev,
      personalMarkers: [...prev.personalMarkers, newMarker],
    }));
  };

  const handleDeletePersonalMarker = (id: string) => {
    updateState((prev) => ({
      ...prev,
      personalMarkers: prev.personalMarkers.filter((m) => m.id !== id),
    }));
    if (selectedMarker?.id === id) {
      setSelectedMarker(null);
    }
  };

  const handleMapClickAddPersonal = (point: MapPoint) => {
    const title = prompt("Enter title for your waypoint:");
    if (title && title.trim()) {
      handleAddPersonalMarker({
        title: title.trim(),
        coordinates: point,
        color: "#F97316",
        note: `Placed at X: ${point.x}, Y: ${point.y}`,
      });
      setIsPinMode(false);
    }
  };

  const handleSelectOnMap = (item: { id: string; coordinates?: MapPoint }) => {
    const found = unifiedMarkers.find((m) => m.id === item.id);
    if (found) {
      setSelectedMarker(found);
      setActiveView("map");
    }
  };

  const handleResetAllData = () => {
    updateState(() => DEFAULT_USER_STATE);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080d1a] text-slate-100">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onResetView={() => setSelectedMarker(null)}
        favoritesCount={userState.favorites.length}
        totalFoundCount={userState.foundItemIds.length}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeView={activeView}
          onViewChange={(v) => {
            setActiveView(v);
            if (v !== "map") setSelectedMarker(null);
          }}
          activeLayers={activeLayers}
          onToggleLayer={handleToggleLayer}
          onShowAllLayers={handleShowAllLayers}
          onHideAllLayers={handleHideAllLayers}
          categories={rawCategories}
          layerStats={layerStats}
          routeStopCount={userState.activeRouteIds.length}
        />

        {/* Center Content / Active View */}
        <main className="flex-1 relative overflow-y-auto">
          {activeView === "map" && (
            <div className="w-full h-full relative">
              <MapCanvas
                markers={unifiedMarkers}
                selectedMarkerId={selectedMarker?.id}
                onSelectMarker={setSelectedMarker}
                activeLayers={activeLayers}
                searchQuery={searchQuery}
                routeStops={routeStops}
                onMapClickAddPersonal={handleMapClickAddPersonal}
                isPinMode={isPinMode}
                foundIds={userState.foundItemIds}
                onToggleFound={handleToggleFound}
                onToggleRoute={handleToggleRoute}
                isInRoute={(id) => userState.activeRouteIds.includes(id)}
              />
            </div>
          )}

          {activeView === "vehicles" && (
            <VehicleFinder
              vehicles={rawVehicles as VehicleItem[]}
              onSelectOnMap={handleSelectOnMap}
              onAddToRoute={handleToggleRoute}
              routeIds={userState.activeRouteIds}
            />
          )}

          {activeView === "money" && (
            <MoneyFinder
              opportunities={rawMoney as MoneyOpportunity[]}
              onSelectOnMap={handleSelectOnMap}
              onAddToRoute={handleToggleRoute}
              routeIds={userState.activeRouteIds}
            />
          )}

          {activeView === "missions" && (
            <MissionGuide
              missions={rawMissions as MissionItem[]}
              completedIds={userState.completedMissionIds}
              onToggleComplete={handleToggleMissionComplete}
              onSelectOnMap={handleSelectOnMap}
            />
          )}

          {activeView === "collectibles" && (
            <CollectiblesView
              collectibles={rawCollectibles as CollectibleItem[]}
              foundIds={userState.foundItemIds}
              onToggleFound={handleToggleFound}
              onSelectOnMap={handleSelectOnMap}
            />
          )}

          {activeView === "route" && (
            <RoutePlanner
              stops={routeStops}
              onUpdateStops={(newStops) => {
                updateState((prev) => ({
                  ...prev,
                  activeRouteIds: newStops.map((s) => s.id),
                }));
              }}
              onViewOnMap={() => setActiveView("map")}
              onClearRoute={() => {
                updateState((prev) => ({
                  ...prev,
                  activeRouteIds: [],
                }));
              }}
            />
          )}

          {activeView === "tracker" && (
            <CompletionTracker
              totalLocations={rawLocations.length}
              foundLocationsCount={
                rawLocations.filter((l) => userState.foundItemIds.includes(l.id)).length
              }
              totalVehicles={rawVehicles.length}
              foundVehiclesCount={
                rawVehicles.filter((v) => userState.foundItemIds.includes(v.id)).length
              }
              totalMissions={rawMissions.length}
              completedMissionsCount={userState.completedMissionIds.length}
              totalCollectibles={rawCollectibles.length}
              foundCollectiblesCount={
                rawCollectibles.filter((c) => userState.foundItemIds.includes(c.id)).length
              }
              onResetAllData={handleResetAllData}
            />
          )}

          {activeView === "xbox" && (
            <XboxGuide guideItems={rawXboxGuide as XboxGuideItem[]} />
          )}

          {activeView === "personal" && (
            <MyLocations
              markers={userState.personalMarkers}
              userState={userState}
              onAddMarker={handleAddPersonalMarker}
              onDeleteMarker={handleDeletePersonalMarker}
              onSelectOnMap={(m) => {
                setSelectedMarker({
                  id: m.id,
                  name: m.title,
                  category: "personal",
                  coordinates: m.coordinates,
                  description: m.note,
                  color: m.color || "#F97316",
                  isPersonal: true,
                });
                setActiveView("map");
              }}
              onRestoreState={(st) => setUserState(st)}
              onEnablePinMode={() => {
                setIsPinMode(true);
                setActiveView("map");
              }}
              isPinMode={isPinMode}
            />
          )}
        </main>

        {/* Right Detail Panel (visible on Map view when a marker is selected) */}
        {activeView === "map" && selectedMarker && (
          <DetailPanel
            marker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
            isFound={userState.foundItemIds.includes(selectedMarker.id)}
            onToggleFound={handleToggleFound}
            isFavorite={userState.favorites.includes(selectedMarker.id)}
            onToggleFavorite={handleToggleFavorite}
            isInRoute={userState.activeRouteIds.includes(selectedMarker.id)}
            onToggleRoute={handleToggleRoute}
            userNote={userState.personalNotes[selectedMarker.id]}
            onSaveNote={handleSaveNote}
          />
        )}
      </div>

      {/* Mobile Drawer when "More" is tapped */}
      {showMobileMore && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end"
          onClick={() => setShowMobileMore(false)}
        >
          <div
            className="bg-[#090f1f] border-t border-slate-800 rounded-t-2xl p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Additional Modules
            </h3>
            <button
              onClick={() => {
                setActiveView("route");
                setShowMobileMore(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg bg-slate-800/80 text-sm font-semibold flex items-center justify-between"
            >
              <span>Route Planner</span>
              <span className="text-xs text-cyan-400 font-mono">
                {userState.activeRouteIds.length} stops
              </span>
            </button>
            <button
              onClick={() => {
                setActiveView("collectibles");
                setShowMobileMore(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg bg-slate-800/80 text-sm font-semibold"
            >
              Collectibles & Secrets
            </button>
            <button
              onClick={() => {
                setActiveView("xbox");
                setShowMobileMore(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg bg-slate-800/80 text-sm font-semibold"
            >
              Xbox Series X Guide & Cheats
            </button>
            <button
              onClick={() => {
                setActiveView("personal");
                setShowMobileMore(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg bg-slate-800/80 text-sm font-semibold"
            >
              My Pinned Markers & Backup
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          if (v !== "map") setSelectedMarker(null);
        }}
        onOpenMore={() => setShowMobileMore(true)}
        routeCount={userState.activeRouteIds.length}
      />
    </div>
  );
}
