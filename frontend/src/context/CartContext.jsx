import { createContext, useContext, useState } from "react";
import { createOrder } from "@/services/cartService";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const addToCart = (product, stock, quantity = 1) => {
    setCart((prev) => [...prev, { ...product, ...stock, quantite: quantity }]);
  };

  const removeFromCart = (child_id) => {
    setCart((prev) => prev.filter((item) => item.child_id !== child_id));
  };

  const updateQuantity = (child_id, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.child_id === child_id
          ? { ...item, quantite: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const checkout = async () => {
    if (!user) throw new Error("Vous devez être connecté pour passer commande");
    const products = cart.map((item) => ({
      child_id: item.child_id,
      quantite: item.quantite,
      prix_unitaire: item.price, // backend attend prix_unitaire
    }));
    const order = await createOrder(user.id, products);
    clearCart();
    return order;
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
