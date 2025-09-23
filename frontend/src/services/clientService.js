import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function authHeaders() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchClientProfile() {
  const response = await axios.get(`${API_URL}/clients/profile`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function updateClientProfile(payload) {
  const response = await axios.put(`${API_URL}/clients/profile`, payload, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  })
  return response.data
}

export async function fetchClientOrders() {
  const response = await axios.get(`${API_URL}/orders`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function fetchOrderDetails(orderId) {
  const response = await axios.get(`${API_URL}/orders/${orderId}`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function cancelClientOrder(orderId) {
  const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function deleteClientProfile() {
  const response = await axios.delete(`${API_URL}/clients/profile`, {
    headers: authHeaders(),
  })
  return response.data
}
