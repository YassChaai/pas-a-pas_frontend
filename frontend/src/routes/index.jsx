import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import MainLayout from "@/layouts/MainLayout"

// Pages publiques
import SneakersPage from "@/pages/SneakersPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"

// Dashboards
import ClientDashboard from "@/pages/client/ClientDashboard"
import SellerDashboard from "@/pages/seller/SellerDashboard"

// ProtectedRoute : bloque si pas connecté ou mauvais rôle
function ProtectedRoute({ element, role }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return element
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Layout global */}
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<SneakersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Client */}
        <Route
          path="/client/dashboard"
          element={<ProtectedRoute role={3} element={<ClientDashboard />} />}
        />

        {/* Seller */}
        <Route
          path="/seller/dashboard"
          element={<ProtectedRoute role={2} element={<SellerDashboard />} />}
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
