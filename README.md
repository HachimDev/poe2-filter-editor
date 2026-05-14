# PoE2 Filter Editor

A visual editor for creating and managing item filters for **Path of Exile 2**. No manual filter file writing required — build, preview, and export your filter entirely through the UI.

---

## Features

### Rule Management
- **Create rules** — add Show or Hide rules with a single click
- **Edit rules** — toggle between Show/Hide, rename rules, and configure all conditions and actions visually
- **Delete rules** — remove any rule from the list
- **Duplicate rules** — copy an existing rule and place it directly below the original, preserving all its conditions and actions
- **Reorder rules** — move rules up or down to control filter priority
- **Prebuilt rules** — insert ready-made rule sets (e.g. tiered Gold pickup rules) directly into your filter from a built-in library

### Conditions
Configure what items a rule matches:
- **Base Type** and **Class** — match specific item names or categories, with multi-value support
- **Rarity** — filter by Normal, Magic, Rare, or Unique
- **Numeric conditions** — Area Level, Item Level, Stack Size, Quality, Sockets with operators (`>=`, `<=`, `>`, `<`, `=`)
- **Boolean conditions** — Identified, Corrupted, Mirrored
- **Has Explicit Mod** — match items by mod text with a minimum count

### Visual Actions
Control how matching items appear in-game:
- **Font size** — scale item label size from 18 to 45
- **Text color** — full RGBA color picker
- **Border color** — toggleable RGBA border
- **Background color** — toggleable RGBA background fill
- **Beam effect** — colored beam with optional Temporary flag
- **Minimap icon** — configurable size, color, and shape
- **Alert sound** — sound ID (1–16) and volume

### My Visuals (Visual Presets)
- Save named collections of visual actions as reusable presets
- Create, edit, and delete presets from a dedicated full-screen page with its own live preview
- Apply any saved preset to a rule in one click from the Actions tab, without having to recreate colors and effects from scratch
- Presets persist across sessions via local storage

### Live Preview
- See exactly how an item label will look in-game as you edit
- Reflects all visual actions in real time: colors, font size, border, background, and beam effect
- Minimap icon preview with accurate shape and color rendering
- Item name auto-filled from the first Base Type or Class condition in the rule — fully editable if you want to test a different name
- Condition summary displayed below the preview

### Import & Export
- **Import** any existing `.filter` file — the editor parses it and loads all rules for editing
- **Export** your finished filter as a `.filter` file ready to drop into your Path of Exile 2 directory
- **Filter Text tab** — inspect the raw filter syntax for any individual rule at any time

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for bundling
- **CSS Modules** for component-scoped styles
- **Fontin SmallCaps** — the same typeface used in Path of Exile's own UI
