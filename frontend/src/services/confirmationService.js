import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchOrderWithDetails(orderId) {
  const response = await axios.get(`${API_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export async function fetchClientProfile() {
  const response = await axios.get(`${API_URL}/clients/profile`, {
    headers: getAuthHeaders(),
  })
  return response.data
}
