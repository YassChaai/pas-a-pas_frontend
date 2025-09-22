import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "@/components/payments/PaymentForm"
import { createPaymentIntent } from "@/services/paymentService"

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null

export default function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const processedOrderId = useRef(null)

  const stripeOptions = useMemo(
    () => (clientSecret ? { clientSecret } : undefined),
    [clientSecret],
  )

  useEffect(() => {
    if (!orderId) {
      setError("Commande introuvable")
      setLoading(false)
      return
    }

    if (processedOrderId.current === orderId) {
      return
    }
    processedOrderId.current = orderId

    async function initPayment() {
      try {
        setLoading(true)
        const response = await createPaymentIntent(orderId)
        if (!response?.client_secret) {
          throw new Error("Impossible de récupérer le paiement Stripe")
        }
        setClientSecret(response.client_secret)
      } catch (err) {
        setError(err.message || "Impossible de préparer le paiement")
      } finally {
        setLoading(false)
      }
    }

    initPayment()
  }, [orderId])

  if (!STRIPE_KEY) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center text-red-600">
        La clé publique Stripe est manquante. Vérifiez VITE_STRIPE_PUBLISHABLE_KEY.
      </div>
    )
  }

  if (loading) {
    return <div className="max-w-lg mx-auto px-4 py-10">Préparation du paiement…</div>
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 space-y-4 text-center">
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-pasapas-blue hover:underline"
        >
          Retourner au panier
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Paiement sécurisé</h1>
      {stripePromise && stripeOptions && (
        <Elements stripe={stripePromise} options={stripeOptions}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  )
}
