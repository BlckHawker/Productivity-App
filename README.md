# Name TBD - Cross-Platform Task Management & Productivity App

A cross-platform productivity dashboard (web and mobile) that helps users organize tasks, visualize trends, and manage priorities with features like labels, filters, reminders, subtasks, and flexible recurrence rules.

---

## Project Purpose


This application empowers individuals to take control of their day-to-day tasks, long-term goals, and recurring routines. It enables seamless tracking across devices with flexible customization for how users plan, categorize, and prioritize their responsibilities. The system promotes intentional time use through features like visual urgency indicators, recurring logic, task caps, and filtering.

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

- Node.js `v22.14.0`
- PostgreSQL `v17`
- npm `v10.9.2`
- Docker v`TBD` (optional containerized setup)

---

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

Unfortunately, GitHub does not support choosing PR templates via GUI. Please follow these instructions carefully to target the correct branch. Not following these steps in order will cause the template to not appear.

1. Copy, edit, and paste the url for the respective PR in your browser
2. Select `Create Pull Request`
3. Select `Create Pull Request` (This is not a typo)
4. Change the target to `develop`
5. Assign yourself

##### Bug Fix
```
https://github.com/BlckHawker/Productivity-App/compare/branch?template=bugfix.md&title=[Bugfix]+Add+title+here
&labels=bug
```
- Replace `branch` with the name of your branch

##### New Feature
```
https://github.com/BlckHawker/Productivity-App/compare/branch?template=feature.md&title=[Feature]+Add+title+here
&labels=enhancement
```
- Replace `branch` with the name of your branch
---
## Changelog
All notable changes to this project are documented in the CHANGELOG.md **insert link** file.



### Versioning
We follow [Semantic Versioning (SemVer)](https://semver.org) format:
`MAJOR.MINOR.PATCH`

- `MAJOR`: Breaking changes or major redesigns
- `MINOR`: Backwards-compatible features and enhancements
- `PATCH`: Bug fixes and minor improvements

Example: `1.2.3` means 1st major version, 2 feature updates, and 3 patches

### When to Add to the Changelog
Add an entry to CHANGELOG.md whenever
- You introduce a new feature
- You fix a bug
- You change existing behavior
- You remove or deprecate functionality
- You make changes that affect users or contributors (e.g., updated setup instructions API documentation)

Changes should be added to a `## [Unreleased]` section until the version is released.

### Format
Each version section should include the version number, release date, and categorized changes:
```md
## [1.3.0] - 2025-09-01

### Added
- Feature: Support for nested subtasks up to 20 levels
- UI: New mobile-friendly task filter panel

### Changed
- Updated recurrence engine to support custom interval units

### Fixed
- Fixed reminder bug where notifications were not sent after midnight

### Removed
- Deprecated label color presets

```

For more information on development, read through the wiki.

---
## Contributor Roles
- **Kovu Jackson-Bentley** – Project Maintainer / Lead Developer  
- **Jabrecia Washington** – Frontend Lead

- **You?** – Contribute to the project by opening a PR!
---  
## License

[MIT](https://github.com/yourusername/taskflow/blob/main/LICENSE) – Open source and open to community contributions.