import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { fetchClientProfile, fetchOrderWithDetails } from "@/services/confirmationService"

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
})

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
})

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) {
      setError("Commande introuvable")
      setLoading(false)
      return
    }

    async function loadData() {
      try {
        setLoading(true)
        const [orderResponse, clientResponse] = await Promise.all([
          fetchOrderWithDetails(orderId),
          fetchClientProfile(),
        ])

        if (!orderResponse?.success || !orderResponse?.data) {
          throw new Error(orderResponse?.message || "Impossible de récupérer la commande")
        }
        if (!clientResponse?.success || !clientResponse?.data) {
          throw new Error(clientResponse?.message || "Impossible de récupérer la fiche client")
        }

        setOrder(orderResponse.data)
        setClient(clientResponse.data)
      } catch (err) {
        setError(err.message || "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [orderId])

  const totalAmount = useMemo(() => {
    if (order?.montant_total === undefined || order?.montant_total === null) return "—"
    const numeric = Number(order.montant_total)
    if (Number.isNaN(numeric)) return order.montant_total
    return currencyFormatter.format(numeric)
  }, [order?.montant_total])

  const orderDate = useMemo(() => {
    if (!order?.date_commande) return "—"
    try {
      return dateFormatter.format(new Date(order.date_commande))
    } catch {
      return order.date_commande
    }
  }, [order?.date_commande])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-lg backdrop-blur">
          <p className="text-lg font-medium text-slate-500">Nous préparons votre confirmation…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-red-50/80 p-10 text-center shadow-lg backdrop-blur">
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            Revenir
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
          <CheckCircle className="h-10 w-10" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Paiement confirmé
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Merci pour votre confiance !
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Votre commande #{order.id_commande} a bien été validée. Vous recevrez un email récapitulatif très prochainement.
          </p>
        </div>

        <div className="grid w-full gap-8 lg:grid-cols-[1.3fr,1fr]">
          <section className="space-y-6 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Récapitulatif de commande</h2>
                <p className="text-sm text-slate-500">Passée le {orderDate}</p>
              </div>
            </header>

            <ul className="space-y-4">
              {order?.order_lines?.map((line) => (
                <li
                  key={line.order_line_id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {line.brand} · {line.model}
                    </p>
                    <p className="text-xs text-slate-500">
                      Taille {line.size} · {line.gender}
                    </p>
                    <p className="text-xs text-slate-400">Quantité : {line.quantite}</p>
                  </div>
                  <div className="text-right text-sm font-semibold text-slate-900">
                    {currencyFormatter.format(line.prix_unitaire * line.quantite)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 text-slate-900 shadow-inner">
              <span className="text-sm font-medium text-slate-500">Montant total</span>
              <span className="text-2xl font-semibold">{totalAmount}</span>
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-white/70 bg-white/95 p-8 shadow-xl backdrop-blur">
            <h2 className="text-xl font-semibold text-slate-900">Coordonnées client</h2>
            {client ? (
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-slate-400">Nom complet</span>
                  <span className="text-base font-semibold text-slate-900">
                    {client.prenom} {client.nom}
                  </span>
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-slate-400">Adresse</span>
                  <span>
                    {client.adresse}
                    <br />
                    {client.code_postal} {client.ville}
                  </span>
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.3em] text-slate-400">Téléphone</span>
                  <span>{client.telephone || "—"}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Aucune fiche client disponible.</p>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-500">
              <p>
                Un email de confirmation vous sera envoyé à l’adresse associée à votre compte. Retrouvez tous les
                documents utiles et le suivi de livraison depuis votre espace client.
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-pasapas-blue px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
          >
            <ShoppingBag className="h-4 w-4" />
            Retour à la boutique
          </Link>
          <Link
            to="/client/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-400"
          >
            Consulter mes commandes
          </Link>
        </div>
      </div>
    </div>
  )
}
