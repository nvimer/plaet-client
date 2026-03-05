# Plaet POS - Project Context

This document provides the foundational context and high-level goals for the Plaet application.

## 🍽️ Project Overview
Plaet is a specialized Restaurant Management Point of Sale (POS) application designed with a **tactile/kiosk-first UX**. It is optimized for tablets and touchscreens used by Cashiers, Waiters, and Kitchen Staff.

- **Core Stack:** React 19, TypeScript 5.8, Vite 6.
- **Styling:** Tailwind CSS 3.4 (Custom palette: Sage, Carbon, Primary).
- **State Management:** TanStack Query 5 (Server State).
- **Routing:** React Router 7.

## 🏗️ Architecture & Structure
The project follows a **Feature-Based Architecture**. Each module in `src/features/` is self-contained.

### Core Modules (`src/features/`)
- `daily-menu`: Configuration of the "Corrientazo" (Daily Menu) and base price management.
- `inventory`: Stock control, out-of-stock alerts, and daily resets.
- `orders`: Order creation (table-centric), billing, and Kitchen Kanban.
- `tables`: Visual floor plan management and status tracking.
- `menu`: Commercial product catalog and category management.
- `auth` & `users`: Access control, RBAC, and team management.

### Shared Components (`src/components/`)
Organized by semantic responsibility:
- `guards/`: Route protection and session logic (`ProtectedRoute`, `Guard`).
- `network/`: Connection status and offline handling (`OfflineIndicator`).
- `feedback/`: Error handling and skeletons (`ErrorBoundary`).
- `ui/`: Atomic components (Button, Card, Input, etc.).

## 🎨 UX/UI Standards
- **Tactile-First:** Minimum 44px touch targets for all interactive elements.
- **Standardization:** Always use `npm run fix:ui` to ensure semantic design tokens and premium typography.
- **Animations:** Powered by the "Soft & Minimal" engine in `src/utils/motion.ts`. No spring/bouncing physics allowed.

---
*For detailed technical guidelines and coding rules, see `AGENTS.md`.*
