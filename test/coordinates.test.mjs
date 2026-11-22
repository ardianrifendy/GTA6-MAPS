import test from "node:test";
import assert from "node:assert/strict";

const WORLD_BOUNDS = {
  width: 4096,
  height: 4096,
};

function mapPointToLeaflet(point) {
  const clampedX = Math.max(0, Math.min(WORLD_BOUNDS.width, point.x));
  const clampedY = Math.max(0, Math.min(WORLD_BOUNDS.height, point.y));
  return [WORLD_BOUNDS.height - clampedY, clampedX];
}

function leafletToMapPoint(lat, lng) {
  const x = Math.round(Math.max(0, Math.min(WORLD_BOUNDS.width, lng)));
  const y = Math.round(Math.max(0, Math.min(WORLD_BOUNDS.height, WORLD_BOUNDS.height - lat)));
  return { x, y };
}

function calculateEuclideanDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function formatDistance(units) {
  if (units >= 1000) {
    return `${(units / 1000).toFixed(2)} km`;
  }
  return `${Math.round(units)} m`;
}

test("Coordinate Transform Round-trip", () => {
  const points = [
    { x: 0, y: 0 },
    { x: 2048, y: 2048 },
    { x: 3480, y: 2240 },
    { x: 4096, y: 4096 },
  ];

  for (const pt of points) {
    const [lat, lng] = mapPointToLeaflet(pt);
    const convertedBack = leafletToMapPoint(lat, lng);
    assert.deepEqual(convertedBack, pt, `Point ${JSON.stringify(pt)} should round-trip perfectly`);
  }
});

test("Euclidean Distance & Formatting", () => {
  const p1 = { x: 1000, y: 1000 };
  const p2 = { x: 1300, y: 1400 }; // 300, 400 -> hypotenuse 500
  const dist = calculateEuclideanDistance(p1, p2);
  assert.equal(dist, 500);
  assert.equal(formatDistance(dist), "500 m");

  const p3 = { x: 0, y: 0 };
  const p4 = { x: 3000, y: 4000 }; // hypotenuse 5000 -> 5 km
  const dist2 = calculateEuclideanDistance(p3, p4);
  assert.equal(dist2, 5000);
  assert.equal(formatDistance(dist2), "5.00 km");
});
