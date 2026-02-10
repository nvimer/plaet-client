# CLIENT.AGENTS.md - Frontend Development Guidelines

## 🎯 Project Overview

**Framework:** React 18+ with TypeScript  
**Build Tool:** Vite  
**Styling:** Tailwind CSS  
**State Management:** Context API  
**HTTP Client:** Axios  
**Routing:** React Router  
**Architecture:** Feature-based modular structure

---

## 🏗️ Frontend Architecture

### Directory Structure

```
src/
├── app/                    # Route configuration
├── assets/                 # Static assets
├── components/             # Shared components
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout-specific components
├── contexts/               # React Context providers
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   ├── dashboard/         # Dashboard feature
│   ├── landing/           # Landing page
│   ├── menu/              # Menu management
│   ├── orders/            # Order management
│   ├── tables/            # Table management
│   └── users/             # User management
├── hooks/                 # Custom React hooks
├── layouts/               # Page layout templates
├── lib/                   # Library utilities
├── pages/                 # Page components
├── services/              # API service layer
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

### Component Architecture Pattern

Each feature follows a consistent pattern:

```
feature/
├── components/          # Feature-specific components
├── hooks/              # Custom hooks for feature
├── pages/              # Page components
├── schemas/            # Validation schemas (Zod)
└── index.ts           # Feature exports
```

---

## 🚀 Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run all tests
npm run test:ui         # Run tests with UI
npm run test:coverage    # Run tests with coverage report

# Linting/Formatting
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run type-check      # Type check with TypeScript
```

---

## 🎨 Code Style Guidelines

### TypeScript Configuration

- Strict mode enabled
- Target: ES2020
- Module: ESNext
- JSX: React-jsx

### Component Patterns

- Use functional components with React hooks
- Prefer interfaces over types for object shapes
- Use descriptive component names
- Implement proper prop types

### File Naming Conventions

- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Hooks: camelCase with use prefix (`useAuth.ts`)
- Types: camelCase (`authTypes.ts`)

### Import/Export Organization

1. External libraries (React, third-party)
2. Internal components/hooks
3. Types and interfaces
4. Utilities and helpers

---

## 🔐 Authentication System Implementation

### Backend Integration

The backend provides enterprise-grade authentication with:

- JWT tokens stored in httpOnly cookies
- Token rotation and blacklisting
- Account lockout protection
- Email verification flows
- Strong password policies

### Frontend Requirements

#### 1. Authentication State Management

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified: boolean;
  roles: Role[];
}
```

#### 2. API Endpoints Integration

```typescript
// Public Endpoints
POST /api/v1/auth/register              # User registration
POST /api/v1/auth/login                 # User login
POST /api/v1/auth/forgot-password       # Password reset request
POST /api/v1/auth/reset-password        # Reset with token
POST /api/v1/auth/verify-email          # Email verification
POST /api/v1/auth/resend-verification   # Resend verification
POST /api/v1/auth/refresh-token         # Token refresh

// Protected Endpoints (Requires auth)
POST /api/v1/auth/logout                # User logout
POST /api/v1/auth/change-password       # Change password
GET  /api/v1/profile/me                # Get current user
```

#### 3. Form Validation Requirements

```typescript
// Password Policy (Backend: 12+ chars)
{
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPatterns: true
}

// Email Requirements
{
  format: 'email',
  required: true
}

// Name Requirements
{
  minLength: 3,
  maxLength: 50,
  required: true
}

// Phone Requirements
{
  pattern: /^\d{10}$/,
  optional: true
}
```

#### 4. Required Components

```typescript
// Authentication Components
LoginForm
RegisterForm
ForgotPasswordForm
ResetPasswordForm
EmailVerificationForm
ChangePasswordForm

// Higher-Order Components
AuthProvider (Context)
AuthGuard (Route protection)
ProtectedRoute

// UI Components
LoadingSpinner
ErrorMessage
SuccessMessage
ValidationFeedback
```

#### 5. Authentication Flow Implementation

1. **Registration Flow:**

   - Collect user data → Validate → API call → Email verification required
   - Show verification prompt → Handle email verification → Redirect to login

2. **Login Flow:**

   - Email/Password → Validate → API call → Handle response
   - Success: Store user state → Redirect to dashboard
   - Error: Show appropriate message → Account lockout handling

3. **Token Management:**

   - Automatic refresh in background
   - Handle token expiration gracefully
   - Logout on token revocation

4. **Password Reset Flow:**
   - Email request → Show success message → Email link
   - Token verification → New password form → Completion

#### 6. Error Handling Patterns

```typescript
// API Response Format
{
  success: boolean,
  message: string,
  data?: any,
  errorCode?: string,
  meta?: any
}

// Error Code Handling
'INVALID_CREDENTIALS'      // "Invalid email or password"
'ACCOUNT_LOCKED'          // "Account locked. Try again in X minutes"
'EMAIL_NOT_VERIFIED'      // "Please verify your email first"
'TOKEN_EXPIRED'          // Auto-refresh token
'RATE_LIMIT_EXCEEDED'     // "Too many attempts. Try again later"
'INVALID_PASSWORD'        // "Current password is incorrect"
```

---

## 🔧 Technical Implementation Guidelines

### State Management Best Practices

- Use React Context API for global auth state
- Implement proper loading states
- Handle error states gracefully
- Separate concerns (auth state vs UI state)

### API Integration Guidelines

- Use centralized Axios configuration
- Implement request/response interceptors
- Handle network errors appropriately
- Implement retry logic for failed requests

### Security Considerations

- Never access JWT tokens directly (httpOnly cookies)
- Implement proper CSRF protection
- Handle sensitive data carefully
- Log out on security events

### Performance Optimizations

- Implement code splitting for routes
- Use lazy loading for heavy components
- Optimize bundle size
- Implement proper caching strategies

---

## 🧪 Testing Guidelines

### Component Testing

- Use React Testing Library
- Test user interactions, not implementation
- Mock external dependencies
- Test error states and edge cases

### Integration Testing

- Test complete authentication flows
- Mock API responses appropriately
- Test redirect behaviors
- Test error handling

### Test Organization

```
src/
└── __tests__/
    ├── components/        # Component tests
    ├── features/         # Feature integration tests
    ├── hooks/           # Custom hook tests
    ├── utils/           # Utility function tests
    └── setup.ts         # Test configuration
```

---

## 📋 Current Implementation Status

### ✅ Completed Features

- Feature-based architecture
- Basic routing setup
- Component library foundation
- API service layer structure
- TypeScript configuration

### 🚧 In Progress

- Authentication system implementation
- Form validation integration
- Route protection mechanisms

### 📋 TODO Items

- Complete authentication flows
- Implement all auth forms
- Add comprehensive error handling
- Set up testing infrastructure
- Optimize bundle and performance

---

## 🔗 Useful References

### React Documentation

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Context API](https://react.dev/reference/react/useContext)
- [React Router Documentation](https://reactrouter.com/en/main)

### Best Practices

- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript React Guidelines](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Authentication Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)

---

## 🎯 Development Workflow

### Feature Development

1. Create feature branch from main
2. Implement components and logic
3. Add comprehensive tests
4. Update documentation
5. Create pull request

### Code Review Checklist

- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] ESLint rules passing
- [ ] Components properly documented
- [ ] Security considerations addressed
- [ ] Performance implications considered

### Git Workflow

```bash
# Feature branch
git checkout -b feature/auth-implementation

# Commit with descriptive messages
git add .
git commit -m "feat(auth): implement login form component"

# Push and create PR
git push origin feature/auth-implementation
```
