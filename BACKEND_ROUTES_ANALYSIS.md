# Análisis de Rutas del Backend vs Frontend

## 📊 Resumen Ejecutivo

Este documento analiza todas las rutas disponibles en el backend y compara con lo que está implementado en el frontend, identificando oportunidades de implementación.

---

## 🔐 AUTHENTICATION (`/api/v1/auth`)

### Backend Disponible:
- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/register` - Registro (movido a `/auth/register`)
- ✅ `POST /auth/logout` - Logout
- ✅ `POST /auth/refresh` - Refresh token
- ✅ `POST /auth/forgot-password` - Recuperar contraseña
- ✅ `POST /auth/reset-password` - Resetear contraseña

### Frontend Implementado:
- ✅ Login
- ✅ Register (usando `/auth/register`)
- ⚠️ Logout (implementado pero no usado)
- ❌ Refresh token (no implementado)
- ❌ Forgot password (no implementado)
- ❌ Reset password (no implementado)

**Prioridad:** Media - Funcionalidad básica funciona, pero falta recuperación de contraseña.

---

## 👥 USERS (`/api/v1/users`)

### Backend Disponible:
- ✅ `GET /users` - Lista paginada de usuarios
- ✅ `GET /users/:id` - Usuario por ID
- ✅ `GET /users/email/:email` - Usuario por email
- ✅ `POST /users/register` - Registro (deprecated, usar `/auth/register`)
- ✅ `PATCH /users/:id` - Actualizar usuario
- ✅ `GET /users/:id/roles-permissions` - Usuario con roles y permisos

### Frontend Implementado:
- ✅ Lista de usuarios (UsersPage)
- ✅ Ver usuario (UserEditPage)
- ✅ Crear usuario (UserCreatePage)
- ✅ Editar usuario (UserEditPage)
- ❌ Buscar por email (no implementado)
- ❌ Ver roles y permisos completos (parcialmente implementado)

**Prioridad:** Baja - Funcionalidad principal está completa.

---

## 🎭 ROLES (`/api/v1/roles`)

### Backend Disponible:
- ✅ `GET /roles` - Lista paginada de roles
- ✅ `GET /roles/search` - Buscar roles con filtros
- ✅ `POST /roles` - Crear rol
- ✅ `GET /roles/:id` - Rol por ID
- ✅ `PATCH /roles/:id` - Actualizar rol
- ✅ `DELETE /roles/:id` - Eliminar rol (soft delete)
- ✅ `DELETE /roles/bulk` - Eliminación masiva
- ✅ `GET /roles/:id/permissions` - Permisos de un rol
- ✅ `POST /roles/:id/permissions` - Asignar permisos a rol
- ✅ `DELETE /roles/:id/permissions` - Remover permisos de rol

### Frontend Implementado:
- ✅ Lista de roles (solo lectura en UserCreatePage/UserEditPage)
- ❌ CRUD completo de roles (no implementado)
- ❌ Gestión de permisos por rol (no implementado)
- ❌ Búsqueda de roles (no implementado)
- ❌ Eliminación masiva (no implementado)

**Prioridad:** Alta - Necesario para SuperAdmin. Falta UI completa.

---

## 🔑 PERMISSIONS (`/api/v1/permissions`)

### Backend Disponible:
- ✅ `GET /permissions` - Lista paginada de permisos
- ✅ `GET /permissions/search` - Buscar permisos
- ✅ `POST /permissions` - Crear permiso
- ✅ `GET /permissions/:id` - Permiso por ID
- ✅ `PATCH /permissions/:id` - Actualizar permiso
- ✅ `DELETE /permissions/:id` - Eliminar permiso
- ✅ `DELETE /permissions/bulk` - Eliminación masiva

### Frontend Implementado:
- ❌ Nada implementado

**Prioridad:** Alta - Necesario para SuperAdmin. Gestión completa de permisos.

---

## 🍽️ MENU - CATEGORIES (`/api/v1/menu/categories`)

### Backend Disponible:
- ✅ `GET /menu/categories` - Lista paginada
- ✅ `GET /menu/categories/search` - Buscar categorías
- ✅ `POST /menu/categories` - Crear categoría
- ✅ `GET /menu/categories/:id` - Categoría por ID
- ✅ `PATCH /menu/categories/:id` - Actualizar categoría
- ✅ `DELETE /menu/categories/:id` - Eliminar categoría
- ✅ `DELETE /menu/categories/bulk` - Eliminación masiva

### Frontend Implementado:
- ✅ Lista de categorías (MenuPage)
- ✅ Crear categoría (CategoryCreatePage)
- ✅ Editar categoría (CategoryEditPage)
- ✅ Eliminar categoría
- ❌ Búsqueda de categorías (no implementado)
- ❌ Eliminación masiva (no implementado)

**Prioridad:** Baja - Funcionalidad principal completa.

---

## 🍕 MENU - ITEMS (`/api/v1/menu/items`)

### Backend Disponible:
- ✅ `GET /menu/items` - Lista paginada
- ✅ `GET /menu/items/search` - Buscar items
- ✅ `POST /menu/items` - Crear item
- ✅ `GET /menu/items/:id` - Item por ID
- ✅ `POST /menu/items/stock/daily-reset` - Reset diario de stock
- ✅ `GET /menu/items/low-stock` - Items con stock bajo
- ✅ `GET /menu/items/out-of-stock` - Items sin stock
- ✅ `POST /menu/items/:id/stock/add` - Agregar stock
- ✅ `POST /menu/items/:id/stock/remove` - Remover stock
- ✅ `GET /menu/items/:id/stock/history` - Historial de stock
- ✅ `PATCH /menu/items/:id/inventory-type` - Configurar tipo de inventario

### Frontend Implementado:
- ✅ Lista de items (MenuPage)
- ✅ Crear item (MenuItemCreatePage)
- ✅ Editar item (MenuItemEditPage)
- ✅ Eliminar item
- ❌ Búsqueda de items (no implementado)
- ❌ Gestión de stock (no implementado)
- ❌ Alertas de stock bajo/sin stock (no implementado)
- ❌ Historial de stock (no implementado)
- ❌ Reset diario de stock (no implementado)

**Prioridad:** Alta - Gestión de stock es crítica para restaurantes.

---

## 🪑 TABLES (`/api/v1/tables`)

### Backend Disponible:
- ✅ `GET /tables` - Lista paginada
- ✅ `GET /tables/:id` - Mesa por ID
- ✅ `POST /tables` - Crear mesa
- ✅ `PATCH /tables/:id` - Actualizar mesa
- ✅ `DELETE /tables/:id` - Eliminar mesa
- ✅ `PATCH /tables/:id/status` - Actualizar estado de mesa

### Frontend Implementado:
- ✅ Lista de mesas (TablesPage)
- ✅ Crear mesa (TableCreatePage)
- ✅ Editar mesa (TableManagePage)
- ✅ Eliminar mesa
- ✅ Actualizar estado de mesa

**Prioridad:** ✅ Completo - Todo implementado.

---

## 📋 ORDERS (`/api/v1/orders`)

### Backend Disponible:
- ✅ `GET /orders` - Lista paginada con filtros
- ✅ `GET /orders/:id` - Pedido por ID
- ✅ `POST /orders` - Crear pedido
- ✅ `PATCH /orders/:id/status` - Actualizar estado
- ✅ `DELETE /orders/:id` - Cancelar pedido

### Frontend Implementado:
- ✅ Lista de pedidos (OrdersPage)
- ✅ Ver detalle (OrderDetailPage)
- ✅ Crear pedido (OrderCreatePage)
- ✅ Actualizar estado (OrderDetailPage, KitchenOrdersPage)
- ✅ Cancelar pedido (OrderDetailPage)
- ❌ Filtros avanzados (parcialmente implementado)

**Prioridad:** Media - Funcionalidad principal completa, falta mejorar filtros.

---

## 👤 PROFILES (`/api/v1/profile`)

### Backend Disponible:
- ✅ `GET /profile` - Lista paginada de perfiles
- ✅ `GET /profile/me` - Perfil del usuario autenticado
- ✅ `GET /profile/:id` - Perfil por ID
- ✅ `PATCH /profile/:id` - Actualizar perfil

### Frontend Implementado:
- ✅ Ver/editar perfil propio (ProfilePage)
- ❌ Lista de perfiles (no implementado - probablemente no necesario)
- ❌ Ver perfil de otros (no implementado - probablemente no necesario)

**Prioridad:** Baja - Funcionalidad principal completa.

---

## 📊 PLAN DE IMPLEMENTACIÓN PRIORIZADO

### 🔴 ALTA PRIORIDAD

#### 1. Gestión de Stock de Items (Menu Items)
**Impacto:** Crítico para operaciones del restaurante
**Endpoints a implementar:**
- `GET /menu/items/low-stock` - Alertas de stock bajo
- `GET /menu/items/out-of-stock` - Items sin stock
- `POST /menu/items/:id/stock/add` - Agregar stock
- `POST /menu/items/:id/stock/remove` - Remover stock
- `GET /menu/items/:id/stock/history` - Historial de stock
- `POST /menu/items/stock/daily-reset` - Reset diario

**Tareas:**
- [ ] Crear página de gestión de stock
- [ ] Agregar alertas de stock bajo en MenuPage
- [ ] Implementar modal/form para agregar/remover stock
- [ ] Crear componente de historial de stock
- [ ] Agregar botón de reset diario (solo Admin)

#### 2. Gestión Completa de Roles (SuperAdmin)
**Impacto:** Necesario para administración completa
**Endpoints a implementar:**
- CRUD completo de roles
- Gestión de permisos por rol
- Búsqueda de roles

**Tareas:**
- [ ] Crear RolesPage (lista de roles)
- [ ] Crear RoleCreatePage
- [ ] Crear RoleEditPage
- [ ] Crear componente de asignación de permisos
- [ ] Agregar búsqueda y filtros

#### 3. Gestión de Permisos (SuperAdmin)
**Impacto:** Necesario para administración completa
**Endpoints a implementar:**
- CRUD completo de permisos
- Búsqueda de permisos

**Tareas:**
- [ ] Crear PermissionsPage (lista de permisos)
- [ ] Crear PermissionCreatePage
- [ ] Crear PermissionEditPage
- [ ] Agregar búsqueda y filtros

### 🟡 MEDIA PRIORIDAD

#### 4. Búsqueda en Menú
**Impacto:** Mejora UX para encontrar items/categorías rápido
**Endpoints:**
- `GET /menu/items/search`
- `GET /menu/categories/search`

**Tareas:**
- [ ] Agregar barra de búsqueda en MenuPage
- [ ] Implementar búsqueda en tiempo real
- [ ] Agregar filtros avanzados

#### 5. Recuperación de Contraseña
**Impacto:** Mejora UX y seguridad
**Endpoints:**
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

**Tareas:**
- [ ] Crear ForgotPasswordPage
- [ ] Crear ResetPasswordPage
- [ ] Agregar link en LoginPage

#### 6. Filtros Avanzados en Orders
**Impacto:** Mejora para gestión de pedidos
**Endpoints:**
- Ya disponible en `GET /orders` con query params

**Tareas:**
- [ ] Mejorar OrderFilters component
- [ ] Agregar filtros por fecha, mesa, mesero, etc.
- [ ] Agregar ordenamiento

### 🟢 BAJA PRIORIDAD

#### 7. Refresh Token Automático
**Impacto:** Mejora seguridad y UX
**Tareas:**
- [ ] Implementar refresh token automático
- [ ] Manejar expiración de tokens

#### 8. Eliminación Masiva
**Impacto:** Mejora eficiencia para operaciones bulk
**Endpoints:**
- `DELETE /menu/categories/bulk`
- `DELETE /roles/bulk`
- `DELETE /permissions/bulk`

**Tareas:**
- [ ] Agregar selección múltiple en listas
- [ ] Implementar acciones bulk

---

## 📝 NOTAS ADICIONALES

### Endpoints No Documentados pero Probablemente Disponibles:
- Verificar si hay endpoints de estadísticas/reportes
- Verificar si hay endpoints de exportación de datos
- Verificar si hay endpoints de configuración del sistema

### Mejoras de UX Sugeridas:
- Agregar búsqueda en todas las listas principales
- Implementar paginación mejorada con tamaño de página configurable
- Agregar ordenamiento en todas las tablas
- Implementar exportación a CSV/Excel para reportes

---

## 🎯 RECOMENDACIÓN INMEDIATA

**Empezar con:** Gestión de Stock de Items
- Es crítico para operaciones
- Tiene múltiples endpoints relacionados
- Mejora significativamente la funcionalidad del sistema
- Puede implementarse en módulos independientes
