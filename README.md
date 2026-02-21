# Plaet - Restaurant Management POS

React + TypeScript + Vite restaurant management application with tactile/kiosk UX.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Architecture

```
src/
├── features/          # Feature-based modules
│   ├── daily-menu/   # Daily menu configuration
│   ├── menu/         # Menu items & categories
│   ├── orders/       # Order management
│   ├── tables/       # Table management
│   └── users/        # User management
├── components/        # UI components
├── contexts/          # React contexts
├── hooks/            # Custom hooks
├── layouts/          # Page layouts
├── lib/              # Utilities & config
├── pages/            # Route pages
├── services/         # API services
└── types/            # TypeScript types
```

## 📋 Available Scripts

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build
npm run type-check       # TypeScript check
npm run lint             # ESLint check
npm run lint -- --fix    # Auto-fix ESLint errors
```

## 🎨 Tech Stack

- **React 19** + TypeScript 5.8
- **Vite** - Build tool
- **TanStack Query 5** - Server state management
- **React Router 7** - Routing
- **Tailwind CSS 3.4** - Styling
- **React Hook Form + Zod** - Forms & validation
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## 📖 Documentation

- `AGENTS.md` - Complete development guidelines
- `notes/` - Project notes and decisions

## 🔑 Key Features

- **Daily Menu**: Configure daily menu with auto-selected categories
- **Orders**: Create and manage orders with real-time status
- **Tables**: Visual table management
- **Menu**: Product and category management
- **Users**: Role-based access control

## 📝 Code Standards

See `AGENTS.md` for complete guidelines including:
- TypeScript strict mode (no `any` or `unknown`)
- ESLint configuration with underscore prefix for unused vars
- Component and file naming conventions
- Git workflow and commit conventions

## 🔒 Authentication

JWT-based authentication with httpOnly cookies. See AGENTS.md for details.

## 📱 Responsive Design

Optimized for both desktop (admin) and tablet/kiosk (POS) interfaces.

---

Built with ❤️ using React + TypeScript + Vite
