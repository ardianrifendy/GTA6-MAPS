import { MapPoint } from "@/types";

export const WORLD_BOUNDS = {
  width: 4096,
  height: 4096,
  minX: 0,
  minY: 0,
  maxX: 4096,
  maxY: 4096,
};

/**
 * Converts a Cartesian map point {x, y} to Leaflet's CRS.Simple [lat, lng].
 * In Leaflet CRS.Simple:
 * Lat corresponds to Y axis, Lng corresponds to X axis.
 * To keep top-left as (0, 0) and bottom-right as (4096, 4096),
 * we invert Y so positive visual down corresponds to lower Leaflet latitude.
 */
export function mapPointToLeaflet(point: MapPoint): [number, number] {
  // Leaflet CRS.Simple: [lat, lng] -> [WORLD_BOUNDS.height - point.y, point.x]
  const clampedX = Math.max(0, Math.min(WORLD_BOUNDS.width, point.x));
  const clampedY = Math.max(0, Math.min(WORLD_BOUNDS.height, point.y));
  return [WORLD_BOUNDS.height - clampedY, clampedX];
}

/**
 * Converts Leaflet CRS.Simple [lat, lng] back to {x, y} MapPoint.
 */
export function leafletToMapPoint(lat: number, lng: number): MapPoint {
  const x = Math.round(Math.max(0, Math.min(WORLD_BOUNDS.width, lng)));
  const y = Math.round(Math.max(0, Math.min(WORLD_BOUNDS.height, WORLD_BOUNDS.height - lat)));
  return { x, y };
}

/**
 * Calculates Euclidean 2D distance between two map points.
 * Explicitly labeled as straight-line distance.
 */
export function calculateEuclideanDistance(p1: MapPoint, p2: MapPoint): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Formats a distance in units (approx. meters in world coordinates).
 */
export function formatDistance(units: number): string {
  if (units >= 1000) {
    return `${(units / 1000).toFixed(2)} km`;
  }
  return `${Math.round(units)} m`;
}
