## [Unreleased]

### Added

- Build workflow to test backend build is functional (#151)
- A dependency to make HTTP codes an enum (#76)
- API endpoints:
  - Create projects (#117)
  - Get projects by ID (#117)
  - Get projects by name (case insensitive) (#117)
  - Get all projects (#117)
  - Update project (#124)
  - Delete project by ID (#125)
  - Create section (#128)
  - Get section by id (#128)
  - Get all sections with a project by its id (#128)
  - Update the name of a section (#135)
  - Update the project of a section (#135)
  - Get all sections within the database (#128)
- Schema documentation added to the Wiki (#117)
- Scripts to easily modify the database for debugging (#115)
- Swagger API documentation (#91)
- Util scripts to configure for testing and running build (#94)
- Header comment check to pr checklist (#74)
- ESLint rules for the following:
  - Semi-colons (#118)
  - Double quotes (#118)
  - Sorted imports (#118)
  - Excessive line breaks (#118)
  - Unused variables (#118)
  - Const for unused variables (#118)
  - Tab indentation (#118)
  - Explicit typing for useState (#81)
  - TODO and FIXME comments (#82)
- Frontend functionality for creating projects (#127)
  - Errors are thrown if a project has the same name as a preexisting one, or if the limit of 100 projects is met (#127)
- Basic project display (#127)

### Changed

- Project plan more to include more detail in terms of sorting, filters, and the inclusion of a "today" view. (#116)
- `seed-db.ts` updated to create a project called **Other**. (#117)

### Fixed

- Project plan formatting (#75, #144, #156)

### Removed

- `package-lock.json` files from git history (#98)
- All files and tests related to **Task** (#117)

## [0.1.0] - 2025-08-17

### Added

- Frontend and backend scaffolding
- Basic README and Wiki project setup
