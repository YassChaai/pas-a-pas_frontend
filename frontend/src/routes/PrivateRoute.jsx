import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && (!user || user.role !== role)) return <Navigate to="/login" replace />

  return children
}
