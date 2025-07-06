# Dev Roadmap Task Tracker (July–December 2025)

## Setup & Planning (July)

### Week 1 (July 1–7)

- [ ] *(Vacation – no work planned)*

### Week 2 (July 8–14)

- [ ] *(Vacation – no work planned)*

### Week 3 (July 15–21)

- [x]  Decide on tech stack: language (e.g., TypeScript, Python), DB (e.g., SQLite, Firestore, Supabase)
- [ ]  Sketch out dev environment needs (local CLI-first tools)
- [ ]  Set up GitHub repo with the following:
  - [ ] Branches: 
    - [x] `main` (release)
    - [ ] `development`
    - [ ] `staging`
  - [ ] Files: 
    - [ ] README
    - [x] Roadmap (this doc)
    - [ ] Project Plan (MVP.md)
    - [ ] CHANGELOG
    - [x] License
  - [x] Google doc: dev diary
  - [ ] GitHub Actions for CI (unit tests triggered on PRs to `development`)
  - [ ] Linting rules configured
  - [x] PR templates: 
    - [x] bug report
    - [x]feature addition
  - [ ] GitHub Projects board to manage tasks and PR tracking
- [ ] Create initial roadmap milestones and update this tracker for all months

### Week 4 (July 22–31)

- [ ] Finalize all epics for MVP (Tasks, Plans, Reminders, Recurrence, Habits, Archiving)
- [ ] Write full user stories and acceptance criteria for each epic
- [ ] Design database schema
- [ ] Finalize point-based planning logic and percentage allocation formula
- [ ] Define task flow UX for CLI version
- [ ] Sketch transition strategy to GUI/web frontend (Sept–Oct)

## Core Architecture & Plan Logic (August – CLI MVP)

### Week 1 (Aug 1–7)

- [ ] Implement CLI app with ability to create tasks and subtasks
- [ ] Store tasks with metadata: name, description, priority, points, deadline, planned date, reminder, finished date
- [ ] Support nested subtasks (up to 20 levels)

### Week 2 (Aug 8–14)

- [ ] Add CLI commands to manage plans (daily, weekly, monthly, and yearly)
- [ ] Create logic to allocate tasks based on point caps and project percentages
- [ ] Save plans in file or DB structure with links to tasks

### Week 3 (Aug 15–21)

- [ ] Add ability to mark tasks and subtasks complete via CLI
- [ ] Begin recurrence logic (generate future tasks)
- [ ] Output task/streak analytics (text-based summaries)

### Week 4 (Aug 22–31)

- [ ] Complete recurring task generation engine
- [ ] Add task import/export capability
- [ ] Ensure CLI version is feature-complete as MVP backend

## Recurring Logic, Habits, Notifications (September)

### Week 1 (Sep 1–7)

- [ ] Add habit/streak tracking based on task type and recurrence
- [ ] Begin integrating notifications (local and setup for push)

### Week 2 (Sep 8–14)

- [ ] Extend CLI to output habit analytics and streak views
- [ ] Refactor recurrence engine to support flexible rules

### Week 3 (Sep 15–21)

- [ ] Start building UI frontend (React/Web or GUI alternative)
- [ ] Display plans, tasks, and reminders visually from CLI data

### Week 4 (Sep 22–30)

- [ ] Connect frontend to CLI logic/backend via local server or module
- [ ] Begin testing on Android via Expo or GUI framework

## Cross-Platform UI & Final MVP Polish (October)

### Week 1 (Oct 1–7)

- [ ] Complete frontend transition
- [ ] Implement archiving and retrospective creation

### Week 2 (Oct 8–14)

- [ ] Finalize UI polish for mobile/desktop usability
- [ ] Add visual dashboards for analytics (streaks, missed tasks, time by project)

### Week 3 (Oct 15–21)

- [ ] Conduct 2-week usage test with real planning + reflection
- [ ] Fix bugs, gather feedback

### Week 4 (Oct 22–31)

- [ ] Final polishing of all features
- [ ] Confirm release readiness of full MVP

## Stretch Features (November)

### Week 1 (Nov 1–7)

- [ ] Add Notion/Todoist import features
- [ ] Begin calendar and kanban views

### Week 2 (Nov 8–14)

- [ ] Add advanced journaling/retrospective templates
- [ ] Build cross-project summary dashboard

### Week 3 (Nov 15–21)

- [ ] Extend analytics views
- [ ] AI-generated reflection or task suggestions (if possible)

### Week 4 (Nov 22–30)

- [ ] Polish all stretch features
- [ ] Test advanced workflows and backups

## 2026 Planning & Wrap-Up (December)

### Week 1 (Dec 1–7)

- [ ] Use app to begin drafting 2026 yearly plan
- [ ] Create goal/project map

### Week 2 (Dec 8–14)

- [ ] Review past data: streaks, retrospectives, missed tasks
- [ ] Write 2025 yearly reflection

### Week 3 (Dec 15–21)

- [ ] Finalize 2026 structure and key projects
- [ ] Archive any unused or stretch content

### Week 4 (Dec 22–31)

- [ ] Document improvements for 2026 app version
- [ ] Create README + usage guide for long-term self-use
