# Name TBD - Cross-Platform Task Management & Productivity App

A cross-platform productivity dashboard (web and mobile) that helps users organize tasks, visualize trends, and manage priorities with features like labels, filters, reminders, subtasks, and flexible recurrence rules.

---

## Project Purpose

TaskFlow empowers individuals to take control of their day-to-day tasks, long-term goals, and recurring routines. It enables seamless tracking across devices with flexible customization for how users plan, categorize, and prioritize their responsibilities. The system promotes intentional time use through features like visual urgency indicators, recurring logic, task caps, and filtering.

---

## Tech Stack

- **Frontend:** React (Web), React Native or Flutter (Mobile)
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Notifications:** Local system notifications
- **Testing:** Jest
- **Dev Tools:** Docker, ESLint, Prettier, Husky, GitHub Actions

---

## Branch Structure

| Branch      | Purpose                                   | Who Can Push?                       | PR Target?        |
| ----------- | ----------------------------------------- | ----------------------------------- | ----------------- |
| `main`      | Production — stable release branch        | Maintainer only                     | ❌                 |
| `develop`   | Active development — features merged here | Anyone via PR, merged by Maintainer | ✅                 |
| `feature/*` | Feature-specific branches                 | Contributors                        | PR to `develop` ✅ |
| `bug/*`     | Bug-specific branches                     | Contributors                        | PR to `develop` ✅ |

---

## Getting Started (For Developers)

### Requirements

- Node.js `v`TDB
- PostgreSQL `v`TDB
- Docker (optional containerized setup)
- npm

---
### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/BlckHawker/Productivity-App.git
cd taskflow

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Start development server
npm run dev
```

### How to Make a Pull Request (PR)

> Follow these steps to contribute features, fixes, or improvements.
#### Checklist:
1. Create a new branch from `main`:

```bash
git checkout main
git pull
git checkout -b feature/my-feature-name
```

2. Make your changes locally.
3. Add or update tests, if applicable.
4. Commit with a clear message:

```bash
git commit -m "Add feature: recurring task support with reminder offsets"
```

5. Push your branch to the remote repository:

```bash
git push origin feature/my-feature-name
```

6. Open a Pull Request targeting the `develop` branch.
   - Assign reviewers if needed.
   - Make sure all CI checks pass.
---
#### PR Templates

> Be sure to ctrl + f `<!-- Remove the / -->` to find escape characters to delete
##### Bug Fix

```md
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

/``` <!-- Remove the / -->

  

## Testing Steps

<!-- How reviewers can verify the fix -->

  

1. Pull this branch and run the server.

2. Create a new task and archive it.

3. Refresh the task list — confirm it is no longer shown.

4. Visit /dashboard/tasks?includeArchived=true — confirm it reappears.

5. Run backend tests:

```bash

npm run test -- taskController.test.js

/ ``` <!-- Remove the / -->

  

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
```

##### New Feature

```
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

```

---

## Contributor Roles
- **Kovu Jackson-Bentley** – Project Maintainer / Lead Developer  
- **Jabrecia Washington** – Frontend Leader
- **You?** – Contribute to the project by opening a PR!
---  
## License

[MIT](https://github.com/yourusername/taskflow/blob/main/LICENSE) – Open source and open to community contributions.