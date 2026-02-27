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
import { PrivateRoute } from "./components/PrivateRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { FullScreenLayout } from "./layouts/FullScreenLayout";
import { ErrorBoundary } from "./components/GlobalErrorBoundary";
import NetworkStatusManager from "./components/NetworkStatusManager";
import ErrorPage from "./pages/ErrorPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { TablesPage, TablesHubPage } from "./features/tables";
import { LandingPage, PrivacyPage, TermsPage } from "./features/landing/pages";
import { 
  MenuPage, 
  StockManagementPage, 
  InventoryHubPage,
  DailyMenuPage,
  DailyMenuHubPage
} from "./features/menu";
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
import { RolePermissionsPage } from "./features/permissions";
import { AdminDashboardPage } from "./features/analytics/pages/AdminDashboardPage";
import { CashClosurePage } from "./features/cash-closure/pages/CashClosurePage";
import { ExpensesPage } from "./features/expenses/pages/ExpensesPage";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
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
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <RegisterForm />
                  </RoleProtectedRoute>
                </PrivateRoute>
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
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* Admin - Dashboard/Analytics (Admin only) */}
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <AdminDashboardPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* SuperAdmin - Restaurants Management */}
            <Route
              path={ROUTES.RESTAURANTS}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.SUPERADMIN]}>
                    <RestaurantsPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* SuperAdmin - Roles & Permissions Management */}
            <Route
              path={ROUTES.PERMISSIONS}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.SUPERADMIN]}>
                    <RolePermissionsPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* Admin - Cash Closure (Admin and Cashier) */}
            <Route
              path={ROUTES.CASH_CLOSURE}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.ADMIN, RoleName.CASHIER]}
                  >
                    <CashClosurePage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* Admin - Expenses (Admin only) */}
            <Route
              path={ROUTES.EXPENSES}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <ExpensesPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* Tables module */}
            <Route
              path={ROUTES.TABLES}
              element={
                <PrivateRoute>
                  <TablesHubPage />
                </PrivateRoute>
              }
            />

            <Route
              path={ROUTES.TABLES_MAP}
              element={
                <PrivateRoute>
                  <TablesPage />
                </PrivateRoute>
              }
            />

            {/* Menu module */}
            <Route
              path={ROUTES.MENU}
              element={
                <PrivateRoute>
                  <MenuPage />
                </PrivateRoute>
              }
            />

            {/* Orders - List */}
            <Route
              path={ROUTES.ORDERS}
              element={
                <PrivateRoute>
                  <OrdersHubPage />
                </PrivateRoute>
              }
            />

            <Route
              path={ROUTES.ORDERS_LIST}
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />

            {/* Orders - Create (Sidebar Layout) */}
            <Route
              path={ROUTES.ORDER_CREATE}
              element={
                <PrivateRoute>
                  <OrderCreatePage />
                </PrivateRoute>
              }
            />

            {/* Orders - Detail (Sidebar Layout) */}
            <Route
              path={ROUTES.ORDER_DETAIL}
              element={
                <PrivateRoute>
                  <OrderDetailPage />
                </PrivateRoute>
              }
            />

            {/* Orders - Edit (Sidebar Layout) */}
            <Route
              path={ROUTES.ORDER_EDIT}
              element={
                <PrivateRoute>
                  <OrderEditPage />
                </PrivateRoute>
              }
            />

            {/* Kitchen - Orders View (Full Screen, Kitchen Manager & Admin only) */}
            <Route
              path={ROUTES.KITCHEN}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.KITCHEN_MANAGER, RoleName.ADMIN]}
                  >
                    <FullScreenLayout>
                      <KitchenOrdersPage />
                    </FullScreenLayout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* Tables - Create (Sidebar Layout) */}
            <Route
              path={ROUTES.TABLE_CREATE}
              element={
                <PrivateRoute>
                  <TableCreatePage />
                </PrivateRoute>
              }
            />

            {/* Tables - Manage (Sidebar Layout) */}
            <Route
              path={ROUTES.TABLE_MANAGE}
              element={
                <PrivateRoute>
                  <TableManagePage />
                </PrivateRoute>
              }
            />

            {/* Menu - Category Create (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_CATEGORY_CREATE}
              element={
                <PrivateRoute>
                  <CategoryCreatePage />
                </PrivateRoute>
              }
            />

            {/* Menu - Category Edit (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_CATEGORY_EDIT}
              element={
                <PrivateRoute>
                  <CategoryEditPage />
                </PrivateRoute>
              }
            />

            {/* Menu - Item Create (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_ITEM_CREATE}
              element={
                <PrivateRoute>
                  <MenuItemCreatePage />
                </PrivateRoute>
              }
            />

            {/* Menu - Item Edit (Sidebar Layout) */}
            <Route
              path={ROUTES.MENU_ITEM_EDIT}
              element={
                <PrivateRoute>
                  <MenuItemEditPage />
                </PrivateRoute>
              }
            />

            {/* Menu - Stock Management (Hub + List) */}
            <Route
              path={ROUTES.INVENTORY}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}
                  >
                    <InventoryHubPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            <Route
              path={ROUTES.STOCK_MANAGEMENT}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute
                    allowedRoles={[RoleName.ADMIN, RoleName.KITCHEN_MANAGER]}
                  >
                    <StockManagementPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* Menu - Daily Menu Configuration (Hub + Setup) */}
            <Route
              path={ROUTES.DAILY_MENU}
              element={
                <PrivateRoute>
                  <DailyMenuHubPage />
                </PrivateRoute>
              }
            />

            <Route
              path={ROUTES.DAILY_MENU_SETUP}
              element={
                <PrivateRoute>
                  <DailyMenuPage />
                </PrivateRoute>
              }
            />

            {/* Users module */}
            <Route
              path={ROUTES.USERS}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <UsersHubPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            <Route
              path={ROUTES.USERS_LIST}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <UsersPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* Users - Create (Admin only) */}
            <Route
              path={ROUTES.USER_CREATE}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <UserCreatePage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* Users - Edit (Admin only) */}
            <Route
              path={ROUTES.USER_EDIT}
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                    <UserEditPage />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            {/* Profile - Own profile */}
            <Route
              path={ROUTES.PROFILE}
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            {/* Change Password (All authenticated users) */}
            <Route
              path={ROUTES.CHANGE_PASSWORD}
              element={
                <PrivateRoute>
                  <FullScreenLayout>
                    <ChangePasswordPage />
                  </FullScreenLayout>
                </PrivateRoute>
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
