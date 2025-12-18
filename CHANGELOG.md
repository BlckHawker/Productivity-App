## [Unreleased]

### Added

- API endpoints:
  - Create projects
  - Get projects by ID
  - Get projects by name (case insensitive)
  - Get all projects
  - Update project
  - Delete project by ID
  - Greate section
  - Get section by id
  - Get all sections with a project by its id
  - Update the name of a section
  - Update the project of a section
  - Get all sections within the database
- Schema documentation added to the Wiki
- Scripts to easily modify the database for debugging
- Swagger API documentation
- Add util scripts to configure for testing and running build
- Header comment check to pr checklist
- ESLint rules for the following:
  - Semi-colons
  - Double quotes
  - Sorted imports
  - Excessive line breaks
  - Unused variables
  - Const for unused variables
  - Tab indentation
  - Explicit typing for useState
  - TODO and FIXME comments
- Frontend functionality for creating projects
  - Errors are thrown if a project has the same name as a preexisting one, or if the limit of 100 projects is met
- Basic project display

### Changed

- Project plan more to include more detail in terms of sorting, filters, and the inclusion of a "today" view.
- `seed-db.ts` updated to create a project called **Other**.

### Fixed

- Project plan formatting

### Removed

- `package-lock.json` files from git history
- All files and tests related to **Task**

## [0.1.0] - 2025-08-17

### Added

- Frontend and backend scaffolding
- Basic README and Wiki project setup
