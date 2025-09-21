import api from "@/lib/api"

// Register
export async function register({ email, password, role }) {
  const res = await api.post("/auth/register", { email, password, role })
  return res.data
}

// Login
export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password })
  if (res.data.token) {
    localStorage.setItem("token", res.data.token)
  }
  return res.data
}

// Client profile
export async function createClientProfile(data) {
  const res = await api.post("/clients/profile", data)
  return res.data
}

// Seller profile
export async function createSellerProfile(data) {
  const res = await api.post("/sellers/profile", data)
  return res.data
}
