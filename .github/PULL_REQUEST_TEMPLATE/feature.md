## Summary
<!-- A short, high-level summary of what this PR adds or improves -->

**Example:**
This PR introduces a new feature that allows users to filter and sort data entries on the dashboard based on status, date, or priority. It also includes frontend and backend support to ensure persistent filters across sessions.


## Epic
<!-- Link or name of the related Epic -->
**Example:**
- Epic #1: Dashboard Usability Enhancements

## User Story
<!-- Use the format below -->
*As a [type of user], I want to [do something] so that [goal/value].*

**Example:**

**Example:**
*As a product manager, I want to filter tasks by priority so I can quickly identify the most urgent items on the dashboard.*

## Acceptance Criteria
<!-- A checklist of testable outcomes to ensure the feature meets its goals -->

**Example:**
- [ ] Users can filter entries by status, priority, and date range
- [ ] The filtered results are reflected immediately in the UI
- [ ] Filters persist across browser refreshes (via localStorage)
- [ ] The backend supports `/api/entries?status=...&priority=...` queries
- [ ] Unit tests cover all filtering logic

## Implementation Notes
<!-- Optional: Describe how the feature was implemented, any challenges, or technical details worth noting -->
**Example:**

- Implemented a reusable FilterPanel component for all list-based views (Tasks, Projects, Events).
- Refactored the /api/entries controller to support query string filtering with validation.
  - Concern: The `applyFilters()` utility currently does not support filtering by nested fields (e.g., user.role). This limitation affects some edge cases on the Admin Dashboard.
- Added a temporary workaround by flattening nested objects before applying filters, but this may have performance implications on large datasets.
- Opened a separate issue (#132) to explore a more scalable solution using a query builder or database-level filtering.
- Unit tests written for all new logic, but integration tests for Admin-specific filters are still pending (planned for next PR).

## Testing Steps
<!-- Instructions for reviewing or testing this feature locally -->

**Example:**

1. Checkout this branch and run `npm install` if needed
2. Run the app with `npm run dev`
3. Navigate to `/dashboard`
4. Try applying different combinations of filters
5. Refresh the page to confirm settings persist

## Screenshots or Media (Optional)
<!-- Add screenshots, gifs, or links to demos if helpful -->

## Related Issues / PRs
<!-- List any related items -->
- Closes #...
- Related to #...

**Example:**
- Closes #87 – Add filtering to task dashboard
- Related to #83 – Backend support for filtering tasks

## Checklist
- [ ] Feature is scoped to a single purpose
- [ ] Code is tested (unit/integration as needed)
- [ ] Code is linted and follows project conventions
- [ ] All acceptance criteria are met
- [ ] Documentation updated if applicable
- [ ] Changelog updated
- [ ] Files changed/added have a header comment
- [ ] All changed/added function have header comments