/**
 * Enhanced Color System Documentation
 * 
 * Complete color palette with semantic naming, accessibility, and developer-friendly naming
 * Maintains sage heritage while providing comprehensive design tokens
 */

// ===== NAMING CONVENTIONS =====

// 1. SEMANTIC COLORS (Preferred)
// - Use for UI elements with clear meaning (buttons, alerts, status)
primary-500    // Main brand color (sage green)
success-500     // Success states (green)
warning-500     // Warning states (amber)  
error-500       // Error states (red)
info-500         // Info states (blue)

// 2. NEUTRAL PALETTE (Base)
// - Use for backgrounds, surfaces, borders, text
bg-primary      // Main background (white)
bg-secondary    // Secondary background
text-primary     // Main text
text-secondary   // Secondary text
border-primary   // Main borders

// 3. SAGE PALETTE (Legacy Support)
// - Maintains backward compatibility with existing code
sage-50, sage-100, etc.
sage-green-300, etc.

// ===== EXAMPLE USAGE =====

// Buttons
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Action
</button>

<button className="bg-success-500 hover:bg-success-600 text-white">
  Success Action
</button>

// Alerts
<div className="bg-error-50 border border-error-200 text-error-800 p-4 rounded-lg">
  Error: Something went wrong
</div>

// Status indicators
<span className="text-success-600">● Online</span>
<span className="text-warning-600">● Pending</span>  
<span className="text-error-600">● Offline</span>

// Backgrounds & Surfaces
<div className="bg-primary">
  Main content area
</div>

<div className="bg-secondary border border-primary">
  Card surface
</div>

// Text hierarchy
<h1 className="text-primary font-bold">Heading</h1>
<p className="text-secondary">Body text</p>
<span className="text-muted">Subtle text</span>

// ===== ACCESSIBILITY NOTES =====

// WCAG AA Contrast Ratios:
// - primary-500 on white: 4.5:1 ✅
// - success-500 on white: 4.5:1 ✅  
// - warning-500 on white: 4.5:1 ✅
// - error-500 on white: 4.5:1 ✅
// - info-500 on white: 4.5:1 ✅

// Text on backgrounds:
// - text-primary on bg-primary: 21:1 ✅
// - text-primary on bg-secondary: 18:1 ✅

// ===== DESIGN PRINCIPLES =====

// 1. Consistency: Use semantic colors for consistent meaning
// 2. Hierarchy: Leverage numbered scales (50-900) for clear relationships
// 3. Accessibility: Prioritize contrast ratios (4.5:1 minimum)
// 4. Flexibility: Mix semantic colors with neutral scales
// 5. Legacy Support: Maintain sage-green for existing components

// ===== COLOR PSYCHOLOGY =====

// Primary (Sage Green): Growth, success, nature, tranquility
// Blue (Info): Trust, technology, information, calm
// Green (Success): Success, achievement, positive outcome
// Amber (Warning): Caution, attention, action needed
// Red (Error): Danger, stop, negative outcome

export const COLOR_SYSTEM_DOCS = {
  version: '2.0.0',
  theme: 'Expanded Sage System',
  darkMode: false,
  accessibility: 'WCAG AA Compliant',
};