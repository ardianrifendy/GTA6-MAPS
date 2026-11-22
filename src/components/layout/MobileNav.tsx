"use client";

import React from "react";
import { Map, Car, DollarSign, Target, CheckCircle2, Menu } from "lucide-react";
import { ActiveView } from "./Sidebar";

interface MobileNavProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onOpenMore: () => void;
  routeCount: number;
}

export function MobileNav({
  activeView,
  onViewChange,
  onOpenMore,
  routeCount,
}: MobileNavProps) {
  const items = [
    { id: "map", label: "Map", icon: Map },
    { id: "vehicles", label: "Cars", icon: Car },
    { id: "money", label: "Money", icon: DollarSign },
    { id: "missions", label: "Missions", icon: Target },
    { id: "tracker", label: "Tracker", icon: CheckCircle2 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090f1f]/95 backdrop-blur-lg border-t border-slate-800 flex items-center justify-around px-2 z-40">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ActiveView)}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition ${
              isActive
                ? "text-[#00f0ff] font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer trigger */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center w-14 py-1 text-slate-400 hover:text-slate-200 relative transition"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">More</span>
        {routeCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#ff007a]" />
        )}
      </button>
    </nav>
  );
}
