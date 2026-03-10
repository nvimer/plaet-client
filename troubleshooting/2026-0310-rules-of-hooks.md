# Error: React Hooks Rules of Hooks

## 📋 Información General

- **ID:** 2026-0310-rules-of-hooks
- **Fecha:** 2026-03-10
- **Descripción:** Error de lint `react-hooks/rules-of-hooks` en DashboardPage.tsx
- **Severidad:** MEDIA - No rompe el build pero es un anti-pattern

---

## 🔍 Descripción del Problema

Los hooks de React (`useTables`, `useOrders`, `useMemo`) son llamados después de un **early return**, lo cual viola las reglas de hooks de React.

### Regla violada:
> "React Hooks must be called in the exact same order in every component render"

### Código problemático:

```tsx
// DashboardPage.tsx - Líneas 48-120

export function DashboardPage() {
  const { user } = useAuth();
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();

  // ❌ PROBLEMA: Early return ANTES de los hooks
  if (isSuperAdmin()) {
    return (
      <SidebarLayout hideTitle fullWidth>
        {/* SuperAdmin UI */}
      </SidebarLayout>
    );
  }

  // ❌ ERROR: Estos hooks se llaman en diferente orden cuando es SuperAdmin
  const { data: tablesData } = useTables();           // Línea 106
  const tables = tablesData?.tables;

  const { data: todayOrders } = useOrders(getTodayFilter());  // Línea 115
  
  const activeTables = useMemo(() => ..., []);         // Línea 120
  const pendingOrders = useMemo(() => ..., []);       // Línea 131
}
```

---

## 🌳 Por qué es un Problema

### 1. **Inconsistencia en el orden de renderizado**
- Cuando `isSuperAdmin()` retorna `true`: no se llaman hooks
- Cuando `isSuperAdmin()` retorna `false`: se llaman los hooks
- React pierde la capacidad de comparar estados correctamente

### 2. **Memory leaks potenciales**
- Los hooks pueden no limpiarse correctamente
- Estados pueden persistir entre renders

### 3. **Violación de principios SOLID**
- **S** (Single Responsibility): El componente hace dos cosas diferentes
- **O** (Open/Closed): Difícil de extender sin modificar

---

## ✅ Solución Propuesta

### Opción A: Mover hooks ANTES del early return (Recomendado)

```tsx
export function DashboardPage() {
  const { user } = useAuth();
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();

  // ✅ SIEMPRE llamar hooks primero (mismo orden siempre)
  const { data: tablesData } = useTables();
  const { data: todayOrders } = useOrders(getTodayFilter());

  // ✅ Luego lógica condicional
  if (isSuperAdmin()) {
    return <SuperAdminView />;
  }

  // Render normal
  const tables = tablesData?.tables;
  return <RegularDashboard tables={tables} orders={todayOrders} />;
}
```

### Opción B: Extraer a componentes separados

```tsx
// Opción más limpia:拆分 componentes
function SuperAdminDashboard() {
  return <SidebarLayout>...</SidebarLayout>;
}

function RegularDashboard() {
  const { data: tablesData } = useTables();
  const { data: todayOrders } = useOrders(...);
  return <DashboardContent tables={tablesData} orders={todayOrders} />;
}

export function DashboardPage() {
  const { isSuperAdmin } = usePermissions();
  
  // ✅ Un solo punto de decisión
  return isSuperAdmin() 
    ? <SuperAdminDashboard /> 
    : <RegularDashboard />;
}
```

---

## 📈 Impacto en Big-O

| Aspecto | Antes | Después |
|---------|-------|---------|
| Complejidad cognitiva | O(n) - múltiples puntos de retorno | O(1) - flujo lineal |
| Maintainability | Difícil testing | Fácil testing |
| Render consistency | Inconsistente | Consistente |

---

## 🎯 Recomendación

Se recomienda implementar **Opción B** (extraer componentes) ya que:
1. Mejora la separación de responsabilidades
2. Facilita el testing unitario
3. Permite lazy loading para SuperAdmin
4. Es más escalable para futuras características

---

## 📝 Tareas para Fix

- [ ] Mover hooks antes del early return O
- [ ] Extraer SuperAdminDashboard y RegularDashboard
- [ ] Verificar que los tests existentes sigan pasando
- [ ] Agregar tests para nuevos componentes

---

*Documento generado: 2026-03-10*
*Pertenece a: PLAN-LIMPIEZA.md - FASE 2*
