// src/services/productService.js
import axios from "axios"

const API_URL = "http://localhost:3000/api/v1/products"

export async function fetchProducts() {
  try {
    const res = await axios.get(API_URL)
    console.log("Réponse brute backend:", res.data)

    // Ton backend renvoie { success: true, data: [...] }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return { products: res.data.data }
    }

    // fallback pour d'autres formats
    if (res.data?.products?.data) {
      return { products: res.data.products.data }
    }
    if (res.data?.products) {
      return { products: res.data.products }
    }
    if (Array.isArray(res.data)) {
      return { products: res.data }
    }

    return { products: [] }
  } catch (err) {
    console.error("Erreur lors du fetch des produits:", err)
    throw err
  }
}
