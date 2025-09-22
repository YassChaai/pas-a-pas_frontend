import { useNavigate } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function CartPage() {
  const { cart, removeFromCart, checkout, updateQuantity } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  async function handleCheckout() {
    try {
      if (!isAuthenticated) {
        alert("Veuillez vous connecter pour valider la commande.")
        return
      }
      const order = await checkout()
      if (!order || !order.id_commande) {
        throw new Error("Commande introuvable après validation")
      }
      navigate(`/checkout/payment/${order.id_commande}`)
    } catch (e) {
      alert("Erreur lors de la validation : " + e.message)
    }
  }

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("€", "").replace(",", "."))
    return sum + price * item.quantite
  }, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Votre panier</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Votre panier est vide.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.img_1}
                    alt={item.model}
                    className="w-20 h-20 object-contain rounded-md"
                  />
                  <div>
                    <h2 className="font-semibold">
                      {item.brand} - {item.model}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Taille : {item.size} ({item.gender})
                    </p>
                    <p className="text-sm text-gray-500">Prix : {item.price}</p>
                  </div>
                </div>

                {/* Gestion quantité uniquement avec boutons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.child_id, Math.max(1, item.quantite - 1))
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ➖
                  </button>
                  <span className="w-8 text-center">{item.quantite}</span>
                  <button
                    onClick={() => updateQuantity(item.child_id, item.quantite + 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ➕
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.child_id)}
                  className="text-red-500 hover:underline ml-4"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-lg font-semibold">
              Total : {total.toFixed(2)} €
            </span>
            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Valider la commande
            </button>
          </div>
        </>
      )}
    </div>
  )
}
