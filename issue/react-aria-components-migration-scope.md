# React Aria Components Migration Scope

## Goal

Migrate custom interactive UI primitives to `react-aria-components` where the library already provides accessible behavior, keyboard handling, focus management, overlay positioning, and ARIA state.

Keep existing visual design and public component APIs stable unless a small API change materially reduces complexity.

## In Scope

### 1. Foundation wrappers

- Replace current custom `apps/frontend/components/atoms/aria/dialog.tsx` with wrappers around `ModalOverlay`, `Modal`, `Dialog`, `DialogTrigger`, `Heading`, and `Button`.
- Replace current custom `apps/frontend/components/atoms/aria/menu.tsx` with wrappers around `MenuTrigger`, `Popover`, `Menu`, `MenuItem`, and related RAC primitives.
- Create shared styling helpers for RAC state attributes such as `data-hovered`, `data-focused`, `data-focus-visible`, `data-pressed`, `data-selected`, `data-disabled`, and `data-entering`/`data-exiting`.

### 2. High-priority manual interactions

Replace manual open/close, outside-click, portal, focus, keyboard, and positioning logic in:

- `apps/frontend/components/molecules/dropdown/index.tsx`
- `apps/frontend/components/molecules/avatar-dropdown/index.tsx`
- `apps/frontend/components/organisms/admin-orders-view/index.tsx` status dropdown
- `apps/frontend/components/molecules/categories-dropdown/index.tsx`
- `apps/frontend/components/molecules/form/form-select.tsx`
- `apps/frontend/components/molecules/form/form-phone-input.tsx` country code menu

Preferred RAC primitives: `MenuTrigger`, `Popover`, `Menu`, `MenuItem`, `Select`, `ListBox`, `ListBoxItem`, `Button`.

### 3. Dialog and modal flows

Migrate modal behavior to RAC modal/dialog primitives while keeping existing animations where practical:

- `apps/frontend/components/molecules/modal/index.tsx`
- `apps/frontend/components/molecules/order-part/confirm-cancel-modal.tsx`
- `apps/frontend/components/molecules/add-address-modal/index.tsx`
- `apps/frontend/components/molecules/profile-form/map-picker-modal.tsx`
- `apps/frontend/components/molecules/img-cropper/index.tsx`
- `apps/frontend/components/molecules/forgot-password-form/success-modal.tsx`
- `apps/frontend/components/molecules/require-profile-info/index.tsx`

Acceptance: Escape closes, focus is trapped, focus restores to trigger, outside press behavior matches current UX, screen reader title/description is present.

### 4. Form controls

Move reusable form primitives toward RAC components:

- `Button` -> RAC `Button` wrapper while preserving variants.
- `Input` and `SearchInput` -> `TextField`, `Input`, `Label`, `FieldError`, `Text`.
- `DateInput` -> `DatePicker` / `DateInput` / `Calendar` if the current custom calendar behavior can be preserved.
- `cart-part/checkbox.tsx` -> `Checkbox`.
- `quantity-selector.tsx` -> evaluate `NumberField`; migrate only if UX remains equal or simpler.
- File upload controls in contact/return flows -> evaluate `FileTrigger`.

### 5. Navigation controls

Migrate where RAC maps cleanly:

- `review-filter-tabs.tsx` and `order-tabs.tsx` -> `Tabs`, `TabList`, `Tab`, `TabPanel` or `RadioGroup` if there is no panel content.
- `accordion/index.tsx` -> RAC disclosure/accordion pattern if available in the installed version; otherwise keep custom but align keyboard behavior.
- `pagination/index.tsx` -> keep custom structure, but use RAC `Button` wrappers for consistent disabled/focus states.

## Out of Scope

- Redesigning visual style.
- Replacing layout-only components.
- Migrating virtualized lists/grids unless interactive accessibility is broken.
- Removing `framer-motion`; keep it when it adds real transition value and does not fight RAC overlay state.
- Broad route/page refactors unrelated to component behavior.

## Migration Order

1. Create/replace RAC foundation wrappers for button, dialog, menu/popover, field primitives.
2. Migrate dropdown/menu/select components.
3. Migrate dialogs/modals.
4. Migrate form controls.
5. Migrate tabs/accordion/navigation controls.
6. Remove obsolete custom overlay/focus helpers only after all usages are migrated.

## Acceptance Criteria

- `npm run type-check` passes.
- Frontend lint passes for touched files.
- Keyboard flows are verified: Tab, Shift+Tab, Enter, Space, Arrow keys, Escape.
- Focus restore works after closing menus/dialogs.
- No manual document/window outside-click handlers remain in migrated components unless there is a justified edge case.
- Existing visual states are preserved or intentionally improved: hover, pressed, disabled, selected, invalid, loading.
- Mobile and desktop layouts remain unchanged for migrated flows.

## Initial Risk Areas

- `admin-orders-view` has embedded status dropdown logic and should be extracted before migration.
- `DateInput` may have product-specific date formatting and validation; migrate last unless the current implementation is causing bugs.
- Components mixing `framer-motion` with portals need careful state handoff to RAC overlay lifecycle.
