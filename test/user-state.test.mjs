import test from "node:test";
import assert from "node:assert/strict";

function optimizeRouteOrder(stops) {
  if (stops.length <= 1) {
    return { orderedStops: [...stops], totalDistance: 0 };
  }
  const unvisited = [...stops];
  const ordered = [];
  let totalDistance = 0;
  let current = unvisited.shift();
  ordered.push(current);

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let shortestDist = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const dx = unvisited[i].coordinates.x - current.coordinates.x;
      const dy = unvisited[i].coordinates.y - current.coordinates.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < shortestDist) {
        shortestDist = dist;
        nearestIndex = i;
      }
    }
    const nextStop = unvisited.splice(nearestIndex, 1)[0];
    totalDistance += shortestDist;
    ordered.push(nextStop);
    current = nextStop;
  }
  return { orderedStops: ordered, totalDistance };
}

test("Route Optimizer (Nearest Neighbor)", () => {
  const stops = [
    { id: "1", name: "Stop 1", coordinates: { x: 0, y: 0 } },
    { id: "3", name: "Far Stop", coordinates: { x: 1000, y: 1000 } },
    { id: "2", name: "Near Stop", coordinates: { x: 100, y: 100 } },
  ];

  const result = optimizeRouteOrder(stops);
  assert.equal(result.orderedStops[0].id, "1");
  assert.equal(result.orderedStops[1].id, "2");
  assert.equal(result.orderedStops[2].id, "3");
  assert.ok(result.totalDistance > 0);
});

test("User State Import Validation", () => {
  const validJson = JSON.stringify({
    version: 1,
    favorites: ["loc-1"],
    foundItemIds: ["col-1"],
    completedMissionIds: [],
    personalMarkers: [{ id: "p-1", title: "Stash", coordinates: { x: 100, y: 200 } }],
  });

  const parsed = JSON.parse(validJson);
  assert.equal(Array.isArray(parsed.favorites), true);
  assert.equal(parsed.favorites[0], "loc-1");
  assert.equal(parsed.personalMarkers.length, 1);
});
