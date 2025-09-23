import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "@/components/payments/PaymentForm"
import { createPaymentIntent } from "@/services/paymentService"
import { useCart } from "@/context/CartContext"

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null

export default function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { cart } = useCart()
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const processedOrderId = useRef(null)

  const stripeOptions = useMemo(
    () => (clientSecret ? { clientSecret } : undefined),
    [clientSecret],
  )

  const subtotal = useMemo(() => {
    if (!cart || cart.length === 0) return 0
    return cart.reduce((sum, item) => {
      const normalized = item.price
        ?.toString()
        ?.replace(/[^0-9,.-]/g, "")
        ?.replace(/,/g, ".")
      const price = Number.parseFloat(normalized ?? "0") || 0
      return sum + price * (item.quantite ?? 1)
    }, 0)
  }, [cart])

  const formattedSubtotal = useMemo(() => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(subtotal)
  }, [subtotal])

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pasapas-blue/20 bg-white px-4 py-1 text-sm font-medium text-pasapas-blue shadow-sm">
            Paiement sécurisé par Stripe
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Finalisez votre commande
          </h1>
          <p className="mt-2 text-slate-500">
            Saisissez vos informations de carte bancaire. Votre paiement est sécurisé et crypté.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr,1.1fr]">
          <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900">Étapes</h2>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pasapas-blue/10 text-xs font-semibold text-pasapas-blue">
                    1
                  </span>
                  Vérifiez les détails de votre commande.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pasapas-blue/10 text-xs font-semibold text-pasapas-blue">
                    2
                  </span>
                  Saisissez votre carte bancaire via notre formulaire sécurisé Stripe.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pasapas-blue/10 text-xs font-semibold text-pasapas-blue">
                    3
                  </span>
                  Validez le paiement et recevez immédiatement votre confirmation.
                </li>
              </ol>
            </div>

            {stripePromise && stripeOptions && (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <PaymentForm
                  clientSecret={clientSecret}
                  amountLabel={formattedSubtotal}
                  onSuccess={() => navigate(`/checkout/confirmation/${orderId}`)}
                />
              </Elements>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">Résumé de commande</h2>
            {cart.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Votre panier est vide. Si vous venez de payer, vous recevrez une confirmation sous peu.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <ul className="space-y-3 text-sm text-slate-700">
                  {cart.map((item, index) => (
                    <li
                      key={`${item.child_id}-${index}`}
                      className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.brand} · {item.model}
                        </p>
                        <p className="text-xs text-slate-500">
                          Taille {item.size} · {item.gender}
                        </p>
                        <p className="text-xs text-slate-400">Quantité : {item.quantite}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{item.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm font-medium text-slate-500">Montant total</span>
                  <span className="text-lg font-semibold text-slate-900">{formattedSubtotal}</span>
                </div>
              </div>
            )}

            <p className="mt-6 rounded-lg border border-pasapas-blue/20 bg-pasapas-blue/5 px-4 py-3 text-sm text-slate-600">
              Nous n’enregistrons aucune donnée bancaire. Stripe traite toutes les informations de paiement de manière entièrement sécurisée.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
