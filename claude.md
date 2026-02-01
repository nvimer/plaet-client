# Sazonarte Client - Project Guidelines

## Project Overview

**Sazonarte** is a modern restaurant management system (POS) built with React, TypeScript, and Tailwind CSS. The application prioritizes tactile, intuitive interfaces inspired by kiosk systems like McDonald's self-service terminals.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query (@tanstack/react-query) for server state
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion (optional), CSS animations
- **Utilities**: clsx, tailwind-merge

---

## UX/UI Design System Rules (2025 Best Practices)

### 1. Color System

Use the established color tokens defined in `tailwind.config.js`:

```
Primary Colors:
- sage-green-*: Primary brand color (300 is main accent)
- carbon-*: Text and neutral tones

Semantic Colors:
- success-*: Positive actions, available states
- warning-*: Alerts, needs attention
- error-*: Errors, occupied/blocked states
- info-*: Informational elements

Background:
- sage-50: Primary background
- white: Card surfaces
- sage-100: Secondary backgrounds
```

### 2. Typography

```
Font Family: Inter (sans-serif)

Hierarchy:
- Headings: font-semibold or font-bold
- Body: font-normal (400)
- Subtle/Helper: font-light (300)

Sizes:
- Display: text-3xl to text-5xl (page titles)
- Heading: text-xl to text-2xl (section titles)
- Body: text-base (16px default)
- Small: text-sm (labels, helpers)
- Tiny: text-xs (badges, captions)
```

### 3. Spacing (8px Grid System)

```
Base unit: 4px (0.25rem)
Standard increments: 4, 8, 12, 16, 24, 32, 48, 64

Component spacing:
- Inline elements: gap-2 to gap-4
- Section spacing: space-y-6 to space-y-8
- Card padding: p-4 (sm), p-6 (md), p-8 (lg)
- Page margins: px-4 (mobile), px-6 (desktop)
```

### 4. Border Radius

```
Standard: rounded-xl (12px) - cards, buttons, inputs
Large: rounded-2xl (16px) - modals, major containers
Full: rounded-full - avatars, circular elements
```

### 5. Shadows

```
Subtle: shadow-sm - hover states
Medium: shadow-md - elevated cards
Large: shadow-lg - modals, dropdowns
Soft variants: shadow-soft-* - sage-tinted shadows
```

---

## Component Guidelines

### Buttons

```tsx
// Primary action (main CTA)
<Button variant="primary" size="lg">Action</Button>

// Secondary action
<Button variant="secondary">Secondary</Button>

// Destructive action (always confirm)
<Button variant="outline" className="text-error-600">Delete</Button>

// Loading state (always show spinner)
<Button isLoading disabled>Processing...</Button>
```

**Rules:**
- Minimum touch target: 44x44px (use size="lg" for mobile)
- Always show loading state during async operations
- Primary buttons should have only ONE per view
- Use icons to reinforce meaning (Check, Plus, Trash, etc.)

### Inputs

```tsx
<Input
  label="Nombre del campo"
  placeholder="Texto de ayuda..."
  error={errors.field?.message}
  helperText="Información adicional"
  fullWidth
/>
```

**Rules:**
- Always include labels (accessibility)
- Use placeholders as examples, not labels
- Show validation errors inline and immediately
- Disabled inputs should explain why

### Cards

```tsx
<Card variant="elevated" padding="lg" hover>
  {/* Content */}
</Card>
```

**Rules:**
- Use `variant="elevated"` for primary content
- Use `variant="bordered"` for selection states
- Add `hover` prop only if card is clickable

### Forms

**Progressive Disclosure:**
- Show only necessary fields initially
- Group related fields
- Use multi-step wizards for complex forms (3+ steps)

**Validation:**
- Real-time validation (mode: 'onChange')
- Clear, actionable error messages in Spanish
- Success feedback on valid input

**Layout:**
```
Mobile: Single column
Tablet+: Two columns for related fields
Desktop: Side preview when applicable
```

---

## Animation Guidelines

### Transitions

```css
/* Standard timing */
transition-all duration-200  /* Quick interactions */
transition-all duration-300  /* Standard animations */
transition-all duration-500  /* Emphasis animations */

/* Easing */
ease-out     /* Enter animations */
ease-in      /* Exit animations */
ease-in-out  /* Continuous animations */
```

### Micro-interactions

1. **Hover States**: Scale, color change, shadow
2. **Focus States**: Ring outline, border color
3. **Active States**: Scale down slightly (0.98)
4. **Loading**: Spinner + opacity reduction
5. **Success**: Green flash + checkmark animation

### Page Transitions

Use Framer Motion for page transitions:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
```

---

## Accessibility (WCAG 2.2)

### Required Practices

1. **Color Contrast**: Minimum 4.5:1 for text
2. **Focus Visible**: Always show focus states
3. **Touch Targets**: Minimum 44x44px
4. **Labels**: All inputs must have labels
5. **Alt Text**: All images need descriptions
6. **Keyboard Navigation**: All actions keyboard-accessible
7. **Screen Reader**: Use semantic HTML and ARIA

### Implementation

```tsx
// Always include aria-labels for icon buttons
<button aria-label="Cerrar menú">
  <X className="w-5 h-5" />
</button>

// Use semantic elements
<main>, <nav>, <header>, <footer>, <section>, <article>

// Announce dynamic content
<div role="alert" aria-live="polite">
  {successMessage}
</div>
```

---

## Form Patterns

### Single-Step Form (Simple)

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  <Input {...} />
  <Input {...} />
  <div className="flex gap-4">
    <Button type="submit" variant="primary">Guardar</Button>
    <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
  </div>
</form>
```

### Multi-Step Wizard (Complex)

```tsx
// Structure
1. Step indicators (visual progress)
2. Step content (one focus area)
3. Navigation buttons (Previous/Next/Submit)
4. Live preview (when applicable)

// Rules
- Max 5 steps
- Each step validates before advancing
- Allow going back without losing data
- Show summary before final submission
```

---

## Responsive Design

### Breakpoints

```
sm: 640px   - Large phones
md: 768px   - Tablets
lg: 1024px  - Small laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

### Mobile-First Approach

```tsx
// Start with mobile, enhance for larger screens
<div className="
  flex flex-col        // Mobile: stack
  md:flex-row          // Tablet+: side by side
  gap-4 md:gap-6       // Responsive gaps
  p-4 md:p-6 lg:p-8    // Responsive padding
">
```

---

## Toast Notifications

```tsx
import { toast } from 'sonner';

// Success
toast.success("¡Acción completada!", {
  description: "Descripción detallada",
  icon: "✅",
  duration: 4000,
});

// Error
toast.error("Error al procesar", {
  description: error.message,
  icon: "❌",
  duration: 5000,
});

// Warning
toast.warning("Atención requerida", {
  description: "Acción necesaria",
  icon: "⚠️",
});
```

---

## File Structure

```
src/
├── components/          # Shared UI components
│   ├── ui/             # Base components (Button, Input, Card)
│   └── layout/         # Layout components (Sidebar, Header)
├── features/           # Feature modules
│   └── [feature]/
│       ├── components/ # Feature-specific components
│       ├── hooks/      # Feature-specific hooks
│       ├── pages/      # Feature pages
│       └── schemas/    # Zod validation schemas
├── hooks/              # Shared hooks
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

---

## Code Style

### Naming Conventions

```
Components: PascalCase (TableCreatePage.tsx)
Hooks: camelCase with 'use' prefix (useCreateTable.ts)
Utils: camelCase (formatDate.ts)
Types: PascalCase (User, Table, Order)
Enums: PascalCase (TableStatus, OrderStatus)
```

### Component Structure

```tsx
// 1. Imports (external, then internal)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components';
import { useCreateTable } from '../hooks';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export function ComponentName({ prop1, prop2 }: Props) {
  // Hooks first
  const navigate = useNavigate();
  const [state, setState] = useState();
  
  // Derived state
  const computed = useMemo(() => {}, []);
  
  // Handlers
  const handleAction = () => {};
  
  // Render helpers (if needed)
  const renderSection = () => {};
  
  // Return JSX
  return (
    <div>
      {/* JSX content */}
    </div>
  );
}
```

---

## Git Workflow

### Branch Naming

```
feat/[module]-[feature]     # New features
fix/[module]-[issue]        # Bug fixes
refactor/[module]-[change]  # Refactoring
style/[module]-[change]     # UI/UX improvements
docs/[change]               # Documentation
```

### Commit Messages

```
feat: add table creation wizard
fix: resolve table status not updating
refactor: simplify table form validation
style: improve table card hover states
docs: update component documentation
```

---

## Performance Guidelines

1. **Lazy Loading**: Use React.lazy for route-based code splitting
2. **Memoization**: useMemo/useCallback for expensive computations
3. **Image Optimization**: Use appropriate sizes and formats
4. **Bundle Size**: Monitor and optimize dependencies
5. **React Query**: Use staleTime and cacheTime appropriately

---

## Testing Checklist

Before merging:

- [ ] Component renders without errors
- [ ] Form validation works correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] No console errors/warnings
- [ ] TypeScript compiles without errors
