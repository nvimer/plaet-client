import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks";
import LoginPage from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { FullScreenLayout } from "./layouts/FullScreenLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { TablesPage } from "./features/tables";
import { LandingPage } from "./pages";
import { MenuPage } from "./features/menu";
import { OrdersPage } from "./features/orders";
import { OrderCreatePage } from "./features/orders/pages/OrderCreatePage";
import { OrderDetailPage } from "./features/orders/pages/OrderDetailPage";
import { TableCreatePage } from "./features/tables/pages/TableCreatePage";
import { TableManagePage } from "./features/tables/pages/TableManagePage";
import { CategoryCreatePage } from "./features/menu/categories/pages/CategoryCreatePage";
import { CategoryEditPage } from "./features/menu/categories/pages/CategoryEditPage";
import { MenuItemCreatePage } from "./features/menu/items/pages/MenuItemCreatePage";
import { MenuItemEditPage } from "./features/menu/items/pages/MenuItemEditPage";
import {
  UsersPage,
  UserCreatePage,
  UserEditPage,
  ProfilePage,
} from "./features/users/pages";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import { RoleName } from "./types";
import { ROUTES } from "./app/routes";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
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

        {/* ============= PROTECTED ROUTES ============== */}
        {/* Dashboard (Home) */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Tables module */}
        <Route
          path={ROUTES.TABLES}
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TablesPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Menu module */}
        <Route
          path={ROUTES.MENU}
          element={
            <PrivateRoute>
              <DashboardLayout>
                <MenuPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Orders - List */}
        <Route
          path={ROUTES.ORDERS}
          element={
            <PrivateRoute>
              <DashboardLayout>
                <OrdersPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Orders - Create (Full Screen) */}
        <Route
          path={ROUTES.ORDER_CREATE}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <OrderCreatePage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Orders - Detail (Full Screen) */}
        <Route
          path={ROUTES.ORDER_DETAIL}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <OrderDetailPage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Tables - Create (Full Screen) */}
        <Route
          path={ROUTES.TABLE_CREATE}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <TableCreatePage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Tables - Manage (Full Screen) */}
        <Route
          path={ROUTES.TABLE_MANAGE}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <TableManagePage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Menu - Category Create (Full Screen) */}
        <Route
          path={ROUTES.MENU_CATEGORY_CREATE}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <CategoryCreatePage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Menu - Category Edit (Full Screen) */}
        <Route
          path={ROUTES.MENU_CATEGORY_EDIT}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <CategoryEditPage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Menu - Item Create (Full Screen) */}
        <Route
          path={ROUTES.MENU_ITEM_CREATE}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <MenuItemCreatePage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Menu - Item Edit (Full Screen) */}
        <Route
          path={ROUTES.MENU_ITEM_EDIT}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <MenuItemEditPage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Users - List (Admin only) */}
        <Route
          path={ROUTES.USERS}
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={[RoleName.ADMIN]}>
                <DashboardLayout>
                  <UsersPage />
                </DashboardLayout>
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
                <FullScreenLayout>
                  <UserCreatePage />
                </FullScreenLayout>
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
                <FullScreenLayout>
                  <UserEditPage />
                </FullScreenLayout>
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        {/* Profile - Own profile (All authenticated users) */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <PrivateRoute>
              <FullScreenLayout>
                <ProfilePage />
              </FullScreenLayout>
            </PrivateRoute>
          }
        />

        {/* Fallback: Redirect to home or login*/}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
