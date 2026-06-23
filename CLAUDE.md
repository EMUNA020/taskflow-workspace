# TaskFlow Workspace

Angular 19 Kanban board with smart filtering (free-text search + priority/tag filters) and `localStorage`-only persistence. No backend, no router.

## Stack & constraints

- Angular 19, **standalone components only** — no `NgModule`s anywhere.
- **Signals** for all state. No NgRx, Akita, or other state management libraries.
- Angular Material + `@angular/cdk/drag-drop` for UI and the Kanban drag-and-drop.
- SCSS for styling.
- No `@angular/router` usage — this is a single-view app. (The package is present as a default `ng new` dependency but must stay unused; do not add routes.)
- `localStorage` is the only persistence mechanism. Do not add a backend, API calls, or IndexedDB.

## Required idioms

- Use the signal-based APIs: `input()`, `input.required()`, `output()`, `model()` — never `@Input()`/`@Output()` decorators.
- Use the new control flow syntax: `@if`, `@for` (with `track`), `@switch`, `@empty` — never `*ngIf`/`*ngFor`/`*ngSwitch`.
- Use `inject()` for dependency injection in services and components, as a class field, e.g. `private readonly taskService = inject(TaskService);`. Do not use constructor-parameter DI (`constructor(private x: X)`) — field initializers that reference a constructor-injected parameter property run before the assignment happens and silently see `undefined`. `inject()` does not have this problem.
- Use `computed()` for any derived state. Use `effect()` only for side effects (e.g. syncing a signal to `localStorage`), never to derive a value that should instead be a `computed()`.
- Components stay presentational where possible: `TaskCardComponent` has no injected services, just `input()`/`output()`.

## Project structure

```
src/app/
  core/
    models/task.model.ts          # Task, Priority, Status, STATUSES, PRIORITIES
    services/
      local-storage.service.ts    # generic typed get/set wrapper
      task.service.ts             # signal<Task[]> store, CRUD, moveTask, persistence effect
      filter.service.ts           # search/priority/tag signals + apply(tasks) filtering
  features/
    board/
      board.component.ts          # page shell, toolbar, filter bar, cdkDropListGroup
      column/column.component.ts  # one column, cdkDropList, computed filtered tasks
      task-card/task-card.component.ts   # presentational card
      task-form/task-form-dialog.component.ts  # MatDialog add/edit form
      filter-bar/filter-bar.component.ts  # search + priority/tag controls
  app.component.ts
  app.config.ts
```

- `core/` holds app-wide models and services with no UI.
- `features/board/` holds everything board-specific. New board sub-components go here.
- Keep this structure — don't introduce a flat `components/` or `services/` folder at the app root.

## State pattern

- `TaskService.tasks` (a `signal<Task[]>`) is the single source of truth for all tasks. Components never mutate it directly — always go through `TaskService` methods (`addTask`, `updateTask`, `deleteTask`, `moveTask`).
- `FilterService` holds filter state (`searchText`, `selectedPriorities`, `selectedTags`) separately from `TaskService`. It does not own tasks; it exposes `apply(tasks)` which components combine with `TaskService.tasks()` inside a `computed()`.
- `TaskService` persists to `localStorage` via an `effect()` registered in its constructor — that is the only place writes to storage should happen.

## Testing expectations

- `LocalStorageService`, `TaskService`, and `FilterService` must have unit test coverage (CRUD, filtering combinations, persistence round-trip). When changing these, update or add specs in the matching `.spec.ts`.
- Tests that rely on an `effect()` having run (e.g. checking what was written to `localStorage`) must call `TestBed.flushEffects()` before asserting — effects scheduled outside a component don't flush synchronously.
- Components can have lighter smoke/interaction tests; not every template binding needs a dedicated spec.

## Things to avoid

- Don't add a backend, API layer, or any network call.
- Don't add `@angular/router` routes unless explicitly requested.
- Don't introduce NgRx, Akita, RxJS-based state stores, or any state library beyond Signals.
- Don't use `any`. Keep strict typing on `Task`/`Priority`/`Status`.
- Don't reach for constructor-parameter DI in a class that also has signal field initializers depending on the injected service — use `inject()`.

## Code Optimization & Minimalism Rules

- **Zero bloat**: write the bare minimum code necessary for the feature to work. No speculative "future" functions, no unused variables/imports/params, no scaffolding for requirements that don't exist yet.
- **Auto-cleanup**: after building or completing any feature/task, run a separate pass over the changed files to remove leftover code, duplicate logic, and `console.log`/debug statements before considering the task done.
- **Pure Angular 19**: keep code short and clean using only Signals and the new control-flow syntax (`@if`, `@for`, `@switch`). Don't reach for RxJS unless something genuinely requires it (e.g. a Material API that only exposes an `Observable`, like `MatDialogRef.afterClosed()`) — don't add RxJS operators/state on top of Signals for logic that's simpler as a `computed()`.
- **Small & clear functions**: every function should do exactly one thing and stay short (a few lines). If a function grows long or does multiple things, split it into small, well-named subfunctions that make each step obvious from the name alone.

## Commands

- `ng serve` — start the dev server.
- `ng build` — production build sanity check.
- `ng test --watch=false --browsers=ChromeHeadless` — run unit tests once (headless, non-interactive).

## Custom Slash Commands
- `/code-review`: Scan the project files using the 'Angular Clean Code' skill, check for compliance, and provide a brief list of optimization suggestions in Hebrew.
