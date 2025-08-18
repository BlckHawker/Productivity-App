# [Insert Project name here] - Project Plan

## 1. Project Overview / Introduction

This project aims to build a cross-platform dashboard (web and mobile) to help users track tasks, visualize productivity trends, and optionally define size-based or time-scale (daily, weekly, etc.) goals.

---

## 2. Objectives

- Help individuals organize, prioritize, and track tasks seamlessly across devices
- Support flexible task structures (subtasks, priorities, sizes, labels, filters, deadlines).
- Enable cross-platform synchronization so users can manage their tasks anytime, anywhere
- Encourage consistent productivity with recurring tasks and reminders
- Enable effective time/task management through projects, sections, recurring tasks, and reminders
### Scope & Limitations (v1)

- Single-user only: This release does not include authentication or user accounts. All data is stored at the database root. Future updates will add multi-user support (including per-user data isolation, sharing, and auth).

- Application Future tasks:
	- Retrospective views / reports
	- Productivity goals
	- Soft caps (e.g., "recommended 5 daily tasks") - Can be based on project goal allocations. Ex: if a user sets Life = 50%, Work = 30%, and Coding = 20%, the app will aim to suggest tasks in proportion to those targets. These percentages are adjusted by task size, so a Large Work task may count more toward the quota than a Tiny Life task. Users will also be able to add more commands for the suggestion to prioritize, such as closet deadline, and/or showing tasks with a specific label.
	- Streaks/Habits - Users have the ability to keep track of instances of recurring tasks being complete and hold streaks.

- Repository / Documentation Future Tasks:
	- Add contributors on read me as a table with a link to their respective socials. At least github. Possibly others
	- Document for installation instructions for both developers and users

---
## 3. Functional Requirements

### Projects

- Users can create, update, and delete projects
- Each project must have a name and a color.
- Project names must be unique per user.
- A user can have up to 100 projects
- Every project will include a section named `Other` which will act as the default container for uncategorized tasks. This section cannot be deleted
- If a project is deleted, all sections within that project are deleted as well.
	- A pop up will appear when the user requests to delete, informing the user, and asking if they wish to continue.
### Sections

- Sections are containers for tasks and exist within projects.
- A section must have a name and be assigned to a project.
- Each project can have up to 100 sections, including the default `Other` section.
	- If the limit is reached, new sections cannot be created in the project until space is freed. A pop up stating this information will occur if the user tries to add another section.
- Sections must have unique names within the same project.
- Every task must belong to one section
- If a section is deleted, all tasks within that section are deleted as well.
	- A pop up will appear when the user requests to delete, informing the user, and asking if they wish to continue.
### Tasks

One-time tasks are tasks that either (1) have no desired date or deadline, or (2) have a desired date and/or deadline that are not part of a recurrence rule.
#### One-time

- Users can create, update, and delete tasks.
- When a one-time task is completed, it will be deleted from storage.
	- Each task must have:
	- Title (required)
	- Description (optional).
	- Section (required; defaults to `Other`).
	- Project (inferred via the section).
	- Date created (auto-generated).
	- Desired date (optional): the preferred completion date.
	- If time is omitted, the system assumes 11:59 PM of the specified date.
	- A deadline (optional): the latest acceptable completion date.
	- If time is omitted, the system assumes 11:59 PM of the specified date.
	- Priority Level
		- None (default)
		- Low
		- Medium
		- High
	- Size level (user-selected, for effort/time estimation):
		- None (default)
		- Tiny
		- Small
		- Medium
		- Large
		- X-Large
	- List of labels (optional)
	- List of reminders, with a maximum of 3 per task.
		  - If the user tries to add a 4th reminder, they will be given the choice to remove one of the previous 3 reminders, or cancel adding the new one
		- Reminders can either be:
			  - Static - An absolute time (July 5th 4:00pm)
			  - Dynamic - Relative time determined either by an interval (every 2 days), or by the deadline (1 hr before deadline) or desired date (7 days before desired date).
		- If a deadline / desired date is deleted, all reminders targeting those dates, will be deleted as well. The user will be informed if they would like to proceed.
		- Users can define recurrence logic
			  - every x (minutes/hours/days/weeks/month/years)
			  - Every xth of the month
			  - every xth day of the month (ex: every third Saturday)
			  - Every weekday / weekend
			  - Custom day of week sets (ex: every Mon/Wed/Fri)
			  - Last day of the month / last weekday
		  - Reminders that target static date/time that has passed will automatically be deleted. If the task is recurring, the reminders will stay, and will be updated only when the targeted date/time is updated to a future date/time.
	- List of subtasks
		  - Max of 100 incomplete subtasks per level
		  - Max depth of 20 levels from root task
		  - Subtasks are treated as standalone tasks during filtering and sorting.
			-  They will appear in task lists independently of their parent.
			- Subtasks are not grouped under their parent in filtered or sorted views.
		  - Subtasks inherit the parent task’s project and section
		  - Tasks must not include itself, directly or indirectly, as subtasks to prevent circular relationships or infinite recursion. The system will detect and block attempts to create loops in the task-subtask hierarchy.
		- Example: This would cause infinite cloning or recursion when either is completed.
		   1. Task A has Subtask B
		   2. Subtask B also lists Task A as a subtask
  
#### Recurring

- A task can be marked as recurring.
- Recurrence logic follows the same patterns as reminders:
	- every x [minutes/hours/days/weeks/month/years]
	- Every xth of the month
	- every xth day of the month (ex: every third Saturday)
	- Every weekday / weekend
	- Custom day of week sets (ex: every Mon/Wed/Fri)
	- Last day of the month / last weekday
- When a recurring task is marked as complete:
	- A new instance of the task is automatically created with:
		- Identical properties (title, description, section, labels, priority, size, reminders, subtasks, etc.)
		- A new desired date and/or deadline, updated based on the recurrence rule.
		- A new date created
		- Updated reminders (if applicable)
- If a recurring task is not completed by its deadline or desired date, a new instance is not created automatically.
	- The user must manually trigger a "Reschedule Task" action to shift the task forward. Doing so will generate a new instance using the same recurrence rules, but the interval count will reset.
		  - Example: A task set to recur every 3 days starting on the 4th. If the user finishes the task on the 8th, the next date of recurrence will be the 1tth.
#### Task Tree Example

Refer to this structure for all rows:

```

Task A (parent)

  Task B (subtask)

```

| Parent Task Type | Subtask Type | Behavior When Parent Is Completed                                                                                                                                      | Example                                                                                                                                 |
|------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| One-time         | One-time     | Subtask is automatically marked complete (recursively).                                                                                                               | Completing **Task A (one-time)** auto-completes **Task B (one-time)**, and any one-time subtasks under B recursively.                  |
| One-time         | Recurring    | Subtask is automatically marked complete (recursively) and then deleted.                                                                                              | Completing **Task A (one-time)** deletes **Task B (recurring)**.                                                                       |
| Recurring        | One-time     | If the subtask is completed before the parent, both recur (subtask remains one-time; its new date matches parent's recurrence interval). If not, only parent recurs. | If **Task B (one-time)** is completed before **Task A (recurring)**, a new **Task B** is created for the next cycle.                   |
| Recurring        | Recurring    | Parent and subtask recur independently. Subtask will only recur if directly marked complete manually.                                                                 | If **Task B (recurring)** was marked complete before **Task A (recurring)**, its properties will update independently of **Task A**.   |

#### Visual Logic & UX Indicators

Tasks are visually tagged with urgency indicators based on deadline/desired dates to improve scanability and time sensitivity awareness. Symbols are for colorblind support and differentiate deadline/desired date warnings.

| Symbol | Text Color           | Meaning                          |
| ------ | -------------------- | -------------------------------- |
| !!!    | Red                  | Deadline overdue                 |
| !!     | Orange               | Desired date overdue             |
| !      | Yellow (accentuated) | Deadline due within 24 hours     |
| *      | Yellow               | Desired date due within 24 hours |

## Labels

- Users can create, delete, and assign labels to tasks.
- Labels must have a name and a color.
- A label must have a unique name.
- When a label is deleted, it is automatically removed from all tasks that used it.
- Users have a limit of creating 100 labels

## Filters/ Search / Sort / View

### Views

*inspired by GitHub Projects views*

A view is a saved configuration of:
- Filter rules
- Sort settings
- Manual task ordering

Users can:
- Save up to 20 views across all projects
- Give each view a custom name. View names must be unique
### Filter & Search

Users can filter or search for tasks by any of the following attributes:
- Task title
- Task description
- Task date created
- Task desired date
- Task deadline
- Task label(s)
- Task priority
- Task size
- Section name (either within selected project(s) or globally. Will differentiate sections with same name by postfixing project name)

Filters can be applied globally or within selected project(s).
	- If a user tries to delete a label used in any saved view, a warning will appear:

> 	The label {label name} is used in the following saved view(s):
		- View name #1
		- View name #2
> 	Deleting it will also remove the label from the view(s). Proceed?

  

### Sorting

- Users can sort task lists by any of the following:
	- Task title (alphabetical)
	- Date created (oldest)
	- Desired date (oldest)
	- Deadline (oldest)
	- Priority (None ➜ High)
	- Size (None ➜ XL)
	- Project name (alphabetical)
	- Section name (alphabetical)
        - If multiple sections across projects have the same name, their parent project will postfix the name for clarity in sorted views.
            - Example (sorted alphabetically by section):
                - In Progress – Personal
                - In Progress – Work
                - To Do – Work

#### Saved Sorts
- Each saved view can store a default sorting method and direction (ascending or descending), which is applied automatically when the view is loaded.
- Manual sort overrides are saved per view and are not global


##### Example Scenarios

**Example 1: Manual Reordering in View**
1. User creates a "Today" view with the following tasks in order from top to bottom by default:
	- Submit tax form
	- Water plants
	- Zip up clothes
2. User drags drag “Zip up clothes” to the top. The order is now:
	- Zip up clothes
	- Submit tax form
	- Water plants
3. This order is saved and restored whenever the “Today” view is loaded

**Example 2: Manual Reordering with Filtered Results**

1. User filters for:
	- High-priority tasks due in the next 7 days
2. Tasks are auto-sorted by deadline (oldest ➜ newest)
3. They manually move “Finish Grant Report” to the top for visibility
4. That manual override is saved within that view only
## Import / Export Files

### Import

- Allow import preview before applying. Show the user the first 5 rows of data before applying.
	- Ex: "Do you want to import the following tasks?" ➜ Display task name, deadline, priority, etc.
- Validate data. Invalid values will cause the row to be skipped with an error message. Do not apply defaults silently.
	- This will also check for infinite recursions of subtasks
	- Allow mapping fields when importing Todoist
	- Examples
		- Todoist's “Priority” → maps to this app’s “Priority Level”
		- Todoist’s “Due Date” → maps to Desired Date
		- Fields not available in source (e.g., Size) will be empty by default
- Importing will overwrite all current tasks, sections, projects, views, etc. Users will be warned before proceeding.
- Error logs for skipped or invalid entries.
- When at least one error is found, the user will be told the rows that had errors and asked if they would still like to import the valid data (if any).
- If there is no valid data, the user will not get the option import it. Only all the errors and a "OK" button will show.
	- Example of errors:
	      - “Row 3 skipped: Missing required field ‘Task Title’.”
	      - “Row 7: Invalid priority level ‘Extreme’ – entry skipped.”

### Export

- Export options:
	- Basic (Todoist-compatible (free version))
	- Full (App-native format: includes sizes, recurrence, reminder logic, etc.)

- Export format options:
	- `CSV`
	- `xlsx`
	- `JSON`
	- `ics` exports support either the desired date or deadline (whichever exists), but not both. If both exist, the deadline takes precedence.

### Error Handling
- Clear messages for malformed files
	- If a CSV file is missing headers or uses an incorrect format, display:
	  `Import failed: Missing required column "Task Title" in header.`
- Skip/notify on duplicates or invalid values
	- When duplicate task titles are found:
	  `Line 12: Task “Water Plants” already exists in this project. Skipped.`
- Save error logs for review
  
```csv
Row,Error

3,Missing 'Task Title'

5,Invalid priority 'Urgent'

9,Deadline format not recognized (used DD-MM-YYYY)
```

## Synchronization across devices

- Changes made on one device are reflected across all logged-in devices in near real-time (within 5 seconds).
- If the app is used offline:
	- Tasks, updates, and deletions are cached locally.
	- Upon reconnection, changes are synced automatically. The app re-validates task hierarchies during sync to prevent circular subtask references introduced from offline changes.
- When a sync conflict is detected (ex: a task was edited on both devices), users will see a resolution UI showing:
	- Last modified time (to the second)
	- Device name
	- Buttons:
	  - Use Server Version
	  - Keep device name #1 Version
	  - Keep device name #2  Version (etc.)
- Users can manually trigger a sync from the UI.
- A sync status indicator shows when the last sync occurred and/or if there are errors.

## 4. Non-Functional Requirements

### Performance
- **Responsiveness:** The UI must respond to user input within 100ms for local interactions (e.g., adding/editing tasks, opening views).
- **Task list rendering:** The app must render views with up to 1,000 tasks in under 1 second.
- **Sync latency:** Data changes should propagate across devices in ≤5 seconds when online.

### Availability

- **Uptime:** The app should maintain **99.5% uptime** for synchronization and cloud storage services (measured monthly).
- **Offline mode support:** The app should support full functionality while offline, with automatic re-sync when connectivity is restored.

### Scalability

- The backend must support:
	- 10,000 tasks per user
	- 100 labels
	- 30,000 reminders
	- 100 projects × 100 sections each, with no degradation in UX responsiveness.
### Portability

- The app must run on:
	- **Web:** Latest 2 versions of Chrome, Firefox, Safari, Opera, Opera GX, and Edge
	- **Mobile:** Android 13+
- Mobile and web clients must share a unified codebase where possible using a cross-platform

### Maintainability
- Codebase must follow clear modular architecture (e.g., task model, view model, storage layer).
- Core logic (e.g., recurrence, reminder rules, task-subtask behavior) must have ≥90% unit test coverage.
- Code must adhere to a documented linting and style guide.
- **All pull requests must pass automated checks via GitHub Actions, including:**
	-  Linting (e.g., ESLint, Prettier)
	-  Unit tests (e.g., Jest)
	-  Coverage threshold checks (e.g., ≥90%)
### Usability & Accessibility

- **Onboarding:** New users must be able to create a project and a task within 60 seconds of first opening the app.
- **Colorblind support:** All urgency indicators must use shape/symbols in addition to color.
- **Keyboard navigation:** All major web features must be fully accessible by keyboard.
- **Screen reader compatibility:** All interactive elements must have proper ARIA labels and semantic HTML roles.
### Internationalization

- All app strings must support localization (stored in external translation files).
- Use Unicode (UTF-8) for all stored data to allow multilingual input.


### Backup & Data Recovery

- Local data must be backed up automatically once per day.

- Users can manually export task data in `.json`, `.csv`, or `.xlsx` formats at any time.

- App must offer the option to restore from the latest backup after reinstall or device switch.

  

### Version Compatibility

- Old data formats must be auto-migrated to the current structure when the app is updated.

- Breaking changes must include backward-compatible migration steps where feasible.

  

## 5. Developer Workflow & Project Automation

  

To streamline development, ensure consistency, and enable easier contributions, the following GitHub integrations and workflows will be used.

  

### GitHub Actions (CI/CD)

- All pull requests must pass GitHub Actions before merging.

- Workflows will include:

    - `lint`: Ensures consistent formatting and coding standards

    - `test`: Runs all unit and integration tests

    - `coverage`: Fails builds if coverage falls below 90%

    - `build`: Verifies that the codebase compiles without error

  

### Pull Request Templates

- Standardized PR templates will guide contributors to:
    - Describe changes clearly
    - Link related issues
    - List testing steps
    - Include media
- Templates will auto-apply labels (ex: `feature`, `bug`) based on selected options.

  

### Issue Templates

- Users can create issues from predefined templates:
    - Bug Report
    - Feature Request
- Issue templates will also auto-apply appropriate labels for triage and categorization.

  

### GitHub Project Board Integration

- A GitHub Projects board (e.g., `Project v1`) will be used for feature and task tracking.

- When an issue is created:
    - It will be automatically added to the board
    - It will be placed in the **Backlog** column by default
- As issues are triaged or PRs are linked, automation will move cards across columns (e.g., In Progress, In Review, Done).
### Branch Protection & Contribution Flow

- The `main` branch will be protected:
    - Require passing CI/CD checks
    - No direct commits or force pushes
- An additional branch `develop` is where all prs will target.
    -  Requires at least one review
    - Once features are are tested, they will be merged into `main` by a maintainer
- Feature branches follow the format: `feature/feature-name`, `fix/bug-description`, etc.

  
  

### Local Developer Tools

- Pre-commit hooks (`husky`, `lint-staged`) will be created to fully verify:
    - Code is linted
    - Unit tests run without issue
    - code coverage criteria is met
- A `.env.example` file will be included for setting up local dev environments

  

## 6. Technology Stack

  

This section outlines the core technologies selected for the project, along with detailed explanations of their roles and benefits. Choices are made based on developer experience, performance, community support, and scalability.

### Language  

**TypeScript** is a statically typed superset of JavaScript, meaning it adds type annotations to help catch errors during development instead of at runtime.  

For example, if a function expects a string but receives a number, TypeScript will show an error before the code even runs.

This improves:

- **Tooling**: Better autocomplete, navigation, and refactoring in editors like VSCode.

- **Developer productivity**: Clear contracts between components prevent logic bugs.

- **Maintainability**: Explicit types make it easier to understand and modify code safely.

Its compatibility with Node.js and popular front-end frameworks makes it an ideal choice for a full-stack project.
### Database  

**PostgreSQL** is a powerful open-source relational database system known for reliability and robustness.

Key features include:

- **ACID compliance**: Ensures data integrity by making transactions Atomic, Consistent, Isolated, and Durable.

- **JSON support**: Allows storing structured data like a document database, useful for storing flexible metadata.

- **Full-text search**: Enables search features (e.g., finding tasks by keyword) without external tools.

PostgreSQL is scalable, supports complex SQL queries, and has a large ecosystem—making it a strong choice for structured, long-term data storage.

### ORM (Object-Relational Mapping)  

**Prisma** is a modern ORM for TypeScript and Node.js. It simplifies interaction with the database by generating type-safe queries from a central schema.

Benefits include:

- **Type safety**: Prisma’s generated client reflects your database schema, preventing invalid queries at compile time.

- **Migrations**: Easy database schema changes using versioned migration files.

- **Developer experience**: Clear documentation, autocomplete, and fast feedback cycles.

Prisma reduces boilerplate and bridges the gap between application logic and persistent data.

### Front-End  

The project aims to support both **web** and **mobile** interfaces. Decisions will be finalized in the prototyping stage, but candidate technologies include:

  

#### Web  

**React**: The industry standard for component-based UIs. Integrates well with TypeScript and has a large ecosystem of libraries (e.g., component kits, state managers).
#### Mobile  

**React Native**: Enables cross-platform mobile apps using shared TypeScript/JavaScript logic. Familiar to web developers.
### Linting & Formatting  

**ESLint** will be used for enforcing code quality and **Prettier** for automatic formatting. Together, they reduce manual review effort and improve team consistency.

**Rules and examples:**

- **Double quotes and semicolons (`Prettier`)**

    - Before: `const name = 'App'`
    - After:  `const name = "App";`

  

- **Unused variables and imports (`eslint-plugin-unused-imports`)**

    - Before: `import fs from 'fs';`
    - After: *(remove if unused)*

  

- **Sorted imports (`eslint-plugin-import`)**

    - Before:  

    ``` ts
      import z from './z';
       import a from './a';
    ```
    - After:  
    ``` ts
      import a from './a';
      import z from './z';
    ```

  

- **Prefer `const` over `let` when variables are not reassigned**

    - Before: `let count = 10;`
    - After: `const count = 10;`

- **Avoid `any` and use explicit types**

    - Before: `function log(data: any) {}`
    - After: `function log(data: string) {}`

- **Remove excessive line breaks**

    - Before:

    ``` ts
    const a = 5;



    const b = 10;
    ```


    - After:

    ```ts
    const a = 5;
    const b = 10;
    ```

  

- **Tab indentation**

    - Enforce consistent use of tabs instead of spaces.
    - Remove excessive indentation

  

- All files must have a comment stating the generual purpose of the file  

- All function must have a header comment that briefly explains its purpose, paramters, and return value if applicable **is this worded well and is it actually poosible to lint?**

These rules improve readability and reduce cognitive load when navigating the codebase.

  

### Unit Testing  

**Jest** is a fast, zero-config testing framework that supports mocking and snapshot testing.

  

Advantages:

- **TypeScript support**: Easy setup with `ts-jest` or Babel.

- **Isolated tests**: Run in parallel and restore clean state.

- **Rich API**: Built-in mocking, spying, timers, and assertions.

  

Jest will be used to test core logic (e.g., task recurrence calculations, filters, and reminder triggers).

### API Design  


**REST** is sufficient for this single-user application. If more complex queries or client-side control is needed later, **GraphQL** may be evaluated.

### CI/CD  

**GitHub Actions** will be used to automate development workflows.

Key benefits:

- **Automation**: Run linting and tests on every pull request.

- **Pre-merge quality checks**: Prevent low-quality or broken code from being merged.

- **Flexibility**: Can deploy, tag releases, or run custom scripts as the project evolves.

### Hosting  

**Local Laptop (initially)**  

The project will be hosted locally during development to avoid unnecessary costs.

Rationale:

- **Free**: No need to pay for servers or cloud hosting during early development.

- **Sufficient**: Single-user app doesn’t require uptime or external access yet.

- **Safe**: No external exposure limits attack surface.

Once the app is production-ready or multi-user features are introduced, hosting platforms like **Render**, **Railway**, or **Vercel** (for front-end) will be considered.


  ## 7. Epics
  
### Epic 1: Developer Workflows & Automations

| **Name**                       | **Description**                                                     | **User Story**                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **1.1 - PR Checks & Coverage** | GitHub Actions verify lint, test, build, and coverage before merge. | As a developer, I want to ensure code passes all checks before it’s merged so we don’t break the app.                           |
| **1.2 - PR/Issue Templates**   | Templates help standardize contributions and labeling.              | As a contributor, I want templates that guide how I report bugs and propose features so I can contribute more easily.           |
| **1.3 - GitHub Project Board** | Issues are auto-added and tracked through progress stages.          | As a team, we want a project board that auto-updates when PRs and Issues are made so we can see real-time development progress. |

#### 1.1 - PR Checks Acceptance Criteria

- [ ]  All PRs trigger
   - [ ]  linting
       - [ ]  Double quotes and semicolons 
       - [ ]  Unused variables and imports
       - [ ] Sorted imports
       - [ ] const over let when variables are not reassigned
       - [ ] Avoid `any`
       - [ ] Remove excessive line breaks
       - [ ] Tab indentation
         - [ ] tabs instead of spaces
         - [ ] 2 indent
         - [ ] Remove excessive indentation
       - [ ] All function must have a header comment that briefly explains its purpose, parameters, and return value if applicable
   - [x] testing
   - [x] build
   - [x] coverage checks
- [x]  Coverage threshold must be ≥90%.
- [x]  Unit tests must pass.
- [x]  Builds must pass before merge to main or develop.

#### 1.2 - PR/Issue Templates Acceptance Criteria

- [ ]  PR template includes: description, steps to test, media, related issues.
- [ ]  Issue templates exist for: Bug Report, Feature Request.
- [ ]  Templates auto-assign appropriate labels.

#### 1.3 - GitHub Project Board Acceptance Criteria

- [ ]  Issues are added to board and default to Backlog.
- [ ]  PRs and label changes move cards across columns.
- [ ]  Board updates automatically via GitHub automation.

---
### Epic 2: Project & Section CRUD

|**Name**|**Description**|**User Story**|
|---|---|---|
|**2.1 - Create Project**|Users can create up to 100 named, color-coded projects.|As a user, I want to create projects with unique names and assign colors so that I can visually categorize my workstreams.|
|**2.2 - Update Project**|Projects can be renamed or recolored.|As a user, I want to rename or recolor a project so I can adapt to changing needs or preferences.|
|**2.3 - Delete Project**|Deleting a project removes all nested sections and tasks.|As a user, I want to delete a project and be warned if its sections and tasks will be removed, so I don’t delete important work by accident.|
|**2.4 - Create Section**|Sections exist within projects and are required for task organization.|As a user, I want to organize my tasks into named sections under each project so I can better track grouped work.|
|**2.5 - Update Section**|Sections can be renamed or reassigned to a different project.|As a user, I want to rename or move sections so I can restructure how I organize my tasks.|
|**2.6 - Delete Section**|Deleting a section removes all tasks within it.|As a user, I want to delete a section and its contents after confirmation, so I can clean up my workspace safely.|

#### 2.1 - Create Project Acceptance Criteria

##### Backend

- [ ]  Users can create up to 100 projects.
- [ ]  Each project must have a unique name.
- [ ]  Each project must have a color.
- [ ]  A default "Other" section is created with every project.
#### Frontend
- [ ]  Users can create up to 100 projects.
    - [ ] Disable the button when the user hits 100 projects. When hovering over (and/or clicking on button), explain to the user the issue
- [ ]  Each project must have a unique name (with trimmed string)
    - [ ] If the user puts a project name that already exists, highlight the textbox red, and disabe the "Create Project" button
- [ ]  Each project must have a color.
    - [ ] Color picker
    - [ ] Hex text box included
- [ ]  A default "Other" section is created with every project.



#### 2.2 - Update Project

#### Backend
- [ ]  Users can rename a project.
- [ ]  Users can change the project’s color.
- [ ]  Names must remain unique across all projects.
- [ ]  Color picker updates must persist across sessions.

#### Frontend
- [ ]  Users can rename a project.
    - [ ] "Edit project" button
- [ ]  Users can change the project’s color.
    - [ ] "Edit project" button
- [ ]  Names must remain unique across all projects.
    - [ ] See 2.1 acceptance criteria for how this is done
- [ ]  Color picker updates must persist across sessions.

#### 2.3 - Delete Project Acceptance Criteria

##### Backend
- [ ]  Deleting a project deletes all of its sections and tasks.

##### Frontend
- [ ]  Users must see a warning before deleting a project.
- [ ]  Deleting a project deletes all of its sections and tasks.

#### 2.4 - Create Section Acceptance Criteria

##### Backend
- [ ]  Sections require a name and a parent project.
- [ ]  A project can have up to 100 sections including `Other`.
- [ ]  Section names must be unique within a project.

##### Frontend
- [ ]  Sections require a name and a parent project.
- [ ]  A project can have up to 100 sections including `Other`.
- [ ]  Section names must be unique within a project.

#### 2.5 - Update Section

##### Backend
- [ ]  Users can rename a section.
- [ ]  Users can move a section to a different project.
- [ ]  Section name must be unique within its (new) parent project.

##### Frontend
- [ ]  Users can rename a section.
- [ ]  Users can move a section to a different project.
- [ ]  Section name must be unique within its (new) parent project.

#### 2.6 - Delete Section Acceptance Criteria

##### Backend
- [ ]  Deleting a section deletes all of its tasks.
- [ ]  User cannot delete the `Other` section

##### Frontend
- [ ]  Users must see a warning before deleting a section.
- [ ]  Deleting a section deletes all of its tasks.
- [ ]  User cannot delete the `Other` section

---
### Epic 3: Task Creation & Structure

|**Name**|**Description**|**User Story**|
|---|---|---|
|**3.1 - Create Task**|Users can create one-time or recurring tasks with multiple fields.|As a user, I want to create tasks with details like deadline, size, and reminders so I can manage my to-dos effectively.|
|**3.2 - Update Task**|Tasks can be edited to reflect changes.|As a user, I want to update tasks after creation so they stay accurate and useful.|
|**3.3 - Add Subtasks**|Tasks can have up to 20 levels of nested subtasks with 100 incomplete per level|As a user, I want to break down large tasks into subtasks, so I can track progress on complex work.|
|**3.4 - Prevent Recursion**|System blocks infinite subtask loops.|As a developer, I want the system to detect and prevent circular task relationships so I don’t create recursive logic bugs.|
|**3.5 - Complete Task Logic**|Completion triggers the appropriate behavior based on type/recurrence.|As a user, I want task completion to behave correctly depending on whether the task is recurring or has subtasks, so I don’t lose progress.|

#### 3.1 - Create Task Acceptance Criteria

- [ ]  Tasks must have a title and section (defaults to `Other`).
- [ ]  Optional fields
	- [ ] description
	- [ ] desired date
	- [ ] deadline
	- [ ] priority (default `None`)
	- [ ] size (default `None`)
	- [ ] labels
	- [ ] reminders
- [ ]  Tasks must automatically record creation date.
#### 3.2 - Update Task Acceptance Criteria

- [ ]  User can edit any field of a task, including name, description, deadline, desired date, reminders, labels, recurrence, size, etc.
- [ ] Changes are autosaved and persisted locally and in the cloud.
- [ ] Editing a recurring task only affects:
    - [ ] The current instance if the recurrence rule says “generate new on complete.”
    - [ ] All future tasks if recurrence is updated in a recurring template.
- [ ] Editing a task with subtasks does not break subtask structure.
- [ ] If the user changes a date field, any relative reminder updates accordingly if it was originally set relative.
- [ ] The UI clearly differentiates between editing a task instance vs. editing a recurring rule/template.
- [ ] A task cannot be updated to create a circular subtask reference (e.g., making its parent its own subtask).

#### 3.3 - Add Subtasks Acceptance Criteria

- [ ]  Subtasks can be nested up to 20 levels deep.
- [ ]  A task can have up to 100 incomplete subtasks at any level.
- [ ]  Subtasks inherit their parent’s project and section.
- [ ]  Subtasks behave independently in filtered and sorted views.

#### 3.4 - Prevent Recursion Acceptance Criteria

- [ ]  System must detect and block circular subtask relationships.
- [ ]  Prevent direct or indirect self-reference of tasks.

#### 3.5 - Complete Task Logic Acceptance Criteria

- [ ]  Marking a task complete sets its `completed_at` timestamp.
- [ ]  A completed task no longer appears in active views unless filtered specifically.
- [ ]  Completing a task with incomplete subtasks shows a confirmation prompt.
- [ ] Parent task auto-completes only if all subtasks are completed (if auto-complete toggle is enabled).
- [ ] Recurring tasks:
    - [ ] Marking the task as complete immediately generates the next instance based on the recurrence rule.
    - [ ] New instance inherits all relevant fields (description, reminders, labels, subtasks, etc.).
    - [ ] Generated instance resets completion status and applies recurrence offsets (e.g., "+1 week").
- [ ] Undoing completion restores the previous task state and deletes the next instance (if auto-generated).
- [ ] Tasks in completed state remain editable unless explicitly archived or locked.

---
### Epic 4: Task Recurrence

| **Name**                            | **Description**                                                        | **User Story**                                                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **4.1 - Task Recurrence**           | Recurring tasks automatically regenerate new instances when completed. | As a user, I want tasks to repeat according to my schedule so I don’t have to manually recreate them every time.                         |
| **4.2 - Missed Recurrence Logic**   | Missed recurring tasks don’t auto-regenerate; user must reschedule.    | As a user, I want the app to handle overdue recurring tasks differently so I can consciously reschedule instead of losing track of them. |
| **4.3 - Visual Urgency Indicators** | UI symbols show urgency based on deadline/desired dates.               | As a user, I want visual urgency indicators so I can quickly scan which tasks are overdue or coming up soon.                             |

#### 4.1 - Task Recurrence Acceptance Criteria

- [ ]  Recurrence supports:
    - [ ]  every x units
        - [ ]  minutes
        - [ ]  hours
        - [ ]  days
        - [ ]  weeks
        - [ ]  months
        - [ ]  years
    - [ ]  weekdays
    - [ ]  weekends
    - [ ]  xth of month
    - [ ]  xth weekday
    - [ ]  last day
    - [ ]  last weekday
- [ ]  Completing a recurring task generates a new instance with updated:
    - [ ]  desired date
    - [ ]  deadline
    - [ ]  creation date
    - [ ]  reminders
- [ ]  If a recurring task is incomplete past its deadline or desired date, it does not generate a new instance.
- [ ]  A manual “Reschedule Task” action is available to regenerate the task.
- [ ]  Recurring subtasks and parent tasks follow the recurrence interaction rules:
    - [ ]  One-time subtasks under recurring parents are recreated only if completed.
    - [ ]  Recurring subtasks operate independently and recur only when completed.

#### 4.2 - Missed Recurrence Logic

- [ ]  If a recurring task is incomplete past its desired date or deadline, it does not generate a new instance.
- [ ]  A “Reschedule Task” button appears instead.
- [ ]  Rescheduling applies recurrence logic from the current date forward.
- [ ]  Past recurrence intervals are not stacked or doubled (no auto-catch-up).

#### 4.3 - Visual Urgency Indicators

- [ ]  Tasks display urgency tags:
    - [ ]  !!! = Red = deadline overdue
    - [ ]  !! = Orange = desired date overdue
    - [ ]  ! = Yellow (bold) = deadline within 24 hrs
    - [ ]  * = Yellow (normal) = desired date within 24 hrs
- [ ]  Indicator updates occur automatically based on time.
- [ ]  Users can visually distinguish symbols without relying on color (colorblind-safe).

---
### Epic 5: Reminders

| **Name**                                 | **Description**                                                                                    | **User Story**                                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **5.1 - Smart Reminders**                | Reminders can be absolute or relative to deadlines or desired dates and support custom recurrence. | As a user, I want flexible reminder options (e.g., “every Monday”, “2 days before deadline”) so I never forget important work.                 |
| **5.2 - Reminder Notification Delivery** |                                                                                                    | As a user, I want to receive timely reminder notifications via the app and/or push system, so that I don’t forget to complete important tasks. |

---
#### 5.1 - Smart Reminders Acceptance Criteria
- [ ]  Users can choose between:
    - [ ]  Static (absolute time, e.g., July 5th 4:00pm)
    - [ ]  Dynamic reminders (relative to deadline/desired date)
- [ ]  Users can define recurrence rules for reminders:
    - [ ]  every x:
=======
---
### Epic 2: Project & Section CRUD

|**Name**|**Description**|**User Story**|
|---|---|---|
|**2.1 - Create Project**|Users can create up to 100 named, color-coded projects.|As a user, I want to create projects with unique names and assign colors so that I can visually categorize my workstreams.|
|**2.2 - Update Project**|Projects can be renamed or recolored.|As a user, I want to rename or recolor a project so I can adapt to changing needs or preferences.|
|**2.3 - Delete Project**|Deleting a project removes all nested sections and tasks.|As a user, I want to delete a project and be warned if its sections and tasks will be removed, so I don’t delete important work by accident.|
|**2.4 - Create Section**|Sections exist within projects and are required for task organization.|As a user, I want to organize my tasks into named sections under each project so I can better track grouped work.|
|**2.5 - Update Section**|Sections can be renamed or reassigned to a different project.|As a user, I want to rename or move sections so I can restructure how I organize my tasks.|
|**2.6 - Delete Section**|Deleting a section removes all tasks within it.|As a user, I want to delete a section and its contents after confirmation, so I can clean up my workspace safely.|

#### 2.1 - Create Project Acceptance Criteria

- [ ]  Users can create up to 100 projects.
- [ ]  Each project must have a unique name.
- [ ]  Each project must have a color.
- [ ]  A default "Other" section is created with every project.

#### 2.2 - Update Project

- [ ]  Users can rename a project.
- [ ]  Users can change the project’s color.
- [ ]  Names must remain unique across all projects.
- [ ]  Color picker updates must persist across sessions.

#### 2.3 - Delete Project Acceptance Criteria

- [ ]  Users must see a warning before deleting a project.
- [ ]  Deleting a project deletes all of its sections and tasks.

#### 2.4 - Create Section Acceptance Criteria

- [ ]  Sections require a name and a parent project.
- [ ]  A project can have up to 100 sections including `Other`.
- [ ]  Section names must be unique within a project.
#### 2.5 - Update Section

- [ ]  Users can rename a section.
- [ ]  Users can move a section to a different project.
- [ ]  Section name must be unique within its (new) parent project.
#### 2.6 - Delete Section Acceptance Criteria
- [ ]  Users must see a warning before deleting a section.
- [ ]  Deleting a section deletes all of its tasks.
- [ ]  User cannot delete the `Other` section

---
### Epic 3: Task Creation & Structure

|**Name**|**Description**|**User Story**|
|---|---|---|
|**3.1 - Create Task**|Users can create one-time or recurring tasks with multiple fields.|As a user, I want to create tasks with details like deadline, size, and reminders so I can manage my to-dos effectively.|
|**3.2 - Update Task**|Tasks can be edited to reflect changes.|As a user, I want to update tasks after creation so they stay accurate and useful.|
|**3.3 - Add Subtasks**|Tasks can have up to 20 levels of nested subtasks with 100 incomplete per level|As a user, I want to break down large tasks into subtasks, so I can track progress on complex work.|
|**3.4 - Prevent Recursion**|System blocks infinite subtask loops.|As a developer, I want the system to detect and prevent circular task relationships so I don’t create recursive logic bugs.|
|**3.5 - Complete Task Logic**|Completion triggers the appropriate behavior based on type/recurrence.|As a user, I want task completion to behave correctly depending on whether the task is recurring or has subtasks, so I don’t lose progress.|

#### 3.1 - Create Task Acceptance Criteria

- [ ]  Tasks must have a title and section (defaults to `Other`).
- [ ]  Optional fields
	- [ ] description
	- [ ] desired date
	- [ ] deadline
	- [ ] priority (default `None`)
	- [ ] size (default `None`)
	- [ ] labels
	- [ ] reminders
- [ ]  Tasks must automatically record creation date.
#### 3.2 - Update Task Acceptance Criteria

- [ ]  User can edit any field of a task, including name, description, deadline, desired date, reminders, labels, recurrence, size, etc.
- [ ] Changes are autosaved and persisted locally and in the cloud.
- [ ] Editing a recurring task only affects:
    - [ ] The current instance if the recurrence rule says “generate new on complete.”
    - [ ] All future tasks if recurrence is updated in a recurring template.
- [ ] Editing a task with subtasks does not break subtask structure.
- [ ] If the user changes a date field, any relative reminder updates accordingly if it was originally set relative.
- [ ] The UI clearly differentiates between editing a task instance vs. editing a recurring rule/template.
- [ ] A task cannot be updated to create a circular subtask reference (e.g., making its parent its own subtask).

#### 3.3 - Add Subtasks Acceptance Criteria

- [ ]  Subtasks can be nested up to 20 levels deep.
- [ ]  A task can have up to 100 incomplete subtasks at any level.
- [ ]  Subtasks inherit their parent’s project and section.
- [ ]  Subtasks behave independently in filtered and sorted views.

#### 3.4 - Prevent Recursion Acceptance Criteria

- [ ]  System must detect and block circular subtask relationships.
- [ ]  Prevent direct or indirect self-reference of tasks.

#### 3.5 - Complete Task Logic Acceptance Criteria

- [ ]  Marking a task complete sets its `completed_at` timestamp.
- [ ]  A completed task no longer appears in active views unless filtered specifically.
- [ ]  Completing a task with incomplete subtasks shows a confirmation prompt.
- [ ] Parent task auto-completes only if all subtasks are completed (if auto-complete toggle is enabled).
- [ ] Recurring tasks:
    - [ ] Marking the task as complete immediately generates the next instance based on the recurrence rule.
    - [ ] New instance inherits all relevant fields (description, reminders, labels, subtasks, etc.).
    - [ ] Generated instance resets completion status and applies recurrence offsets (e.g., "+1 week").
- [ ] Undoing completion restores the previous task state and deletes the next instance (if auto-generated).
- [ ] Tasks in completed state remain editable unless explicitly archived or locked.

---
### Epic 4: Task Recurrence

| **Name**                            | **Description**                                                        | **User Story**                                                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **4.1 - Task Recurrence**           | Recurring tasks automatically regenerate new instances when completed. | As a user, I want tasks to repeat according to my schedule so I don’t have to manually recreate them every time.                         |
| **4.2 - Missed Recurrence Logic**   | Missed recurring tasks don’t auto-regenerate; user must reschedule.    | As a user, I want the app to handle overdue recurring tasks differently so I can consciously reschedule instead of losing track of them. |
| **4.3 - Visual Urgency Indicators** | UI symbols show urgency based on deadline/desired dates.               | As a user, I want visual urgency indicators so I can quickly scan which tasks are overdue or coming up soon.                             |

#### 4.1 - Task Recurrence Acceptance Criteria

- [ ]  Recurrence supports:
    - [ ]  every x units
        - [ ]  minutes
        - [ ]  hours
        - [ ]  days
        - [ ]  weeks
        - [ ]  months
        - [ ]  years
    - [ ]  xth day of the month
    - [ ]  custom weekday sets (e.g., Mon/Wed/Fri)
    - [ ]  last weekday of the month
    - [ ]  last day of the month
- [ ]  If a task’s deadline or desired date is deleted, reminders targeting it are also removed after warning.
- [ ]  Static reminders that target a past time are auto-deleted.
- [ ]  Recurring task reminders update correctly with new recurrence dates.
	- [ ] If the tasks has not been marked complete, recurring reminders will neither update nor delete themselves until task has been updated
- [ ]  Max 3 reminders per task.
    - [ ]  User prompted to remove one if attempting to add a fourth.

#### 5.2 - Reminder Notification Acceptance Criteria
- [ ]  When a reminder’s scheduled time is reached, the app triggers a notification (in-app and/or push).
---
### Epic 6: Labels, Filters, Views & Sorting

|**Name**|**Description**|**User Story**|
|---|---|---|
|**6.1 - Label Tasks**|Tasks can be labeled with color-coded tags.|As a user, I want to assign labels to tasks so I can group and search for them by theme or context.|
|**6.2 - Create Views**|Saved filters/sorts/orderings for customized task dashboards.|As a user, I want to save custom views so I can switch between workflows like “Today” or “High Priority”.|
|**6.3 - Sort Tasks**|Tasks can be sorted by any field and override manually per view.|As a user, I want to sort tasks by size, priority, desired date, or deadline, so I can focus on what matters most.|

#### 6.1 - Label Tasks Acceptance Criteria

- [ ]  Users can create up to 100 unique labels.
- [ ]  Labels have a name and color.
- [ ]  Deleting a label removes it from all tasks and saved views.
- [ ]  If a label is attempted to be deleted that is used in any saved view, a warning must show listing affected views and require confirmation.
	- [ ] `The label {label name} is used in the following saved view(s):
	- View name #1
	- View name #2
	 Deleting it will also remove the label from the view(s). Proceed?

#### 6.2 - Create Views Acceptance Criteria

- [ ]  Users can save up to 20 named views.
- [ ]  Each view stores:
    - [ ]  A unique name
    - [ ]  Filter conditions (e.g., label = “Work”, priority = “High”, a project = "Life")
    - [ ]  Sort field (e.g., deadline) and direction (ascending/descending)
    - [ ]  Manual drag-and-drop overrides
- [ ]  Manual order is persistent per view.
- [ ]  View loads with saved logic every time.
- [ ]  Views can be renamed or deleted.

#### 6.3 - Sort Tasks Acceptance Criteria

- [ ]  Users can sort by:
    - [ ]  title
    - [ ]  date created
    - [ ]  desired date
    - [ ]  deadline
    - [ ]  priority
    - [ ]  size
    - [ ]  project name
    - [ ]  section name
	    - [ ] If multiple sections across projects have the same name, their parent project will postfix the name for clarity in sorted views.
- [ ]  Manual sort order is saved per view and restored on load.
- [ ]  Sorting disambiguates sections with same name by appending project name.

---

### Epic 7: Task Export / Import

| **Name**               | **Description**                                                               | **User Story**                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **7.1 - Export Tasks** | Users can export to CSV/XLSX/JSON/ICS with full data and compatibility modes. | As a user, I want to export my tasks in multiple formats so I can back them up or use them in other tools.          |
| **7.2 - Task Import**  | Users can import from CSV/XLSX/JSON or Todoist with preview and validation.   | As a user, I want to import tasks from other apps or files so I don’t lose my previous work when switching systems. |

#### 7.1 - Export Tasks Acceptance Criteria
- [ ]  Export supports the following file formats:
    - [ ]  CSV
    - [ ]  XLSX
    - [ ]  JSON
    - [ ]  ICS
		- [ ] exports support either the desired date or deadline (whichever exists), but not both. If both exist, the deadline takes precedence.
- [ ]  If user chooses CSV, years can choose export type:
    - [ ]  Full (native app format: includes recurrence, reminders, sizes, etc.)
    - [ ]  Basic (Todoist-compatible format. Only applicable with free version of Todoist)
- [ ]  Exported fields match app’s data schema accurately.
#### 7.2 - Task Import Acceptance Criteria

- [ ] Users can import:
	- [ ] CSV
	- [ ] XLSX
	- [ ] JSON
- [ ]  Imports show preview of first 5 rows before confirming.
- [ ]  Users can confirm before applying imported data.
- [ ]  Invalid rows are skipped and error messages are shown
- [ ]  Import supports field mapping from Todoist format:
    - [ ]  Todoist “Priority” ➜ maps to app “Priority Level”
    - [ ]  Todoist “Due Date” ➜ maps to app “Desired Date”
- [ ]  Infinite recursion in subtasks is detected and blocked.
- [ ]  Users are warned if trying to import when all rows are invalid.
- [ ]  A downloadable error log is shown for skipped entries.
	- [ ]   ```csv
  Row,Error
3,Missing 'Task Title'
5,Invalid priority 'Urgent'
9,Deadline format not recognized (used DD-MM-YYYY)```
---
### Epic 8: Sync, Offline Mode, and Conflict Resolution

| **Name**                    | **Description**                                                 | **User Story**                                                                                                               |
| --------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **8.1 - Sync Changes**      | Changes sync across devices within 5 seconds.                   | As a user, I want my updates to sync in near real-time so I can switch devices and continue working without losing progress. |
| **8.2 - Offline Support**   | App caches updates and syncs later when reconnected.            | As a user, I want to work offline and have my changes sync when I reconnect.                                                 |
| **8.3 - Conflict Handling** | When edits happen on two devices, a resolution dialog is shown. | As a user, I want to review conflicts and choose which version to keep so I don’t lose important edits.                      |

#### 8.1 - Sync Changes Acceptance Criteria
- [ ]  Changes sync across all devices within 5 seconds.
- [ ]  Manual sync is available.
- [ ]  Sync status indicator shows last sync and any errors.
#### 8.2 - Offline Support Acceptance Criteria
- [ ]  App caches changes offline.
- [ ]  Cached updates replay upon reconnection.
- [ ]  Recursion validation re-runs on sync.
#### 8.3 - Conflict Handling Acceptance Criteria
- [ ]  Users see a diff UI with device names and timestamps.
- [ ]  Users can pick which version to keep.