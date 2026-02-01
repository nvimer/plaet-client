# Sazonarte Client - Project Guidelines & Claude Best Practices

## Table of Contents
1. [Claude Code Best Practices](#claude-code-best-practices)
2. [Project Overview](#project-overview)
3. [UX/UI Design System](#uxui-design-system)
4. [Component Guidelines](#component-guidelines)
5. [Code Standards](#code-standards)

---

## Claude Code Best Practices

### 1. Do More in Parallel
- Use **3-5 git worktrees simultaneously**, each running its own Claude session
- This is the single biggest productivity unlock
- Name worktrees and set up shell aliases (za, zb, zc) for quick switching
- Maintain a dedicated "analysis" worktree for reading logs and running queries

**Project Setup:**
```bash
# Create worktrees for parallel development
git worktree add ../sazonarte-client-feat-a feat/feature-a
git worktree add ../sazonarte-client-feat-b feat/feature-b
git worktree add ../sazonarte-client-analysis main  # For analysis only

# Shell aliases (~/.bashrc or ~/.zshrc)
alias za="cd ~/work/sazonarte-client && claude"
alias zb="cd ~/work/sazonarte-client-feat-a && claude"
alias zc="cd ~/work/sazonarte-client-feat-b && claude"
```

### 2. Start Every Complex Task in Plan Mode
- Pour energy into planning so Claude can **1-shot the implementation**
- Use one Claude to write the plan, then a second Claude to review it as a staff engineer
- When something goes sideways, switch back to plan mode and re-plan
- Explicitly tell Claude to enter plan mode for verification steps

**Trigger phrases:**
- "Entra en modo plan antes de implementar"
- "Planifica esto como un senior engineer"
- "Revisa este plan como staff engineer antes de aprobar"
- "Algo salió mal, volvamos a planificar"

### 3. Invest in Your CLAUDE.md
- After every correction, say: **"Actualiza CLAUDE.md para no repetir ese error"**
- Ruthlessly edit CLAUDE.md over time
- Keep iterating until Claude's mistake rate measurably drops
- Maintain a `/notes` directory for every task/project

**Notes Directory Structure:**
```
/notes
├── 2025-01-15-tables-ux.md      # Task-specific notes
├── 2025-01-14-stock-management.md
├── common-errors.md              # Recurring mistakes
└── decisions.md                  # Architecture decisions
```

### 4. Create Your Own Skills and Commands
- If you do something **more than once a day**, turn it into a skill or command
- Build a `/techdebt` command and run it at the end of every session
- Set up commands for syncing context from multiple sources

**Recommended Commands:**
```
/techdebt    - Review and document technical debt
/review      - Code review checklist
/test        - Run test suite with coverage
/deploy      - Deployment checklist
/sync        - Sync context from GitHub/Slack/etc
```

### 5. Claude Fixes Most Bugs by Itself
- Paste a bug thread and say **"fix"** without micromanaging
- Say "Arregla los tests que fallan en CI" without specifying how
- Point Claude at logs to troubleshoot: "Revisa los logs y soluciona"

**Example prompts:**
- "Los tests de users fallan, arregla"
- "Hay un error 500 en /api/orders, investiga y soluciona"
- "El build de CI falló, revisa y corrige"

### 6. Level Up Your Prompting

#### Challenge Claude:
- "Hazme preguntas sobre estos cambios antes de crear el PR"
- "Pruébame que funciona" - diff entre main y feature branch
- "Sabiendo todo lo que sabes ahora, descarta esto e implementa la solución elegante"

#### Write Detailed Specs:
- Reduce ambiguity **before** handing work off
- The more specific you are, the better the output
- Include acceptance criteria, edge cases, and examples

### 7. Use Subagents
- Append **"usa subagentes"** to throw more compute at complex problems
- Offload individual tasks to subagents to keep main context clean
- Good for: parallel research, code review, testing

### 8. Use Claude for Data & Analytics
- Use CLI tools (bq, psql, prisma) to pull and analyze metrics
- Works for any database with a CLI, MCP, or API
- Let Claude write and execute queries

### 9. Learning with Claude
- Enable "Explanatory" output style for learning sessions
- Ask for visual HTML presentations explaining unfamiliar code
- Request ASCII diagrams of architecture and data flows
- Build spaced-repetition: explain understanding, Claude asks follow-ups

---

## Project Overview

**Sazonarte** is a modern restaurant management system (POS) built with React, TypeScript, and Tailwind CSS. The application prioritizes tactile, intuitive interfaces inspired by kiosk systems.

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18+ with TypeScript |
| Styling | Tailwind CSS with custom design system |
| State | React Query (@tanstack/react-query) |
| Forms | React Hook Form + Zod validation |
| Routing | React Router DOM |
| Icons | Lucide React |
| Animations | Framer Motion, CSS animations |
| Utilities | clsx, tailwind-merge |

---

## UX/UI Design System

### Color System

```
Primary Colors:
├── sage-green-*    Primary brand (300 = main accent)
└── carbon-*        Text and neutral tones

Semantic Colors:
├── success-*       Positive actions, available states
├── warning-*       Alerts, needs attention
├── error-*         Errors, occupied/blocked states
└── info-*          Informational elements

Background:
├── sage-50         Primary background
├── white           Card surfaces
└── sage-100        Secondary backgrounds
```

### Typography

```
Font: Inter (sans-serif)

Hierarchy:
├── Headings        font-semibold or font-bold
├── Body            font-normal (400)
└── Subtle/Helper   font-light (300)

Sizes:
├── Display         text-3xl to text-5xl (page titles)
├── Heading         text-xl to text-2xl (sections)
├── Body            text-base (16px)
├── Small           text-sm (labels)
└── Tiny            text-xs (badges)
```

### Spacing (8px Grid)

```
Base unit: 4px (0.25rem)
Standard: 4, 8, 12, 16, 24, 32, 48, 64

Component spacing:
├── Inline          gap-2 to gap-4
├── Sections        space-y-6 to space-y-8
├── Card padding    p-4 (sm), p-6 (md), p-8 (lg)
└── Page margins    px-4 (mobile), px-6 (desktop)
```

### Border Radius

```
├── Standard        rounded-xl (12px) - cards, buttons, inputs
├── Large           rounded-2xl (16px) - modals, containers
└── Full            rounded-full - avatars, circles
```

### Animations

```css
/* Timing */
duration-200    Quick interactions
duration-300    Standard animations
duration-500    Emphasis animations

/* Easing */
ease-out        Enter animations
ease-in         Exit animations
ease-in-out     Continuous
```

---

## Component Guidelines

### Buttons

```tsx
// Primary action (main CTA) - ONE per view
<Button variant="primary" size="lg">Action</Button>

// Secondary action
<Button variant="secondary">Secondary</Button>

// Loading state - ALWAYS show spinner
<Button isLoading disabled>Processing...</Button>
```

**Rules:**
- Minimum touch target: **44x44px** (use size="lg" for mobile)
- Always show loading state during async operations
- Primary buttons: **ONE per view**
- Use icons to reinforce meaning

### Inputs

```tsx
<Input
  label="Nombre del campo"           // Required for accessibility
  placeholder="Texto de ayuda..."    // Examples, not labels
  error={errors.field?.message}      // Inline validation
  helperText="Información adicional"
  fullWidth
/>
```

### Forms

**Validation:**
- Real-time: `mode: 'onChange'`
- Clear error messages in Spanish
- Success feedback on valid input

**Layout:**
```
Mobile:   Single column
Tablet+:  Two columns for related fields
Desktop:  Side preview when applicable
```

---

## Code Standards

### File Structure

```
src/
├── components/          # Shared UI components
│   ├── ui/             # Base (Button, Input, Card)
│   └── layout/         # Layout (Sidebar, Header)
├── features/           # Feature modules
│   └── [feature]/
│       ├── components/ # Feature components
│       ├── hooks/      # Feature hooks
│       ├── pages/      # Feature pages
│       └── schemas/    # Zod validation
├── hooks/              # Shared hooks
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utilities
```

### Naming Conventions

```
Components:  PascalCase     TableCreatePage.tsx
Hooks:       camelCase      useCreateTable.ts
Utils:       camelCase      formatDate.ts
Types:       PascalCase     User, Table, Order
Enums:       PascalCase     TableStatus, OrderStatus
```

### Git Workflow

**Branch Naming:**
```
feat/[module]-[feature]     New features
fix/[module]-[issue]        Bug fixes
refactor/[module]-[change]  Refactoring
style/[module]-[change]     UI/UX improvements
docs/[change]               Documentation
```

**Commit Messages:**
```
feat: add table creation wizard
fix: resolve table status not updating
refactor: simplify table form validation
style: improve table card hover states
docs: update component documentation
```

---

## Common Errors & Solutions

> **Note:** Update this section after every correction with "Actualiza CLAUDE.md"

### Error: Types mismatch with backend
**Solution:** Always check backend response structure before typing. Use `console.log` to inspect actual data shape.

### Error: Using `any` type
**Solution:** Define proper types in `/types`. Use `AxiosErrorWithResponse` for error handling.

### Error: Form validation not showing
**Solution:** Use `mode: 'onChange'` in useForm for real-time validation.

---

## Notes Directory

See `/notes` for task-specific documentation and decisions.

```
/notes
├── common-errors.md     # Recurring mistakes and fixes
├── decisions.md         # Architecture decisions log
└── [date]-[task].md     # Task-specific notes
```

---

## Accessibility (WCAG 2.2)

### Required Practices

1. **Color Contrast:** Minimum 4.5:1 for text
2. **Focus Visible:** Always show focus states
3. **Touch Targets:** Minimum 44x44px
4. **Labels:** All inputs must have labels
5. **Alt Text:** All images need descriptions
6. **Keyboard Navigation:** All actions keyboard-accessible
7. **Screen Reader:** Use semantic HTML and ARIA

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
- [ ] Run `/techdebt` to document any debt
