export type VerificationStatus =
  | "CONFIRMED"
  | "VERIFIED_COMMUNITY"
  | "COMMUNITY_REPORTED"
  | "UNVERIFIED"
  | "UNKNOWN";

export interface SourceReference {
  title: string;
  url?: string;
  publisher?: string;
  sourceType: "official" | "trailer" | "mapping_project" | "leak_analysis" | "community";
  accessedAt?: string;
  notes?: string;
}

export interface MapPoint {
  x: number;
  y: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  count?: number;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  description: string;
  highlightColor?: string;
}

export interface LocationItem {
  id: string;
  name: string;
  category: string;
  regionId: string;
  coordinates: MapPoint;
  description: string;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
  tags?: string[];
  isInterior?: boolean;
}

export type VehicleClass =
  | "Super"
  | "Sports"
  | "Muscle"
  | "SUV"
  | "Sedan"
  | "Coupe"
  | "Off-Road"
  | "Motorcycle"
  | "Boat"
  | "Helicopter"
  | "Plane"
  | "Commercial"
  | "Emergency";

export type TrackerStatus = "TRACKER" | "NON_TRACKER" | "UNKNOWN";
export type TrackerRemovalStatus = "CONFIRMED_AVAILABLE" | "NOT_AVAILABLE" | "UNKNOWN";
export type SellingEligibility = "SELLABLE" | "NON_SELLABLE" | "UNKNOWN";
export type StorageEligibility = "CAN_STORE_GARAGE" | "CANNOT_STORE" | "UNKNOWN";

export interface VehicleItem {
  id: string;
  name: string;
  manufacturer: string;
  class: VehicleClass;
  trackerStatus: TrackerStatus;
  trackerRemovalMethod: TrackerRemovalStatus;
  sellingEligibility: SellingEligibility;
  estimatedAcquisitionCost: number | "UNKNOWN";
  confirmedResalePrice: number | "UNKNOWN";
  storageEligibility: StorageEligibility;
  acquisitionMethod: string;
  coordinates?: MapPoint;
  regionId?: string;
  spawnConditions?: string;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
}

export type MoneyType =
  | "FAST_CASH"
  | "HIGH_VALUE"
  | "REPEATABLE_FARMING"
  | "PASSIVE_INCOME";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Repeatability = "ONE_TIME" | "COOLDOWN_BASED" | "INFINITE";

export interface MoneyOpportunity {
  id: string;
  title: string;
  type: MoneyType;
  minPayout: number;
  maxPayout: number;
  estimatedMinutes: number | "UNKNOWN";
  repeatability: Repeatability;
  cooldownMinutes?: number;
  riskLevel: RiskLevel;
  difficulty: Difficulty;
  prerequisites?: string[];
  coordinates?: MapPoint;
  regionId?: string;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
}

export type MissionType = "STORY" | "STRANGER" | "HEIST" | "SIDE_JOB" | "BOUNTY";

export interface MissionItem {
  id: string;
  title: string;
  type: MissionType;
  giver?: string;
  prerequisites?: string[];
  unlocks?: string[];
  rewards?: {
    cash?: number;
    items?: string[];
  };
  hasSpoilers: boolean;
  summary: string;
  coordinates?: MapPoint;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
}

export interface CollectibleItem {
  id: string;
  name: string;
  set: string;
  setTotal: number;
  setIndex: number;
  coordinates: MapPoint;
  regionId: string;
  clue?: string;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
}

export interface XboxGuideItem {
  id: string;
  title: string;
  category: "CONTROLS" | "CHEAT_CODES" | "SHORTCUTS" | "GAMEPLAY_TIPS";
  inputSequence?: string[];
  effect: string;
  disablesAchievements: boolean;
  verificationStatus: VerificationStatus;
  sources: SourceReference[];
}

export interface PersonalMarker {
  id: string;
  title: string;
  note?: string;
  color: string;
  coordinates: MapPoint;
  createdAt: string;
}

export interface UserDataState {
  version: number;
  favorites: string[];
  foundItemIds: string[];
  completedMissionIds: string[];
  personalMarkers: PersonalMarker[];
  personalNotes: Record<string, string>;
  activeRouteIds: string[];
  lastSaved: string;
}
