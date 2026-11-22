import { MapPoint } from "@/types";
import { calculateEuclideanDistance } from "../map/coordinates";

export interface RouteStop {
  id: string;
  name: string;
  coordinates: MapPoint;
  category: string;
}

export interface OptimizedRouteResult {
  orderedStops: RouteStop[];
  totalDistance: number;
  legDistances: number[];
}

/**
 * Solves a traveling-route ordering using Nearest Neighbor heuristic.
 */
export function optimizeRouteOrder(stops: RouteStop[]): OptimizedRouteResult {
  if (stops.length <= 1) {
    return {
      orderedStops: [...stops],
      totalDistance: 0,
      legDistances: [],
    };
  }

  const unvisited = [...stops];
  const ordered: RouteStop[] = [];
  const legDistances: number[] = [];
  let totalDistance = 0;

  // Start with the first user-selected stop as origin
  let current = unvisited.shift()!;
  ordered.push(current);

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateEuclideanDistance(current.coordinates, unvisited[i].coordinates);
      if (dist < shortestDist) {
        shortestDist = dist;
        nearestIndex = i;
      }
    }

    const nextStop = unvisited.splice(nearestIndex, 1)[0];
    legDistances.push(shortestDist);
    totalDistance += shortestDist;
    ordered.push(nextStop);
    current = nextStop;
  }

  return {
    orderedStops: ordered,
    totalDistance,
    legDistances,
  };
}
