import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function authHeaders() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchSellerProfile() {
  const response = await axios.get(`${API_URL}/sellers/profile`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function updateSellerProfile(payload) {
  const response = await axios.put(`${API_URL}/sellers/profile`, payload, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  })
  return response.data
}

export async function fetchSellerProducts() {
  const response = await axios.get(`${API_URL}/sellers/products`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function fetchSellerOrders() {
  const response = await axios.get(`${API_URL}/sellers/orders`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function fetchSellerOrderDetails(orderId) {
  const response = await axios.get(`${API_URL}/sellers/orders/${orderId}`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function updateSellerOrderLineStatus(orderId, lineId, statut_ligne) {
  const response = await axios.patch(
    `${API_URL}/sellers/orders/${orderId}/lines/${lineId}/status`,
    { statut_ligne },
    {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    },
  )
  return response.data
}
