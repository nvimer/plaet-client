import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks";
import {
  LoginPage,
  RegisterForm,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  AccountLockoutPage,
  ChangePasswordPage,
} from "./features/auth";
import { ProtectedRoute } from "./components";
import { FullScreenLayout } from "./layouts/FullScreenLayout";
import { ErrorBoundary } from "./components";
import { NetworkStatusManager } from "./components";
import ErrorPage from "./pages/ErrorPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { TablesPage, TablesHubPage } from "./features/tables";
import { LandingPage, PrivacyPage, TermsPage } from "./features/landing/pages";
import { 
  MenuPage, 
  MenuHubPage,
} from "./features/menu";
import {
  StockManagementPage, 
  InventoryHubPage,
  InventoryHistoryPage,
} from "./features/inventory";
import {
  DailyMenuPage,
  DailyMenuHubPage,
  DailyMenuHistoryPage
} from "./features/daily-menu";
import { OrdersPage, OrdersHubPage } from "./features/orders";
import { OrderCreatePage } from "./features/orders/pages/OrderCreatePage";
import { OrderDetailPage } from "./features/orders/pages/OrderDetailPage";
import { OrderEditPage } from "./features/orders/pages/OrderEditPage";
import { KitchenOrdersPage } from "./features/orders/pages/KitchenOrdersPage";
import { TableCreatePage } from "./features/tables/pages/TableCreatePage";
import { TableManagePage } from "./features/tables/pages/TableManagePage";
import { CategoryCreatePage } from "./features/menu/categories/pages/CategoryCreatePage";
import { CategoryEditPage } from "./features/menu/categories/pages/CategoryEditPage";
import { MenuItemCreatePage } from "./features/menu/items/pages/MenuItemCreatePage";
import { MenuItemEditPage } from "./features/menu/items/pages/MenuItemEditPage";
import {
  UsersPage,
  UsersHubPage,
  UserCreatePage,
  UserEditPage,
  ProfilePage,
} from "./features/users/pages";
import { RestaurantsPage } from "./features/restaurants";
import {
  RolePermissionsPage,
  RolesListPage,
  RoleCreatePage,
  RoleEditPage,
} from "./features/permissions";
import { AdminDashboardPage } from "./features/analytics/pages/AdminDashboardPage";
import { AdminHubPage } from "./features/analytics/pages/AdminHubPage";
import { CashClosurePage } from "./features/cash-closure/pages/CashClosurePage";
import { ExpensesPage } from "./features/expenses/pages/ExpensesPage";
import { RoleProtectedRoute } from "./components";
import { RoleName } from "./types";
import { ROUTES } from "./app/routes";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <NetworkStatusManager>
          <Routes>
            {/* =============== PUBLIC ROUTES =============== */}
            {/* Landing Page */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
              }
            />
            {/* Public Route: Login */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            {/* Protected Route: Register (Admin Only) */}
            <Route
              path="/register"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <RegisterForm />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />
            {/* Public Route: Forgot Password */}
            <Route
              path="/forgot-password"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ForgotPasswordPage />
                )
              }
            />
            {/* Public Route: Reset Password */}
            <Route
              path="/reset-password"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ResetPasswordPage />
                )
              }
            />
            {/* Public Route: Verify Email */}
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            {/* Public Route: Account Lockout */}
            <Route path="/lockout" element={<AccountLockoutPage />} />
            
            {/* Public Route: Privacy Policy */}
            <Route path="/privacy" element={<PrivacyPage />} />
            
            {/* Public Route: Terms & Conditions */}
            <Route path="/terms" element={<TermsPage />} />

            {/* ============= PROTECTED ROUTES ============== */}
            {/* Dashboard (Home) */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            
            {/* Admin Hub */}
            <Route
              path={ROUTES.ADMIN}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <AdminHubPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin - Dashboard/Analytics (Admin only) */}
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <AdminDashboardPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* SuperAdmin - Restaurants Management */}
            <Route
              path={ROUTES.RESTAURANTS}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.SUPERADMIN]}>
                    <RestaurantsPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin+ - Roles & Permissions Management */}
            <Route
              path={ROUTES.PERMISSIONS}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
                    <RolePermissionsPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin+ - Roles List */}
            <Route
              path={ROUTES.ROLES}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
                    <RolesListPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin+ - Create Role */}
            <Route
              path={ROUTES.ROLE_CREATE}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
                    <RoleCreatePage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin+ - Edit Role */}
            <Route
              path={ROUTES.ROLE_EDIT}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
                    <RoleEditPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin - Cash Closure (Admin and Cashier) */}
            <Route
              path={ROUTES.CASH_CLOSURE}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.ADMIN, RoleName.CASHIER]}
                  >
                    <CashClosurePage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin - Expenses (Admin only) */}
            <Route
              path={ROUTES.EXPENSES}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <ExpensesPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Tables module */}
            <Route
              path={ROUTES.TABLES}
              element={
                <ProtectedRoute>
                  <TablesHubPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.TABLES_MAP}
              element={
                <ProtectedRoute>
                  <TablesPage />
                </ProtectedRoute>
              }
            />

            {/* Menu module */}
            <Route
              path={ROUTES.MENU}
              element={
                <ProtectedRoute>
                  <MenuHubPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.MENU_LIST}
              element={
                <ProtectedRoute>
                  <MenuPage />
                </ProtectedRoute>
              }
            />

            {/* Orders - List */}
            <Route
              path={ROUTES.ORDERS}
              element={
                <ProtectedRoute>
                  <OrdersHubPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.ORDERS_LIST}
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            {/* Orders - Create (Sidebar Layout) */}
            <Route
              path={ROUTES.ORDER_CREATE}
              element={
                <ProtectedRoute>
                  <OrderCreatePage />
                </ProtectedRoute>
              }
            />

            {/* Orders - Detail (Sidebar Layout) */}
            <Route
              path={ROUTES.ORDER_DETAIL}
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Orders - Edit (Sidebar Layout) */}
            <Route
              path={ROUTES.ORDER_EDIT}
              element={
                <ProtectedRoute>
                  <OrderEditPage />
                </ProtectedRoute>
              }
            />

            {/* Kitchen - Orders View (Full Screen, Kitchen Manager & Admin only) */}
            <Route
              path={ROUTES.KITCHEN}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.KITCHEN_MANAGER, RoleName.ADMIN]}
                  >
                    <FullScreenLayout>
                      <KitchenOrdersPage />
                    </FullScreenLayout>
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Tables - Create (Sidebar Layout) */}
            <Route
              path={ROUTES.TABLE_CREATE}
              element={
                <ProtectedRoute>
                  <TableCreatePage />
                </ProtectedRoute>
              }
            />

            {/* Tables - Manage (Sidebar Layout) */}
            <Route
              path={ROUTES.TABLE_MANAGE}
              element={
                <ProtectedRoute>
                  <TableManagePage />
                </ProtectedRoute>
              }
            />

            {/* Menu - Category Create (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_CATEGORY_CREATE}
              element={
                <ProtectedRoute>
                  <CategoryCreatePage />
                </ProtectedRoute>
              }
            />

            {/* Menu - Category Edit (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_CATEGORY_EDIT}
              element={
                <ProtectedRoute>
                  <CategoryEditPage />
                </ProtectedRoute>
              }
            />

            {/* Menu - Item Create (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_ITEM_CREATE}
              element={
                <ProtectedRoute>
                  <MenuItemCreatePage />
                </ProtectedRoute>
              }
            />

            {/* Menu - Item Edit (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_ITEM_EDIT}
              element={
                <ProtectedRoute>
                  <MenuItemEditPage />
                </ProtectedRoute>
              }
            />

            {/* Menu - Stock Management (Hub + List) */}
            <Route
              path={ROUTES.INVENTORY}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}
                  >
                    <InventoryHubPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.STOCK_MANAGEMENT}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}
                  >
                    <StockManagementPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.INVENTORY_HISTORY}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}
                  >
                    <InventoryHistoryPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Menu - Daily Menu Configuration (Hub + Setup) */}
            <Route
              path={ROUTES.DAILY_MENU}
              element={
                <ProtectedRoute>
                  <DailyMenuHubPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.DAILY_MENU_HISTORY}
              element={
                <ProtectedRoute>
                  <DailyMenuHistoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.DAILY_MENU_SETUP}
              element={
                <ProtectedRoute>
                  <DailyMenuPage />
                </ProtectedRoute>
              }
            />

            {/* Users module */}
            <Route
              path={ROUTES.USERS}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <UsersHubPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.USERS_LIST}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <UsersPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Users - Create (Admin only) */}
            <Route
              path={ROUTES.USER_CREATE}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <UserCreatePage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Users - Edit (Admin only) */}
            <Route
              path={ROUTES.USER_EDIT}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <UserEditPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Profile - Own profile */}
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Change Password (All authenticated users) */}
            <Route
              path={ROUTES.CHANGE_PASSWORD}
              element={
                <ProtectedRoute>
                  <FullScreenLayout>
                    <ChangePasswordPage />
                  </FullScreenLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback: Redirect to home or login*/}
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/" : "/login"} replace />
              }
            />
            {/* Error Page */}
            <Route path={ROUTES.ERROR} element={<ErrorPage />} />
          </Routes>
        </NetworkStatusManager>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
