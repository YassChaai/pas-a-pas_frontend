import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper pour récupérer le token
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Créer une commande
export async function createOrder(id_client, products) {
  const res = await axios.post(
    `${API_URL}/orders`,
    { id_client, products },
    { headers: { ...getAuthHeaders() } }
  );
  return res.data; // ton backend retourne { id_commande, ... }
}

// Récupérer une commande par ID
export async function getOrderById(id_commande) {
  const res = await axios.get(`${API_URL}/orders/${id_commande}`, {
    headers: { ...getAuthHeaders() },
  });
  return res.data;
}

// Récupérer toutes les commandes d’un client
export async function getOrdersByClient(id_client) {
  const res = await axios.get(`${API_URL}/clients/${id_client}/orders`, {
    headers: { ...getAuthHeaders() },
  });
  return res.data;
}

// Annuler une commande
export async function cancelOrder(id_commande) {
  const res = await axios.put(
    `${API_URL}/orders/${id_commande}/cancel`,
    {},
    { headers: { ...getAuthHeaders() } }
  );
  return res.data;
}
