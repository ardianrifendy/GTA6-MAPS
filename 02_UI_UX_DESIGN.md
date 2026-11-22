# 02 — UI / UX DESIGN SYSTEM

## 1. Design direction

**Hybrid map dashboard + Dark Premium.**

The map remains the primary visual surface. Panels and controls must support exploration rather than obscure the map.

## 2. Visual principles

- Charcoal, graphite, and near-black backgrounds.
- Restrained accent colors, reserved for category/status meaning.
- Subtle glassmorphism only for floating controls and overlays.
- Clear typography hierarchy.
- Consistent spacing and alignment.
- Compact information density without sacrificing legibility.
- Avoid oversized cards, excessive gradients, and decorative clutter.

Do not imitate IGN branding or reproduce its proprietary visual assets.

## 3. Desktop layout

- Left sidebar: navigation, category tree, filters, counts.
- Main canvas: interactive map.
- Right panel: selected location or selected feature details.
- Top bar: global search, map controls, profile-free settings.
- Panels should be resizable/collapsible if practical.

Suggested desktop proportions are flexible; preserve map visibility as the primary constraint.

## 4. Mobile layout

- Map occupies the screen.
- Top search entry is compact.
- Floating buttons open filters and map controls.
- Bottom sheet displays selected location or route information.
- Bottom sheet supports collapsed, half, and expanded states if feasible.
- Touch targets must be comfortably usable.
- Avoid placing essential actions behind hover-only interactions.

## 5. Map controls

- Zoom in/out.
- Reset view.
- Fullscreen.
- Toggle layers.
- Search.
- Locate selected result.
- Legend.
- Optional map opacity/base-layer controls if relevant.

## 6. Status semantics

Use consistent labels and colors:
- Confirmed.
- Verified Community.
- Community Reported.
- Unverified.
- Unknown.
- Found.
- Not Found.
- Favorite.

Do not rely on color alone; include text or icons.

## 7. Data panels

Every detail panel should prioritize:
1. Name and category.
2. Verification status.
3. Map location.
4. Most decision-relevant facts.
5. Requirements and risks.
6. Source and last verified date.
7. User actions: favorite, found, note, route, share.

## 8. Interaction requirements

- Search result selection must pan/zoom to the map marker.
- Category toggles must actually change visible markers.
- Detail panel must update on marker selection.
- Found/favorite state must persist.
- Escape closes dismissible dialogs/panels where appropriate.
- Keyboard focus must remain visible.
- Provide loading, empty, and error states.

## 9. Responsive acceptance checks

Test at minimum:
- Narrow mobile viewport.
- Standard mobile viewport.
- Tablet viewport.
- Desktop viewport.
- Wide desktop viewport.

Ensure there is no horizontal overflow, inaccessible panel, or map control collision.
