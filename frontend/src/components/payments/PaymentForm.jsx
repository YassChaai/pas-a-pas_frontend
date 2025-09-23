import { useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useCart } from "@/context/CartContext"

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#0f172a",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      letterSpacing: "0.02em",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: {
      color: "#ef4444",
    },
  },
  hidePostalCode: true,
  disableLink: true,
}

export default function PaymentForm({ clientSecret, amountLabel, onSuccess }) {
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
        if (onSuccess) {
          onSuccess(paymentIntent)
          return
        }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pasapas-blue/80">
              Méthode de paiement
            </p>
            <h3 className="text-lg font-semibold text-slate-900">Carte bancaire</h3>
          </div>
          {amountLabel && (
            <span className="rounded-full bg-pasapas-blue/10 px-3 py-1 text-xs font-semibold text-pasapas-blue">
              Total {amountLabel}
            </span>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-inner transition focus-within:border-pasapas-blue">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full rounded-xl bg-gradient-to-r from-pasapas-blue to-blue-700 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Traitement…" : `Payer maintenant${amountLabel ? ` (${amountLabel})` : ""}`}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${message.includes("réussi") ? "text-emerald-600" : "text-amber-600"}`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
