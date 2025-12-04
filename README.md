## React Drag and Drop Layout Builder

This project is a custom layout builder created with React and TypeScript. It allows users to place components onto a canvas, move them around, and edit their content through simple and predictable interactions. The goal of the project is to demonstrate a clean, modular approach to building an editor-style interface without relying on external drag‑and‑drop libraries.

The editor is intentionally designed as a desktop‑first application. Since layout builders are typically used on larger screens, mobile responsiveness was not a primary focus. The project concentrates instead on the core mechanics of component placement, reordering logic, edit modals, and structured state management.

## Features

### Component placement
Users can drag items such as a header, footer, card, text block, or slider from the sidebar and drop them onto the canvas. The drop position is calculated based on the cursor offset to ensure the component appears exactly where it was released.

### Reordering
Existing elements on the canvas can be dragged vertically to change their order. A thin before/after indicator line shows the exact insertion point for clearer control.

### Content editing
Each element type has its own editing modal. Text, card content, and slider items can be updated. All changes are written directly into a shared builder state and reflected immediately in the canvas.

### Canvas structure
The canvas behaves similarly to a simplified web page. The header stays at the top, the footer stays anchored at the bottom of the scrollable area, and the content flows naturally between them. The canvas height expands as elements are added. Empty and single‑element states are also handled.

## Technologies Used

React 19  
TypeScript  
Vite  
TailwindCSS  
HTML5 Drag and Drop API  
React Context for global builder state

No external drag‑and‑drop library is used. All drag mechanics are implemented manually using native browser capabilities.

## How It Works

1. Dragging a component from the sidebar stores its type and drag metadata with the DataTransfer API.  
2. Dropping it onto the canvas triggers a position calculation and calls `addElement`.  
3. Dragging an existing element enters reorder mode, and the system determines the correct insertion index.  
4. Each component renders through a shared `CanvasComponent` layer and exposes edit/delete controls.  
5. Editing is handled through dedicated modals that update each element’s content.

## Purpose of the Project

The project was developed to practice and demonstrate building an editor‑like interface from scratch. It focuses on understanding and implementing:

- drag and drop interaction patterns  
- shared and structured state management  
- modular component architecture  
- canvas layout behaviors  
- predictable update flows in React

The project prioritizes clarity and control of logic rather than relying on third‑party tools.

## Notes on Mobile Support

Mobile responsiveness was intentionally deprioritized. Because the editor is meant to mimic a desktop web‑building workflow, the core interaction model is optimized for larger screens. The main focus has been correctness and architectural clarity rather than adapting the interface for small devices.