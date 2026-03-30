import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth, useMobileDetection } from "@/hooks";
import { useInitializeAuth } from "@/stores/useAuthStore";
import { ProtectedRoute, RoleProtectedRoute, ErrorBoundary, NetworkStatusManager, PageLoader } from "./components";
import { RoleName } from "./types";
import { ROUTES } from "./app/routes";

// =============== LAZY LOADED FEATURES ===============

// Auth Feature
const LoginPage = lazy(() => import("./features/auth").then(m => ({ default: m.LoginPage })));
const RegisterForm = lazy(() => import("./features/auth").then(m => ({ default: m.RegisterForm })));
const ForgotPasswordPage = lazy(() => import("./features/auth").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("./features/auth").then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import("./features/auth").then(m => ({ default: m.VerifyEmailPage })));
const AccountLockoutPage = lazy(() => import("./features/auth").then(m => ({ default: m.AccountLockoutPage })));
const ChangePasswordPage = lazy(() => import("./features/auth").then(m => ({ default: m.ChangePasswordPage })));

// Dashboard & Core
const DashboardPage = lazy(() => import("./features/dashboard/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

// Tables Feature
const TablesPage = lazy(() => import("./features/tables").then(m => ({ default: m.TablesPage })));
const TablesHubPage = lazy(() => import("./features/tables").then(m => ({ default: m.TablesHubPage })));
const TableCreatePage = lazy(() => import("./features/tables/pages/TableCreatePage").then(m => ({ default: m.TableCreatePage })));
const TableManagePage = lazy(() => import("./features/tables/pages/TableManagePage").then(m => ({ default: m.TableManagePage })));

// Landing Pages
const LandingPage = lazy(() => import("./features/landing/pages").then(m => ({ default: m.LandingPage })));
const PrivacyPage = lazy(() => import("./features/landing/pages").then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./features/landing/pages").then(m => ({ default: m.TermsPage })));

// Menu Feature
const MenuPage = lazy(() => import("./features/menu").then(m => ({ default: m.MenuPage })));
const MenuHubPage = lazy(() => import("./features/menu").then(m => ({ default: m.MenuHubPage })));
const CategoryCreatePage = lazy(() => import("./features/menu/categories/pages/CategoryCreatePage").then(m => ({ default: m.CategoryCreatePage })));
const CategoryEditPage = lazy(() => import("./features/menu/categories/pages/CategoryEditPage").then(m => ({ default: m.CategoryEditPage })));
const MenuItemCreatePage = lazy(() => import("./features/menu/items/pages/MenuItemCreatePage").then(m => ({ default: m.MenuItemCreatePage })));
const MenuItemEditPage = lazy(() => import("./features/menu/items/pages/MenuItemEditPage").then(m => ({ default: m.MenuItemEditPage })));

// Inventory Feature
const StockManagementPage = lazy(() => import("./features/inventory").then(m => ({ default: m.StockManagementPage })));
const InventoryHubPage = lazy(() => import("./features/inventory").then(m => ({ default: m.InventoryHubPage })));
const InventoryHistoryPage = lazy(() => import("./features/inventory").then(m => ({ default: m.InventoryHistoryPage })));

// Daily Menu Feature
const DailyMenuPage = lazy(() => import("./features/daily-menu").then(m => ({ default: m.DailyMenuPage })));
const DailyMenuHubPage = lazy(() => import("./features/daily-menu").then(m => ({ default: m.DailyMenuHubPage })));
const DailyMenuHistoryPage = lazy(() => import("./features/daily-menu").then(m => ({ default: m.DailyMenuHistoryPage })));

// Orders Feature
const OrdersPage = lazy(() => import("./features/orders").then(m => ({ default: m.OrdersPage })));
const OrdersHubPage = lazy(() => import("./features/orders").then(m => ({ default: m.OrdersHubPage })));
const OrderCreatePage = lazy(() => import("./features/orders/pages/OrderCreatePage").then(m => ({ default: m.OrderCreatePage })));
const OrderDetailPage = lazy(() => import("./features/orders/pages/OrderDetailPage").then(m => ({ default: m.OrderDetailPage })));
const OrderEditPage = lazy(() => import("./features/orders/pages/OrderEditPage").then(m => ({ default: m.OrderEditPage })));
const KitchenOrdersPage = lazy(() => import("./features/orders/pages/KitchenOrdersPage").then(m => ({ default: m.KitchenOrdersPage })));

// Customers Feature
const CustomersHubPage = lazy(() => import("./features/customers/pages").then(m => ({ default: m.CustomersHubPage })));
const CustomersPage = lazy(() => import("./features/customers/pages").then(m => ({ default: m.CustomersPage })));

// Users & Profile Feature
const UsersPage = lazy(() => import("./features/users/pages").then(m => ({ default: m.UsersPage })));
const UsersHubPage = lazy(() => import("./features/users/pages").then(m => ({ default: m.UsersHubPage })));
const UserCreatePage = lazy(() => import("./features/users/pages").then(m => ({ default: m.UserCreatePage })));
const UserEditPage = lazy(() => import("./features/users/pages").then(m => ({ default: m.UserEditPage })));
const ProfilePage = lazy(() => import("./features/users/pages").then(m => ({ default: m.ProfilePage })));

// Restaurants Feature
const RestaurantsPage = lazy(() => import("./features/restaurants").then(m => ({ default: m.RestaurantsPage })));

// Permissions & Analytics
const RolePermissionsPage = lazy(() => import("./features/permissions").then(m => ({ default: m.RolePermissionsPage })));
const RolesListPage = lazy(() => import("./features/permissions").then(m => ({ default: m.RolesListPage })));
const RoleCreatePage = lazy(() => import("./features/permissions").then(m => ({ default: m.RoleCreatePage })));
const RoleEditPage = lazy(() => import("./features/permissions").then(m => ({ default: m.RoleEditPage })));
const AdminDashboardPage = lazy(() => import("./features/analytics/pages/AdminDashboardPage").then(m => ({ default: m.AdminDashboardPage })));
const AdminHubPage = lazy(() => import("./features/analytics/pages/AdminHubPage").then(m => ({ default: m.AdminHubPage })));

// Cash & Expenses
const CashClosurePage = lazy(() => import("./features/cash-closure/pages/CashClosurePage").then(m => ({ default: m.CashClosurePage })));
const ExpensesPage = lazy(() => import("./features/expenses/pages/ExpensesPage").then(m => ({ default: m.ExpensesPage })));

// Layouts
const FullScreenLayout = lazy(() => import("./layouts/FullScreenLayout").then(m => ({ default: m.FullScreenLayout })));

const App = () => {
  useInitializeAuth();
  useMobileDetection();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <NetworkStatusManager>
          <Suspense fallback={<PageLoader />}>
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
                      <CustomersHubPage />
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path={ROUTES.CUSTOMERS_LIST}
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
          </Suspense>
        </NetworkStatusManager>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
