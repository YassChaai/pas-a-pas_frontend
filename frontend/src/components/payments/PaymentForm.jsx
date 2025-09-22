import { useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useCart } from "@/context/CartContext"

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1f2933",
      fontSize: "16px",
      letterSpacing: "0.025em",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#9aa5b1" },
    },
    invalid: {
      color: "#ef4444",
    },
  },
}

export default function PaymentForm({ clientSecret }) {
  const stripe = useStripe()
  const elements = useElements()
  const { clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setMessage(null)

    const cardElement = elements.getElement(CardElement)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (error) {
        setMessage(error.message || "Paiement refusé. Merci de vérifier votre carte.")
        return
      }

      if (paymentIntent?.status === "succeeded") {
        clearCart()
        setMessage("Paiement réussi ! Merci pour votre commande.")
      } else {
        setMessage("Paiement en cours de traitement. Nous vous informerons dès sa confirmation.")
      }
    } catch (err) {
      setMessage(err.message || "Une erreur est survenue lors du paiement.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="border border-gray-300 rounded-md p-3">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full bg-pasapas-blue text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Traitement…" : "Payer maintenant"}
      </button>

      {message && <p className="text-center text-sm text-gray-700">{message}</p>}
    </form>
  )
}
