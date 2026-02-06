# Frontend API Requirements Specification
## Sazonarte POS System - Corrientazo Module

**Document Version:** 1.0  
**Date:** February 6, 2026  
**Author:** Senior Frontend Developer  
**Status:** Technical Requirements for Backend Implementation

---

## Executive Summary

This document outlines the specific API requirements from the Frontend perspective for the **Corrientazo (Set Lunch) Module**. The frontend has been developed with a sophisticated multi-diner order flow that requires specific data structures, endpoints, and business logic support from the backend.

**Key Business Requirements:**
1. Dynamic daily menu configuration
2. Protein-based pricing with premium tiers
3. Plate component substitutions (free) vs extras (paid)
4. Multi-diner table orders
5. Combo meal pricing (not sum of parts)

---

## 1. Daily Menu Management

### 1.1 Overview
The Daily Menu displays what components are included in today's corrientazo. This changes daily and must be configurable by admin users.

### 1.2 Required Endpoints

#### GET /api/v1/daily-menu/current
**Purpose:** Retrieve today's menu configuration

**Frontend Usage:**
- Displayed in `DailyMenuSection` component
- Shown on order creation page
- Provides context to customers about what's included

**Expected Response:**
```typescript
{
  success: true,
  data: {
    id: "uuid",
    date: "2026-02-06", // ISO date
    side: "Frijoles con plátano maduro",      // Principio
    soup: "Sopa de verduras",                  // Sopa
    drink: "Limonada natural",                 // Jugo
    dessert: "Gelatina",                       // Postre (optional)
    isActive: true,
    createdAt: "2026-02-06T06:00:00Z",
    updatedAt: "2026-02-06T06:00:00Z"
  }
}
```

**Error Scenarios:**
- `404`: No menu configured for today (frontend shows "Not configured" state)
- `500`: Server error

#### GET /api/v1/daily-menu/:date
**Purpose:** Retrieve menu for specific date (for historical reference or future planning)

**Parameters:**
- `date`: ISO date string (YYYY-MM-DD)

#### PUT /api/v1/daily-menu
**Purpose:** Create or update today's menu (Admin only)

**Request Body:**
```typescript
{
  side: string;      // Required, max 200 chars
  soup: string;      // Required, max 200 chars  
  drink: string;     // Required, max 200 chars
  dessert?: string;  // Optional, max 200 chars
}
```

**Business Rules:**
- Only users with "ADMIN" or "MANAGER" role can update
- If menu exists for date, update it
- If no menu exists, create new one
- `isActive` should default to true

#### PUT /api/v1/daily-menu/:date
**Purpose:** Update menu for specific date (Admin only)

### 1.3 Database Schema Requirements

```prisma
model DailyMenu {
  id        String   @id @default(uuid())
  date      DateTime @unique @db.Date
  side      String   // Side dish (frijoles, lentejas, etc.)
  soup      String   // Soup of the day
  drink     String   // Drink of the day
  dessert   String?  // Optional dessert
  isActive  Boolean  @default(true)
  createdBy String?  // User UUID who created
  updatedBy String?  // User UUID who last updated
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([date])
  @@index([isActive])
  @@map("daily_menus")
}
```

---

## 2. Menu Items - Corrientazo Extensions

### 2.1 Overview
The existing `MenuItem` system needs extensions to support corrientazo logic. Proteins and plate components are all MenuItems but need special flags.

### 2.2 Required Schema Extensions

```prisma
model MenuItem {
  // ... existing fields ...
  
  // CORRIENTAZO SPECIFIC FIELDS
  isProtein        Boolean  @default(false)  // Is this a main protein?
  proteinIcon      String?  // "beef" | "fish" | "chicken" | "pork" | "other"
  isPlateComponent Boolean  @default(false)  // Is this a soup/side/salad/extra?
  componentType    String?  // "soup" | "principle" | "salad" | "additional"
  comboPrice       Decimal? @db.Decimal(10, 2)  // Price when part of complete lunch
}
```

### 2.3 Menu Item Categories

Required categories for corrientazo:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Proteins** | Main protein options | Carne, Pollo, Pescado, Cerdo |
| **Sides** | Side dishes (principio) | Frijoles, Arroz, Lentejas |
| **Soups** | Daily soup options | Sopa de verduras, Sopa de pollo |
| **Salads** | Salad options | Ensalada mixta, Ensalada de aguacate |
| **Extras** | Paid additions | Huevo, Papa, Aguacate, Plátano |
| **Drinks** | Beverages | Jugo, Gaseosa, Agua |
| **Desserts** | Sweet options | Gelatina, Flan, Fruta |

### 2.4 Required Endpoints

#### GET /api/v1/items?category=Proteins&isProtein=true
**Purpose:** Get all available proteins for corrientazo

**Query Parameters:**
- `category`: Filter by category name
- `isProtein`: true to get only proteins
- `isAvailable`: true (frontend only shows available items)

**Expected Response:**
```typescript
{
  success: true,
  data: [
    {
      id: 1,
      name: "Carne a la plancha",
      price: 6000,           // Unit price if ordered separately
      comboPrice: 10000,     // Price as part of complete lunch
      isProtein: true,
      proteinIcon: "beef",
      isPremium: false,      // false = base price, true = +$1000
      category: {
        id: 5,
        name: "Proteins"
      },
      isAvailable: true
    },
    {
      id: 4,
      name: "Carne de res",
      price: 7000,
      comboPrice: 11000,     // Premium protein
      isProtein: true,
      proteinIcon: "beef",
      isPremium: true,
      category: { id: 5, name: "Proteins" },
      isAvailable: true
    }
  ],
  meta: {
    total: 6,
    page: 1,
    limit: 20
  }
}
```

#### GET /api/v1/items?category=Extras&isPlateComponent=true
**Purpose:** Get plate components that can be added as extras

**Query Parameters:**
- `category`: "Extras" or "Sides"
- `isPlateComponent`: true
- `price_gt`: 0 (only paid extras)

#### GET /api/v1/items?isPlateComponent=true&price=0
**Purpose:** Get components for substitutions (free swaps)

**Business Logic:**
- Items with `price = 0` and `isPlateComponent = true` are free substitutions
- Items with `price > 0` and `isPlateComponent = true` are paid extras

---

## 3. Pricing Logic & Business Rules

### 3.1 Critical Requirement: Combo Pricing

**The most important business rule:** The corrientazo price is NOT the sum of individual items. It's a special combo price based on the protein selected.

#### Pricing Tiers

**Base Tier (Regular Proteins):**
- Pork (Chuleta): $6,000 unit / $10,000 combo
- Chicken (Pechuga): $6,000 unit / $10,000 combo
- Chicken (Apanado): $6,000 unit / $10,000 combo

**Premium Tier:**
- Beef (Res): $7,000 unit / $11,000 combo
- Fish (Pescado): $7,000 unit / $11,000 combo

#### Calculation Logic

```typescript
// Frontend Price Calculation
function calculateOrderTotal(items: OrderItem[]): number {
  const proteinItem = items.find(item => item.menuItem.isProtein);
  
  if (proteinItem) {
    // Start with protein's combo price
    let total = proteinItem.menuItem.comboPrice;
    
    // Add paid extras (items with price > 0)
    const extras = items.filter(item => 
      !item.menuItem.isProtein && 
      item.menuItem.price > 0
    );
    extras.forEach(item => {
      total += item.menuItem.price * item.quantity;
    });
    
    return total;
  } else {
    // No protein = sum of all unit prices
    return items.reduce((sum, item) => 
      sum + (item.menuItem.price * item.quantity), 0
    );
  }
}
```

### 3.2 Backend Responsibilities

1. **Store comboPrice for each protein** - Cannot calculate on the fly
2. **Validate price consistency** - Ensure combo prices are correct
3. **Support price history** - If prices change, old orders keep original prices
4. **Return both prices** - Frontend needs `price` (unit) and `comboPrice` (combo)

---

## 4. Order Creation - Enhanced Schema

### 4.1 Current Order Schema (Needs Extension)

The existing `POST /api/v1/orders` endpoint needs to support:

1. **Order-level notes** - For special requests
2. **Item-level notes** - "Carne sin sal", "Bien cocido", etc.
3. **Substitution tracking** - For reporting which swaps were made
4. **Multiple orders per table** - Batch creation endpoint

### 4.2 Enhanced Request Schema

```typescript
// POST /api/v1/orders
{
  type: "DINE_IN" | "TAKE_OUT" | "DELIVERY" | "WHATSAPP",
  tableId?: number,           // Required for DINE_IN
  customerId?: string,        // Optional
  notes?: string,             // Order-level notes (e.g., "Mesa 5 - Familia García")
  
  items: [
    {
      menuItemId: number,
      quantity: number,
      priceAtOrder: number,   // Capture price at creation time
      notes?: string,         // Item-level notes (e.g., "Sin sal")
      
      // CORRIENTAZO SPECIFIC
      isSubstitution?: boolean,  // Is this a substitution?
      originalItemId?: number,   // If substitution, what was replaced?
      isExtra?: boolean          // Is this a paid extra?
    }
  ]
}
```

### 4.3 Batch Order Creation (Critical)

**New Endpoint:** `POST /api/v1/orders/batch`

**Purpose:** Create multiple orders for the same table in one request

**Frontend Use Case:** 
- Table 5 has 4 diners
- User creates 4 separate orders
- All should be created atomically
- If one fails, all should fail (transaction)

**Request Body:**
```typescript
{
  tableId: 5,
  orders: [
    {
      type: "DINE_IN",
      items: [...],
      notes: "Pedido 1 - Sin sopa"
    },
    {
      type: "DINE_IN", 
      items: [...],
      notes: "Pedido 2 - Con extra huevo"
    }
    // ... more orders
  ]
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    createdOrders: [
      { id: "uuid-1", total: 10000, ... },
      { id: "uuid-2", total: 12000, ... }
    ],
    tableTotal: 22000
  }
}
```

---

## 5. Reporting & Analytics Requirements

### 5.1 Sales by Protein
**Purpose:** Know which proteins sell best

**Endpoint:** `GET /api/v1/reports/sales-by-protein`
**Parameters:**
- `startDate`: ISO date
- `endDate`: ISO date

**Expected Response:**
```typescript
{
  data: [
    { proteinId: 1, name: "Carne a la plancha", count: 45, revenue: 450000 },
    { proteinId: 4, name: "Carne de res", count: 32, revenue: 352000 }
  ]
}
```

### 5.2 Substitutions vs Extras Report
**Purpose:** Track how many substitutions (free) vs extras (paid) are made

**Endpoint:** `GET /api/v1/reports/component-usage`

### 5.3 Daily Menu Performance
**Purpose:** Track which daily menu configurations sell best

**Endpoint:** `GET /api/v1/reports/daily-menu-performance`

---

## 6. Real-time Requirements

### 6.1 WebSocket/Socket.io Events

**Frontend needs real-time updates for:**

1. **Table Status Changes**
   - When a table becomes occupied
   - When orders are created for a table
   - Event: `table:status:changed`

2. **Order Status Updates**
   - When order moves to "in kitchen"
   - When order is ready
   - Event: `order:status:updated`

3. **Menu Item Availability**
   - When a protein runs out
   - When component is no longer available
   - Event: `menu:item:availability:changed`

### 6.2 Polling Strategy

For systems without WebSockets:
- **Orders list:** Poll every 30 seconds
- **Table status:** Poll every 10 seconds
- **Daily menu:** Poll every 5 minutes (rarely changes)

---

## 7. Validation Requirements

### 7.1 Order Validation Rules

**Server-side must validate:**

1. **Protein Availability**
   - Cannot order protein with `isAvailable: false`
   - Return 400 with message: "Protein not available"

2. **Combo Price Integrity**
   - Verify protein has valid `comboPrice`
   - Calculate total server-side (don't trust frontend)

3. **Table Availability**
   - Cannot create DINE_IN order without table
   - Table must be AVAILABLE or OCCUPIED (same table)
   - Cannot use RESERVED or NEEDS_CLEANING tables

4. **Component Availability**
   - Substitution target must be available
   - Extra items must be available

### 7.2 Error Response Format

```typescript
{
  success: false,
  error: {
    code: "PROTEIN_NOT_AVAILABLE",
    message: "Selected protein is no longer available",
    details: {
      proteinId: 4,
      proteinName: "Carne de res"
    }
  }
}
```

---

## 8. Performance Requirements

### 8.1 Response Time SLAs

- **GET /daily-menu/current:** < 100ms
- **GET /items:** < 200ms (with filters)
- **POST /orders:** < 500ms (includes stock validation)
- **POST /orders/batch:** < 1000ms (4 orders max)

### 8.2 Caching Strategy

**Frontend will cache:**
- Daily menu: 5 minutes
- Menu items: 15 minutes
- Proteins list: 5 minutes

**Backend should set cache headers:**
```
Cache-Control: public, max-age=300  // 5 minutes for daily menu
```

---

## 9. Security Requirements

### 9.1 Authentication

All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### 9.2 Authorization Matrix

| Endpoint | WAITER | CASHIER | KITCHEN | ADMIN |
|----------|--------|---------|---------|-------|
| GET /daily-menu/current | ✅ | ✅ | ✅ | ✅ |
| PUT /daily-menu | ❌ | ❌ | ❌ | ✅ |
| GET /items | ✅ | ✅ | ✅ | ✅ |
| POST /orders | ✅ | ✅ | ❌ | ✅ |
| POST /orders/batch | ✅ | ❌ | ❌ | ✅ |
| DELETE /orders/:id | ❌ | ✅ | ❌ | ✅ |

---

## 10. Migration Strategy

### Phase 1: Core Tables (Week 1)
1. Create `daily_menus` table
2. Extend `menu_items` with corrientazo fields
3. Create seed data for categories

### Phase 2: API Endpoints (Week 2)
1. Implement Daily Menu CRUD
2. Extend Items API with filters
3. Update Order creation endpoint

### Phase 3: Frontend Integration (Week 3)
1. Connect frontend to real APIs
2. Remove mock data
3. Test end-to-end flow

### Phase 4: Reporting (Week 4)
1. Implement analytics endpoints
2. Create dashboard reports
3. Performance optimization

---

## 11. Open Questions for Backend Team

1. **Stock Management:** Should substitutions affect stock differently than extras?
   - Substitution: Remove soup stock, add principio stock
   - Extra: Keep soup stock, add egg stock

2. **Pricing Updates:** If combo prices change midday, do active orders keep old price?
   - Recommended: Yes, capture priceAtOrder

3. **Batch Orders:** Should all 4 orders in a batch have the same timestamp?
   - Recommended: Yes, for reporting consistency

4. **Daily Menu History:** Do we need to keep historical daily menus?
   - Recommended: Yes, for "what did we serve on Feb 1st?"

5. **Soft Deletes:** Should menu items be soft deleted or hard deleted?
   - Recommended: Soft delete to preserve order history

---

## 12. Appendix: Mock Data for Development

### Sample Proteins
```json
[
  { "id": 1, "name": "Grilled Pork Chop", "price": 6000, "comboPrice": 10000, "isProtein": true, "proteinIcon": "pork", "category": "Proteins" },
  { "id": 2, "name": "Grilled Chicken Breast", "price": 6000, "comboPrice": 10000, "isProtein": true, "proteinIcon": "chicken", "category": "Proteins" },
  { "id": 3, "name": "Fried Chicken", "price": 6000, "comboPrice": 10000, "isProtein": true, "proteinIcon": "chicken", "category": "Proteins" },
  { "id": 4, "name": "Grilled Beef Steak", "price": 7000, "comboPrice": 11000, "isProtein": true, "proteinIcon": "beef", "category": "Proteins" },
  { "id": 5, "name": "Fried Fish", "price": 7000, "comboPrice": 11000, "isProtein": true, "proteinIcon": "fish", "category": "Proteins" }
]
```

### Sample Plate Components
```json
[
  { "id": 101, "name": "Side Portion (Free Swap)", "price": 0, "isPlateComponent": true, "componentType": "principle", "category": "Sides" },
  { "id": 102, "name": "Salad Portion (Free Swap)", "price": 0, "isPlateComponent": true, "componentType": "salad", "category": "Salads" },
  { "id": 201, "name": "Egg", "price": 2000, "isPlateComponent": true, "componentType": "additional", "category": "Extras" },
  { "id": 202, "name": "Double Egg", "price": 3500, "isPlateComponent": true, "componentType": "additional", "category": "Extras" },
  { "id": 203, "name": "Avocado Portion", "price": 3000, "isPlateComponent": true, "componentType": "additional", "category": "Extras" }
]
```

---

**End of Document**

**Next Steps:**
1. Backend team reviews and provides feedback
2. Schedule technical alignment meeting
3. Create backend implementation tickets
4. Define API contract with OpenAPI/Swagger
5. Begin Phase 1 implementation

**Contact:** Senior Frontend Developer
**Review Date:** [To be scheduled]
