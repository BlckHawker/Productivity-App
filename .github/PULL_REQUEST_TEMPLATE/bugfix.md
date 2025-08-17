
name: Bug Fix
about: Submit a fix for a bug
title: "[Bugfix] "
labels: bug
assignees: []

## Summary
<!-- A brief explanation of what the bug was and how it was fixed -->
Fixed an issue where archived tasks were still showing up in the “Active Tasks” view. The bug was due to a missing `isArchived` check in the backend query logic.

## Steps to Reproduce
<!-- Describe the steps to reproduce the bug before the fix -->

1. Create a new task via the dashboard.
2. Archive the task using the “Archive” button.
3. Refresh the task list view.

**Before fix**: The archived task still appears in the “Active Tasks” view.  
**After fix**: Archived tasks are hidden from the default task list.


## Fix Description
<!-- Explain what you changed to fix the issue -->
- Added an `isArchived: false` condition to the MongoDB query in `taskController.getTasks()`.
- Refactored the filtering logic into a utility function `buildTaskQuery()` for reusability.
- Added a backend test case that verifies archived tasks are excluded from results.

**Example Code Snippet:**
```ts
const query = {
  ownerId: req.user.id,
  ...(req.query.includeArchived !== 'true' && { isArchived: false }),
};
```

## Testing Steps
<!-- How reviewers can verify the fix -->

1. Pull this branch and run the server.
2. Create a new task and archive it.
3. Refresh the task list — confirm it is no longer shown.
4. Visit /dashboard/tasks?includeArchived=true — confirm it reappears.
5. Run backend tests:
```bash
npm run test -- taskController.test.js
```

## Related Issues / PRs
- Fixes #...
- Related to #...

**Example:**

- Fixes #143 – Archived tasks showing in task list
- Related to #139 – Add filters to dashboard views

## Checklist

- [ ] Bug is reproducible and verified
- [ ] Fix addresses the root cause, not just symptoms
- [ ] No new errors or regressions introduced
- [ ] Tests added or updated as needed
- [ ] Linting and formatting pass
- [ ] Documentation updated (if needed)
- [ ] Changelog updated