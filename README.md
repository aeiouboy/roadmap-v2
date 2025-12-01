# Product Roadmap v2

A modern, rebuilt version of the product roadmap app using **Vue 3**, **TypeScript**, **Tailwind CSS**, and **Bun**.

## 🚀 Tech Stack

- **Vite** - Lightning-fast build tool and dev server
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - Official Vue state management
- **Bun** - Fast all-in-one JavaScript runtime (replaces Node.js + npm)

## ✨ Features

- ✅ **Cross-Category Drag & Drop** - Move features across ANY category and sprint (no restrictions!)
- ✅ **Dynamic Category Creation** - Add custom categories with color picker and emoji icons
- ✅ **Dynamic Sprint Management** - Create and manage unlimited sprints
- ✅ **Feature Management** - Create, edit, delete, and move features seamlessly
- ✅ **Double-Click Editing** - Quick inline editing for categories, sprints, and features
- ✅ **Toast Notifications** - Real-time feedback for all operations
- ✅ **LocalStorage Persistence** - Auto-saves your roadmap (no backend needed)
- ✅ **Proper Grid Layout** - CSS Grid with sticky category labels and horizontal scrolling
- ✅ **Color-Coded Features** - Visual organization by category

## 📦 Installation

### 1. Install Bun (if not already installed)

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

```bash
bun install
```

## 🛠️ Development

Start the dev server with hot module replacement:

```bash
bun run dev
```

The app will be available at **http://localhost:5173**

## 🏗️ Build for Production

```bash
bun run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
bun run preview
```

## 📁 Project Structure

```
src/
├── components/           # Vue components
│   ├── RoadmapGrid.vue  # Main grid layout
│   ├── CategoryRow.vue  # Category row with sprint cells
│   ├── SprintCell.vue   # Draggable drop zone for features
│   ├── FeatureCard.vue  # Draggable feature card
│   ├── ControlPanel.vue # Top control buttons
│   ├── CategoryModal.vue # Create/edit category modal
│   ├── SprintModal.vue  # Create/edit sprint modal
│   ├── FeatureModal.vue # Create/edit feature modal
│   └── ToastContainer.vue # Toast notifications
├── stores/              # Pinia state stores
│   └── roadmap.ts      # Main roadmap state & actions
├── types/              # TypeScript definitions
│   └── index.ts        # All type definitions
├── App.vue             # Root component
├── main.ts             # App entry point
└── style.css           # Global Tailwind styles
```

## 🎯 Usage Guide

### Creating Categories

1. Click **"+ New Category"** button in the control panel
2. Enter category name, icon (emoji), and choose a color from the picker
3. Categories are saved automatically to localStorage
4. Custom categories can be deleted (with confirmation)

### Managing Sprints

1. Click **"+ New Sprint"** button
2. Enter sprint number and name
3. Sprints appear as columns in the roadmap grid

### Working with Features

- **Create**: Click **"+ New Feature"** in any sprint cell
- **Edit**: **Double-click** a feature card to edit title/description
- **Move**: **Drag and drop** features across any category/sprint
- **Delete**: Click the delete button on a feature card
- **Cross-Category Moves**: Features update their color when moved to a new category

### Saving & Loading

- All changes are **automatically saved** to localStorage
- Click **"Save"** to manually trigger a save
- Click **"Load"** to restore from localStorage (useful after making mistakes)

### Checkpoints

- Click **"New Checkpoint"** to create a snapshot of your roadmap
- Restore any checkpoint to revert to that state
- Perfect for experimenting without losing your work

## 🔧 Why Bun?

Bun is **3-10x faster** than npm/yarn/pnpm:
- **Package installs**: ~2s vs ~20s with npm
- **Script execution**: Nearly instant
- **Built-in bundler**: Can replace Vite if needed
- **All-in-one**: Runtime + package manager + bundler

## 🚀 Future Enhancements

- [ ] Add Tauri + SQLite for desktop app with proper database
- [ ] Export/import roadmap as JSON
- [ ] Collaborative editing (WebSockets)
- [ ] Full undo/redo stack
- [ ] Search and filter features
- [ ] Gantt chart view
- [ ] Sprint planning tools

## 📝 License

MIT
