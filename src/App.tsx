import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks";
import LoginPage from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { TablesPage } from "./features/tables";
import { LandingPage } from "./pages";
import { MenuPage } from "./features/menu";
import { OrdersPage } from "./features/orders";

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
        {/* Dashboard (Home)*/}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* Tables module */}
        <Route
          path="/tables"
          element={
            <PrivateRoute>
              <TablesPage />
            </PrivateRoute>
          }
        />

        {/* Menu module */}
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <MenuPage />
            </PrivateRoute>
          }
        />

        {/* Orders Module */}
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
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
