# Orders API Backend Requirements

## Current Status
The frontend has a complete API service layer for orders with the following endpoints already implemented:

## ✅ Existing Endpoints (Already Implemented)

### Core Order Operations
- `GET /orders` - List orders with pagination and filters
- `GET /orders/:id` - Get single order with full details
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order
- `PATCH /orders/:id/status` - Update order status only
- `DELETE /orders/:id` - Delete order (soft delete)

### Order Items Management
- `POST /orders/:id/items` - Add item to order
- `DELETE /orders/:orderId/items/:itemId` - Remove item from order

### Payments
- `POST /orders/:id/payments` - Register payment for order

## ❌ Missing Endpoints (Backend Implementation Required)

### 1. Order Items Management
```typescript
// Update order item quantity
PATCH /orders/:orderId/items/:itemId
{
  quantity: number;
  notes?: string;
}

// Update order item details
PATCH /orders/:orderId/items/:itemId
{
  quantity?: number;
  notes?: string;
  isFreeSubstitution?: boolean;
}
```

### 2. Order Status Workflow
```typescript
// Batch status updates
PATCH /orders/batch-status
{
  orderIds: string[];
  status: OrderStatus;
}

// Get orders by status for kitchen
GET /orders/kitchen?status=PENDING,IN_KITCHEN
GET /orders/kitchen?status=READY
```

### 3. Order Statistics & Reports
```typescript
// Daily sales summary
GET /orders/daily-sales?date=2024-01-01
{
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<OrderStatus, number>;
  averageOrderValue: number;
}

// Sales by date range
GET /orders/sales?from=2024-01-01&to=2024-01-31
{
  totalRevenue: number;
  totalOrders: number;
  dailyBreakdown: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

// Kitchen performance metrics
GET /orders/kitchen-metrics?from=2024-01-01&to=2024-01-31
{
  averagePreparationTime: number;
  ordersByStatus: Record<OrderStatus, number>;
  peakHours: Array<{
    hour: number;
    orderCount: number;
  }>;
}
```

### 4. Order Search & Advanced Filtering
```typescript
// Full-text search
GET /orders/search?q=hamburguesa&limit=20&offset=0

// Advanced filtering
GET /orders/advanced
{
  status?: OrderStatus[];
  type?: OrderType[];
  tableIds?: number[];
  waiterIds?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  minAmount?: number;
  maxAmount?: number;
  hasNotes?: boolean;
}
```

### 5. Order Actions & Workflows
```typescript
// Duplicate order
POST /orders/:id/duplicate
{
  tableId?: number; // Optional: change table
}

// Split order (for multiple tables)
POST /orders/:id/split
{
  tableIds: number[];
  itemsDistribution: Array<{
    tableId: number;
    itemIds: number[];
  }>;
}

// Merge orders (from same table)
POST /orders/merge
{
  orderIds: string[];
  notes?: string;
}

// Cancel order with reason
PATCH /orders/:id/cancel
{
  reason: string;
  refundAmount?: number;
}
```

### 6. Real-time & WebSocket Events
```typescript
// WebSocket events for real-time updates
{
  "order:created": Order;
  "order:updated": Order;
  "order:status_changed": { orderId: string; oldStatus: OrderStatus; newStatus: OrderStatus };
  "order:item_added": { orderId: string; item: OrderItem };
  "order:item_removed": { orderId: string; itemId: number };
  "order:payment_added": { orderId: string; payment: Payment };
}
```

### 7. Order Validation & Business Logic
```typescript
// Validate order before creation
POST /orders/validate
{
  tableId?: number;
  type: OrderType;
  items: CreateOrderItemInput[];
}
// Returns: { valid: boolean; errors: string[]; warnings: string[] }

// Check table availability
GET /orders/table-availability/:tableId?datetime=2024-01-01T12:00:00Z
// Returns: { available: boolean; nextAvailable?: string; currentOrders?: Order[] }
```

### 8. Order Export & Reporting
```typescript
// Export orders to CSV/PDF
GET /orders/export?format=csv&from=2024-01-01&to=2024-01-31&status=PAID,DELIVERED

// Generate receipt
GET /orders/:id/receipt?format=pdf
GET /orders/:id/receipt?format=html
```

## Database Schema Requirements

### Additional Tables/Fields Needed

### 1. Order Status History
```sql
CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  old_status VARCHAR(50) NOT NULL,
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255) NOT NULL, -- User ID
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### 2. Order Actions Log
```sql
CREATE TABLE order_actions_log (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'created', 'updated', 'cancelled', 'duplicated', etc.
  performed_by VARCHAR(255) NOT NULL,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSONB, -- Action-specific data
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### 3. Kitchen Metrics
```sql
CREATE TABLE kitchen_metrics (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  preparation_time_minutes INTEGER,
  status_received_at TIMESTAMP,
  status_ready_at TIMESTAMP,
  status_delivered_at TIMESTAMP,
  chef_id VARCHAR(255), -- User ID of chef
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## API Response Standards

### Success Responses
```typescript
// Standard success response
{
  success: true;
  data: T; // The actual data
  message?: string; // Optional success message
  pagination?: { // For list endpoints
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Error Responses
```typescript
// Standard error response
{
  success: false;
  error: {
    code: string; // Error code (e.g., 'VALIDATION_ERROR', 'NOT_FOUND')
    message: string; // Human-readable error message
    details?: any; // Additional error details
  };
}
```

## Authentication & Authorization

### Required Permissions
- `orders:read` - View orders
- `orders:create` - Create orders
- `orders:update` - Update orders
- `orders:delete` - Delete orders
- `orders:status` - Update order status
- `orders:kitchen` - Access kitchen view
- `orders:reports` - View order reports
- `orders:export` - Export orders

### Rate Limiting
- General endpoints: 100 requests/minute
- Export endpoints: 10 requests/minute
- Bulk operations: 20 requests/minute

## Performance Requirements

### Response Times
- List orders: < 500ms
- Get single order: < 200ms
- Create order: < 300ms
- Update status: < 100ms
- Search: < 300ms

### Caching Strategy
- Order list: 30 seconds cache
- Single order: 5 minutes cache
- Statistics: 1 hour cache
- Kitchen metrics: 15 minutes cache

## Testing Requirements

### Unit Tests
- All service functions
- Business logic validation
- Permission checks

### Integration Tests
- Complete order workflow
- Status transitions
- Payment processing

### Load Tests
- 100 concurrent order creation
- 500 order list requests
- Kitchen view performance

## Deployment Notes

### Environment Variables
```bash
# Order-specific settings
ORDER_TIMEOUT_MINUTES=30
MAX_ORDER_ITEMS=50
KITCHEN_PREPARATION_TIMEOUT_MINUTES=60
ENABLE_ORDER_EXPORT=true
```

### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
CREATE INDEX idx_orders_table_status ON orders(table_id, status);
CREATE INDEX idx_orders_waiter_created ON orders(waiter_id, created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
```

## Priority Implementation Order

### Phase 1 (High Priority)
1. Order items update endpoints
2. Kitchen status endpoints
3. Basic daily sales summary

### Phase 2 (Medium Priority)
1. Advanced search and filtering
2. Order actions (duplicate, split, merge)
3. Order validation endpoint

### Phase 3 (Low Priority)
1. Real-time WebSocket events
2. Export functionality
3. Advanced reporting and metrics

## Notes for Backend Team

1. **Data Consistency**: Ensure all order status changes are logged in the history table
2. **Business Rules**: Implement validation for order creation (table availability, item availability)
3. **Error Handling**: Provide detailed error messages for frontend validation
4. **Performance**: Use database indexes and caching for frequently accessed data
5. **Security**: Implement proper authorization checks for all endpoints
6. **Testing**: Include comprehensive test coverage for all business logic

## Frontend Integration Notes

The frontend expects:
- Consistent error response format
- Proper HTTP status codes
- Pagination metadata for list endpoints
- Real-time updates via WebSocket (when implemented)
- Detailed validation errors for form feedback