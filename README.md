# Bento Explorer

A local-first Windows file manager with a compact bento-style UI, grid/list views, tabs, split-pane browsing, mouse gestures, drag-and-drop, tags, and tag-based virtual folders.

## Features

- **Navigation:** drives, common folders, breadcrumbs, back/forward history, favorites, recent items, and path entry.
- **Tabs:** open multiple folders independently. Create with Ctrl+T and close with Ctrl+W.
- **Split view:** toggle the second pane with the split-screen button or Ctrl+Backslash. Each pane navigates independently; drag files between panes to move them, or hold Ctrl while dropping to copy.
- **Mouse gestures:** right-button drag left/right for Back/Forward, up for Parent Folder, down to Refresh. Rocking gestures: hold right-click and click left for Back, or hold left-click and click right for Forward.
- **Drag-and-drop:** drag selected files/folders onto a folder or into either pane. Hold Ctrl while dropping to copy.
- **Tags and virtual folders:** create tags from the sidebar +; assign tags using a file/folder context menu. Clicking a tag opens a virtual folder containing all tagged items, even across different directories.
- **File actions:** create folders, rename, copy, cut, paste, move to Recycle Bin, reveal in Explorer, and view properties.
- **UI:** dark and light themes, responsive layout, grid/list views, sorting, in-folder search, and persistent favorites/tabs.
- **Local metadata:** tags are stored in Electron's app data, not by renaming files or creating sidecar files in the user's folders. Tag assignments follow files when renamed or moved within the app.

## Run from source

Requires Node.js 20+.

    npm install
    npm run dev

## Build

    npm run check
    npm exec electron-builder -- --win dir

The unpacked app is written to release/win-unpacked/. The portable ZIP can be generated separately with PowerShell Compress-Archive.

## Keyboard shortcuts

- Alt + Left/Right — back/forward
- Alt + Up — parent folder
- Ctrl + L — focus path
- Ctrl + K — focus search
- Ctrl + A — select all visible items
- Ctrl + C / X / V — copy, cut, paste inside the app
- Ctrl + T — new tab
- Ctrl + W — close tab
- Ctrl + Backslash — toggle split view
- F2 — rename selected item
- Delete — move selected item to Recycle Bin
- F5 — refresh current folder

## Safety

File operations run locally through Electron's isolated main process. Delete uses the operating system's Recycle Bin via Electron's shell.trashItem, not permanent recursive deletion. Tag data is stored in the application's user-data folder.

## Design references

The design workflow used the open-source [UI/UX Pro Max skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill). The Bento-specific design tokens are in design-system/bento-explorer/MASTER.md.
