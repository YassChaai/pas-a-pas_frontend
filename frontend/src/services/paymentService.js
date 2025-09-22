import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function createPaymentIntent(orderId) {
  const response = await axios.post(
    `${API_URL}/payments/${orderId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    },
  )

  return response.data
}
