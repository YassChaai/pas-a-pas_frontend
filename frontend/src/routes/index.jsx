import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "@/layouts/MainLayout"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ClientProfileForm from "@/components/client/ClientProfileForm"
import SellerProfileForm from "@/components/seller/SellerProfileForm"
import ClientDashboard from "@/pages/client/ClientDashboard"
import SellerDashboard from "@/pages/seller/SellerDashboard"
import { AuthProvider } from "@/context/AuthContext"
import PrivateRoute from "@/routes/PrivateRoute"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>  {/* <-- ENGLOBE TOUTES LES ROUTES */}
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route
                            path="/client/profile"
                            element={
                                <PrivateRoute role={3}>
                                    <ClientProfileForm />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/seller/profile"
                            element={
                                <PrivateRoute role={2}>
                                    <SellerProfileForm />
                                </PrivateRoute>
                            }
                        />
                    </Route>

                    <Route
                        path="/client/dashboard"
                        element={
                            <PrivateRoute role={3}>
                                <ClientDashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/seller/dashboard"
                        element={
                            <PrivateRoute role={2}>
                                <SellerDashboard />
                            </PrivateRoute>
                        }
                    />


                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
