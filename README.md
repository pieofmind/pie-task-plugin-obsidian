# Pie Tasks

Manage your tasks straight from Markdown files in Obsidian — as a **board**, **list**, **calendar**, or **dashboard** — with checkboxes that write back into the file. Keep several independent boards (work, personal, per‑project) and switch between them in one click.

> Task data lives in plain Markdown (`TASKS.md`, `task2.md`, …). Nothing is locked in a proprietary format — you own your files.

## Features

- **Multiple boards (profiles)** — point each board at its own Markdown file and switch instantly from the board switcher. Give each a name, colour, and icon or photo.
- **Four views of the same file** — Kanban board, list, month calendar, and a stats dashboard.
- **Two‑way with the file** — ticking a task, moving it between lanes, or editing details writes straight back to the Markdown. Edit the file by hand and the board updates.
- **Lanes** — create, rename, recolour, reorder, and collapse columns.
- **Task details drawer** — status, priority, dates, assignees, checklists, links, and project.
- **People / assignees** — optional people file for avatars and names on cards.
- **One‑click setup** — the "Quick setup" button creates any missing files (task file, people file, dashboards) without touching what you already have.
- **Desktop and mobile** — works on both; no Node/Electron APIs.

## Getting started

1. Install and enable the plugin.
2. Open **Settings → Pie Tasks → Quick setup** to scaffold the starter files, or point a board at an existing Markdown file.
3. Open the board from the ribbon icon or the command **Pie Tasks: open live board**.

## Task file format

Tasks are standard Markdown checkboxes. Lanes are headings; status, dates and metadata are read from each line. See [`TASKS.sample.md`](./TASKS.sample.md) for a working example and [`People.sample.md`](./People.sample.md) for the optional people file.

## Installation

**From Community Plugins (once approved):** Settings → Community plugins → Browse → search "Pie Tasks".

**Beta (before approval) via BRAT:** install the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin, then add this repository: `pieofmind/pie-task-plugin-obsidian`.

**Manual:** download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/pieofmind/pie-task-plugin-obsidian/releases) into `<vault>/.obsidian/plugins/pie-tasks/`, then enable the plugin.

## License

[MIT](./LICENSE) © Pie Of Mind
