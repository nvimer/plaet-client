# Plaet Client Skill

## Description
Specialized instructions for working with the Plaet frontend application (React 19 + Vite + TypeScript).

## Commands

### Essential Commands
```bash
cd client
npm run dev          # Start development server
npm run build        # Production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run fix:ui       # Standardize UI components
```

## Architecture

### Directory Structure
```
src/
├── features/{name}/     # Feature-based modules
│   ├── components/     # Feature-specific components
│   ├── hooks/          # TanStack Query hooks
│   ├── pages/          # Route components
│   ├── schemas/        # Zod validation schemas
│   ├── services/       # API call functions
│   └── index.ts        # Barrel exports
├── components/          # Shared UI components
├── contexts/           # React contexts
├── hooks/              # Shared hooks
├── layouts/            # Layout components
├── services/           # API clients
├── types/              # TypeScript types
└── utils/              # Utilities
```

## Code Conventions

### UI Styling (Tailwind)
- **ALWAYS use semantic tokens** from `tailwind.config.js`:
  - Colors: `sage`, `carbon`, `success`, `warning`, `error`, `info`
  - Never use literal colors like `red-500`, `gray-800`
- Geometry: `rounded-2xl` for cards, `rounded-3xl` for launchpads
- Motion: Use `transitions.soft` and `framer-motion`

### Form Handling
- Always use `react-hook-form` + `@hookform/resolvers/zod`
- Schema: Define in `features/{module}/schemas/`
- Always use `mode: "onChange"` for validation feedback

### State Management
- **TanStack Query** for server state
- **React Context** for auth and UI state
- Never use localStorage for sensitive data

## Validation (Zod)

### Schema Pattern
```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras"),
  email: z.string().email("Email inválido"),
});
```

## Common Issues & Solutions

### Issue: Form validation not showing
- Add `mode: "onChange"` to useForm

### Issue: Tailwind classes not applying
- Check semantic token exists in tailwind.config.js

## Best Practices

1. **Always run type-check** before committing
2. **Use barrel exports** (`index.ts`) for clean imports
3. **Use semantic tokens** - never hardcode colors
