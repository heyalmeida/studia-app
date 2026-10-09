# Studia

An offline-first study organizer for students: subjects, deadline-driven activities, scheduled
assessments, and a dashboard that answers three questions in seconds - what is due first, what is
left per subject, and how my progress is going. All data lives on the device; the app has no
backend, no accounts, and never requires a network connection.

> **Academic context.** Studia is the final project for the *Development of Systems for Mobile
> Devices* course of the technical program in Systems Development at the Universidade Estadual de
> Montes Claros (Cept), built by Pedro Miguel and Anna Cecília under the supervision of
> Prof. Isa Alexandre. The engineering practices behind it - specification-driven development,
> architecture decision records, and per-feature specifications - are part of the deliverable and
> documented under [`docs/`](./docs/README.md).

## Highlights

- **Offline-first by design.** AsyncStorage persistence with atomic writes per collection and
  defensive reads: corrupted JSON degrades to an empty list, and records created by older app
  versions are migrated on first read instead of crashing.
- **Local deadline reminders.** An opt-in switch on each activity or assessment schedules a local
  notification one day before the due date at 08:00. Completing, deleting, or rescheduling an item
  cancels or re-arms the notification. Local notifications run in Expo Go - no push service, no
  server, no permissions beyond the system prompt.
- **Search that forgives accents.** Case- and accent-insensitive search ("calculo" finds
  "Cálculo I") plus per-subject filter chips on every list, applied after the domain sort so
  ordering never breaks.
- **Reactive aggregates without a state library.** A small pub/sub layer notifies the dashboard and
  subject cards when any collection changes, so marking an activity done in one tab updates the
  progress ring in another without a reload.
- **Strict engineering gates.** TypeScript `strict` with zero `any` and zero suppressions, ESLint
  clean, and a StyleSheet-based design system whose tokens live in a single source of truth.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 57, React Native 0.86, React 19 |
| Language | TypeScript 6 (`strict`) |
| Navigation | Expo Router (tab group + modal routes) |
| Persistence | AsyncStorage behind repository interfaces |
| Styling | `StyleSheet` + centralized design tokens (dark theme, single accent color) |
| Icons | lucide-react-native |
| Charts | react-native-svg (progress ring) |
| Notifications | expo-notifications (local, scheduled) |
| Quality | ESLint (eslint-config-expo), `tsc --noEmit`, `expo-doctor` |

## Architecture

The codebase is organized in strict layers; each one depends only on the one below it through an
interface:

```
UI (screens / components)
  -> hooks (use-subjects, use-activities, use-assessments, use-dashboard)
    -> repositories (Repository<T> interface)
      -> storage adapter (AsyncStorage, the only module that knows the persistence format)

domain/   pure functions - models, validation, sorting, dates, progress, search
services/ system integrations - expo-notifications is imported nowhere else
```

Key properties:

- **The domain layer is pure.** Validation, ordering, date math, progress, and search normalization
  are plain functions with no React, no storage, and no I/O - readable and testable in isolation.
- **Screens never touch storage.** Data flows through hooks; hooks flow through repositories; the
  storage format is encapsulated in a single adapter module.
- **Consistency is enforced by domain rules, not a database.** Deleting a subject with linked
  records is blocked in the domain, and creating an activity without a subject is impossible
  through the UI.
- **Every significant decision is an ADR.** Ten architecture decision records (navigation strategy,
  persistence, state management, visual identity, styling system, folder structure) document the
  context, alternatives, and consequences of each choice. See
  [`docs/adr/`](./docs/adr/README.md).

## Screens

Seven navigable screens: four tabs (Dashboard, Subjects, Activities, Assessments) and three modal
forms (subject, activity, assessment). A floating tab bar carries the create action in its center;
its destination follows the active tab. Lists support search, subject filters, and status filters;
the dashboard aggregates all three collections.

## Getting started

**Prerequisites:** Node.js 20+ and the [Expo Go](https://expo.dev/go) app on an Android or iOS
device. The app targets Expo Go - no native build is required for development or demonstration.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `w` to open the web preview.

### Scripts and quality gates

| Command | Purpose |
|---|---|
| `npm start` | start the Expo dev server |
| `npm run android` / `npm run ios` / `npm run web` | open on a specific platform |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | type check |
| `npx expo-doctor` | diagnose dependency and config issues |

Development conventions (for humans and AI agents) are codified in
[`.clinerules`](./.clinerules) and [`AGENTS.md`](./AGENTS.md).

## Project structure

```
src/
  app/          Expo Router routes - layouts and one-line re-exports only
  screens/      one folder per screen (<Screen>Page/index.tsx)
  components/   ui/ = shared kit (~26 components); <Screen>Page/ = screen-specific parts
  hooks/        data hooks composing repositories and reacting to changes
  domain/       pure business logic: models, validation, sorting, dates, progress, search
  storage/      repository implementations over AsyncStorage + pub/sub notifier
  services/     system integrations (local reminders via expo-notifications)
  constants/    design tokens - single source of truth for the visual system
  styles/       CSS token mirror kept in sync with constants (not in the runtime path)
assets/         app icons and images
docs/           requirements, architecture, ADRs, per-feature and per-slice specifications
```

## Data model

Three entities with documented keys, cardinality, and state machines:

```
Subject 1 -> N Activity      Subject 1 -> N Assessment
```

`Subject` carries optional weekly hours, an icon, and a color from a closed eight-tone palette.
`Activity` has a type, an optional due date, and a pending/done status. `Assessment` has a mandatory
date and a scheduled/done status. Both can opt into a local reminder. Progress is always derived
(completed activities / total), never stored, so it cannot drift from its source. The full model,
including storage keys and migration rules, is in
[`docs/architecture/domain-model.md`](./docs/architecture/domain-model.md).

## Documentation

The repository follows specification-driven development: requirements, design, and decisions are
written before code and kept in sync with it.

| Area | Path |
|---|---|
| Product brief | [`docs/product-brief.md`](./docs/product-brief.md) |
| Functional requirements (9) | [`docs/requirements/functional-requirements.md`](./docs/requirements/functional-requirements.md) |
| Non-functional requirements (6) | [`docs/requirements/non-functional-requirements.md`](./docs/requirements/non-functional-requirements.md) |
| Architecture & domain model | [`docs/architecture/`](./docs/architecture/) |
| Architecture decision records | [`docs/adr/`](./docs/adr/README.md) |
| Visual identity & tokens | [`docs/design/visual-identity.md`](./docs/design/visual-identity.md) |
| Per-feature specs | [`docs/features/`](./docs/features/README.md) |
| Per-slice execution specs | [`docs/specs/`](./docs/specs/README.md) |
| Changelog | [`CHANGELOG.md`](./CHANGELOG.md) |

## Authors

- Pedro Miguel
- Anna Cecília

Universidade Estadual de Montes Claros - Cept · Technical program in Systems Development ·
Advisor: Prof. Isa Alexandre
