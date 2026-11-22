import { PersonalMarker, UserDataState } from "@/types";

const STORAGE_KEY = "gta6_companion_user_state_v1";

export const DEFAULT_USER_STATE: UserDataState = {
  version: 1,
  favorites: [],
  foundItemIds: [],
  completedMissionIds: [],
  personalMarkers: [],
  personalNotes: {},
  activeRouteIds: [],
  lastSaved: new Date().toISOString(),
};

export function loadUserState(): UserDataState {
  if (typeof window === "undefined") {
    return DEFAULT_USER_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER_STATE,
      ...parsed,
    };
  } catch (err) {
    console.error("Failed to load user state from localStorage:", err);
    return DEFAULT_USER_STATE;
  }
}

export function saveUserState(state: UserDataState): void {
  if (typeof window === "undefined") return;

  try {
    const payload = {
      ...state,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to save user state to localStorage:", err);
  }
}

export function exportUserStateJSON(state: UserDataState): string {
  return JSON.stringify(state, null, 2);
}

export function importUserStateJSON(jsonString: string): { success: boolean; state?: UserDataState; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== "object" || parsed === null) {
      return { success: false, error: "Invalid JSON format." };
    }
    const validatedState: UserDataState = {
      version: 1,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      foundItemIds: Array.isArray(parsed.foundItemIds) ? parsed.foundItemIds : [],
      completedMissionIds: Array.isArray(parsed.completedMissionIds) ? parsed.completedMissionIds : [],
      personalMarkers: Array.isArray(parsed.personalMarkers) ? parsed.personalMarkers : [],
      personalNotes: typeof parsed.personalNotes === "object" && parsed.personalNotes !== null ? parsed.personalNotes : {},
      activeRouteIds: Array.isArray(parsed.activeRouteIds) ? parsed.activeRouteIds : [],
      lastSaved: new Date().toISOString(),
    };
    saveUserState(validatedState);
    return { success: true, state: validatedState };
  } catch (err: any) {
    return { success: false, error: err?.message || "Parsing error." };
  }
}
