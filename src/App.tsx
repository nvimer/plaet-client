import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth, useMobileDetection } from "@/hooks";
import { useInitializeAuth } from "@/stores/useAuthStore";
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
import { CustomersPage } from "./features/customers/pages/CustomersPage";
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
  useInitializeAuth();
  useMobileDetection();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <NetworkStatusManager>
          <Routes>
            {/* =============== PUBLIC ROUTES =============== */}
            {/* Landing Page */}
            <Route
              path={ROUTES.HOME}
              element={
                isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} /> : <LandingPage />
              }
            />
            {/* Public Route: Login */}
            <Route
              path={ROUTES.LOGIN}
              element={
                isAuthenticated ? (
                  <Navigate to={ROUTES.DASHBOARD} replace />
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
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            
            {/* Public Route: Reset Password */}
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            {/* Public Route: Verify Email */}
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
            {/* Public Route: Account Lockout */}
            <Route path={ROUTES.LOCKOUT} element={<AccountLockoutPage />} />
            
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN, RoleName.CASHIER]}>
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
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
                    allowedRoles={[RoleName.ADMIN, RoleName.CASHIER, RoleName.SUPERADMIN]}
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.WAITER]}>
                    <TablesHubPage />
                  </RoleProtectedRoute>
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}>
                    <MenuHubPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.MENU_LIST}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}>
                    <MenuPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Orders - List */}
            <Route
              path={ROUTES.ORDERS}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.WAITER, RoleName.CASHIER]}>
                    <OrdersHubPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.ORDERS_LIST}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.WAITER, RoleName.CASHIER]}>
                    <OrdersPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Orders - Create (Sidebar Layout) */}
            <Route
              path={ROUTES.ORDER_CREATE}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.WAITER, RoleName.CASHIER]}>
                    <OrderCreatePage />
                  </RoleProtectedRoute>
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.WAITER]}>
                    <OrderEditPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Kitchen - Orders View (Full Screen, Kitchen Manager & Admin only) */}
            <Route
              path={ROUTES.KITCHEN}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.KITCHEN_MANAGER, RoleName.ADMIN, RoleName.WAITER]}
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <TableCreatePage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Tables - Manage (Sidebar Layout) */}
            <Route
              path={ROUTES.TABLE_MANAGE}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <TableManagePage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Menu - Category Create (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_CATEGORY_CREATE}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <CategoryCreatePage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Menu - Category Edit (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_CATEGORY_EDIT}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <CategoryEditPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Menu - Item Create (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_ITEM_CREATE}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}>
                    <MenuItemCreatePage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Menu - Item Edit (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_ITEM_EDIT}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}>
                    <MenuItemEditPage />
                  </RoleProtectedRoute>
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}>
                    <DailyMenuHubPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.DAILY_MENU_HISTORY}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}>
                    <DailyMenuHistoryPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.DAILY_MENU_SETUP}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <DailyMenuPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Users module */}
            <Route
              path={ROUTES.USERS}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
                    <UsersHubPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.USERS_LIST}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
                    <UsersPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.CUSTOMERS}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.CASHIER]}>
                    <CustomersPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Users - Create (Admin only) */}
            <Route
              path={ROUTES.USER_CREATE}
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
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
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.SUPERADMIN]}>
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
                <Navigate to={isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN} replace />
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
