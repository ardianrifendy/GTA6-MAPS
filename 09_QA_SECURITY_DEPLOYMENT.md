# 09 — QA, SECURITY, GITHUB, AND VERCEL DEPLOYMENT

## 1. Testing strategy

Use appropriate tests:
- Unit tests for coordinate transforms, ranking, filters, and data validation.
- Component tests for search, filters, details, and progress controls.
- Integration tests for map selection and LocalStorage persistence.
- End-to-end smoke tests for primary user journeys.

## 2. Critical QA scenarios

### Map
- Pan and zoom.
- Marker selection.
- Category toggle.
- Search result navigation.
- Marker focus.
- URL state.
- Mobile touch controls.

### Vehicle Finder
- Tracker filter.
- Non-Tracker filter.
- Unknown filter.
- Selling availability independent of tracker status.
- Unknown values not treated as confirmed.
- Value and selling price displayed separately.

### Money Finder
- Sorting by payout.
- Money per minute only with valid inputs.
- Unknown payout excluded from numeric ranking.
- Add opportunity to route.

### Progress
- Mark found/completed.
- Refresh persistence.
- Export and import.
- Invalid import does not destroy existing data.

### Responsive
- Mobile.
- Tablet.
- Desktop.
- Wide desktop.

## 3. Accessibility

- Semantic HTML.
- Keyboard navigation.
- Visible focus.
- Accessible labels.
- Sufficient contrast.
- Do not rely on color alone.
- Dialog focus management.
- Touch target sizing.

## 4. Security

- No secrets in client code.
- Validate imported JSON.
- Sanitize user-entered text where rendered.
- Avoid unsafe HTML injection.
- Validate URL state.
- Do not trust external datasets.
- Keep personal data local unless the user explicitly enables a future sync service.

## 5. Performance

- Lazy load non-critical modules.
- Optimize images.
- Cluster markers.
- Avoid rendering unnecessary markers outside viewport.
- Avoid unnecessary dependencies.
- Monitor bundle size.
- Prevent expensive rerenders.

## 6. GitHub

- Use meaningful commits.
- Keep main branch stable.
- Use feature branches or isolated worktrees where supported.
- Do not commit secrets, build output, or private datasets.
- Add `.gitignore`.
- Document setup in README.
- Keep agent changes isolated and review before merge.

## 7. Vercel

- Confirm Next.js compatibility.
- Configure build command and output correctly.
- Add environment variables only when needed.
- Verify static assets and map tiles load.
- Test production URL on mobile and desktop.
- Check browser console and network failures.
- Provide deployment and rollback instructions.

## 8. Release gate

Do not call the application production-ready until:
- Production build passes.
- Critical tests pass.
- No blocker-level console/runtime errors remain.
- Main routes work.
- Map assets load.
- LocalStorage persistence works.
- Import/export is validated.
- Mobile layout is usable.
- Licensing and attribution are documented.
