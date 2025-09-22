// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";
import { createOrder } from "@/services/cartService";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Ajouter un produit
  const addToCart = (product, stock, quantity = 1) => {
    setCart((prev) => [...prev, { ...product, ...stock, quantite: quantity }]);
  };

  // Supprimer un produit
  const removeFromCart = (child_id) => {
    setCart((prev) => prev.filter((item) => item.child_id !== child_id));
  };

  // Vider le panier
  const clearCart = () => setCart([]);

  // Valider le panier (checkout)
  const checkout = async () => {
    if (!user) throw new Error("Vous devez être connecté pour passer commande");

    const products = cart.map((item) => ({
      child_id: item.child_id,
      quantite: item.quantite,
      prix_unitaire: item.price, // ⚠️ laissé tel quel pour backend
    }));

    // 👉 Récupération automatique du token
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token manquant. Veuillez vous reconnecter.");

    const order = await createOrder(user.id, products);
    return order;
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
