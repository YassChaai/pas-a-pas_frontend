import { useEffect, useMemo, useState } from "react"
import {
  fetchSellerProfile,
  updateSellerProfile,
  fetchSellerProducts,
  fetchSellerOrders,
  fetchSellerOrderDetails,
  updateSellerOrderLineStatus,
} from "@/services/sellerService"

const statutOptions = [
  { label: "En attente", value: "en attente" },
  { label: "Préparée", value: "préparée" },
  { label: "Expédiée", value: "expédiée" },
  { label: "Annulée", value: "annulée" },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function ProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    nom: profile?.nom || "",
    prenom: profile?.prenom || "",
    raison_sociale: profile?.raison_sociale || "",
    siret: profile?.siret || "",
    rib: profile?.rib || "",
    adresse_siege: profile?.adresse_siege || "",
    code_postal: profile?.code_postal || "",
    ville: profile?.ville || "",
    email_contact: profile?.email_contact || "",
    telephone_contact: profile?.telephone_contact || "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSaving(true)
      setError(null)
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer les modifications")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-2xl backdrop-blur">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Modifier mon profil vendeur</h3>
          <p className="text-xs text-slate-500">
            Ces informations sont utilisées pour vos ventes et le versement de votre cagnotte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Prénom
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Nom
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">
              Raison sociale
              <input
                type="text"
                name="raison_sociale"
                value={form.raison_sociale}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              SIRET
              <input
                type="text"
                name="siret"
                value={form.siret}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              RIB / IBAN
              <input
                type="text"
                name="rib"
                value={form.rib}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                required
              />
            </label>
          </div>

          <label className="space-y-1 text-sm font-medium text-slate-700">
            Adresse du siège
            <textarea
              name="adresse_siege"
              value={form.adresse_siege}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Code postal
              <input
                type="text"
                name="code_postal"
                value={form.code_postal}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Ville
              <input
                type="text"
                name="ville"
                value={form.ville}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Email de contact
              <input
                type="email"
                name="email_contact"
                value={form.email_contact}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Téléphone de contact
              <input
                type="tel"
                name="telephone_contact"
                value={form.telephone_contact}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
              />
            </label>
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-400"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-pasapas-blue px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ProfileCard({ profile, onEdit }) {
  if (!profile) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 text-center shadow-inner backdrop-blur">
        <p className="text-sm text-slate-500">
          Aucune fiche vendeur trouvée. Complétez vos informations pour activer la vente.
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-pasapas-blue px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
        >
          Créer / Modifier mon profil
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Profil vendeur</h2>
          <p className="text-sm text-slate-500">Ces informations sont utilisées pour vos ventes et la cagnotte.</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-400"
        >
          Modifier
        </button>
      </div>

      <dl className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Nom complet</dt>
          <dd className="text-sm font-semibold text-slate-900">
            {profile.prenom} {profile.nom}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Raison sociale</dt>
          <dd className="text-sm text-slate-600">{profile.raison_sociale || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">SIRET</dt>
          <dd className="text-sm text-slate-600">{profile.siret}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Email de contact</dt>
          <dd className="text-sm text-slate-600">{profile.email_contact}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Adresse</dt>
          <dd className="text-sm text-slate-600">
            {profile.adresse_siege}
            <br />
            {profile.code_postal} {profile.ville}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Téléphone</dt>
          <dd className="text-sm text-slate-600">{profile.telephone_contact || "—"}</dd>
        </div>
      </dl>
    </div>
  )
}

function ProductsSection({ products }) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h2 className="text-lg font-semibold text-slate-900">Mes produits en vente</h2>
        <span className="rounded-full bg-pasapas-blue/10 px-3 py-1 text-xs font-semibold text-pasapas-blue">
          {products?.length || 0} produit{products?.length > 1 ? "s" : ""}
        </span>
      </div>

      {(!products || products.length === 0) && (
        <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
          Vous n’avez pas encore mis de produit en vente.
        </p>
      )}

      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {products?.map((product) => (
          <li
            key={product.parent_id}
            className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-700 shadow-sm"
          >
            <img
              src={product.img_1}
              alt={product.model}
              className="h-20 w-20 rounded-xl object-cover shadow-inner"
            />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-slate-900">
                {product.brand} · {product.model}
              </p>
              <p className="text-xs text-slate-500">Référence : {product.parent_id}</p>
              <p className="text-xs text-slate-500">Couleur : {product.color || "—"}</p>
              <p className="text-xs text-slate-500">Prix conseillé : {product.price || "—"}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function OrdersSection({
  title,
  emptyMessage,
  orders,
  onOpenDetails = () => {},
  activeOrderId,
}) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {orders?.length ? (
          <span className="rounded-full bg-pasapas-blue/10 px-3 py-1 text-xs font-semibold text-pasapas-blue">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
          </span>
        ) : null}
      </header>

      {(!orders || orders.length === 0) && (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      )}

      <ul className="space-y-3">
        {orders?.map((order) => {
          const statusRaw = (order.statut || "").toLowerCase()
          const statusLabel = statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : "—"
          const statusClass = statusRaw.includes("finalis")
            ? "bg-emerald-50 text-emerald-600"
            : statusRaw.includes("en cours") || statusRaw.includes("préparation") || statusRaw.includes("expédition")
            ? "bg-amber-50 text-amber-600"
            : statusRaw.includes("annul")
            ? "bg-rose-50 text-rose-600"
            : "bg-slate-200 text-slate-600"

          return (
            <li
              key={order.id_commande}
              className={classNames(
                "flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-2xl border bg-slate-50/70 px-4 py-4 text-sm text-slate-700 shadow-sm transition hover:border-pasapas-blue/60 hover:bg-white",
                order.id_commande === activeOrderId ? "border-pasapas-blue bg-white shadow-lg" : "border-slate-100",
              )}
              onClick={() => onOpenDetails(order.id_commande)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onOpenDetails(order.id_commande)
                }
              }}
            >
              <div>
                <p className="font-semibold text-slate-900">Commande #{order.id_commande}</p>
                <p className="text-xs text-slate-500">
                  Passée le {new Date(order.date_commande).toLocaleString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(order.montant_total)}
                  </span>
                  <span className={classNames("rounded-full px-3 py-1 text-xs font-medium", statusClass)}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function SellerDashboard() {
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [previewOrderId, setPreviewOrderId] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(null)
  const [previewDetails, setPreviewDetails] = useState(null)
  const [detailsCache, setDetailsCache] = useState({})
  const [statusUpdating, setStatusUpdating] = useState(null)
  const [orderFilter, setOrderFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [profileRes, productsRes, ordersRes] = await Promise.all([
          fetchSellerProfile(),
      fetchSellerProducts(),
      fetchSellerOrders(),
    ])

        if (profileRes?.success && profileRes.data) {
          setProfile(profileRes.data)
        }
        if (productsRes?.success && productsRes.data) {
          setProducts(productsRes.data)
        }
        if (ordersRes?.success && ordersRes.data) {
          // Ne garder que les commandes payées
          const filtered = ordersRes.data.filter((order) => {
            const status = (order.statut || "").toLowerCase()
            return status.includes("pay") || status.includes("finalis") || status.includes("en cours")
          })
          setOrders(filtered)
        }
      } catch (err) {
        setError(err.message || "Impossible de charger vos informations")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleSaveProfile = async (payload) => {
    const response = await updateSellerProfile(payload)
    if (!response?.success) {
      throw new Error(response?.message || "Échec de la mise à jour")
    }
    setProfile(response.data)
    setSuccessMessage("Profil vendeur mis à jour ✅")
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => (order.statut || "").toLowerCase().includes("pay"))
      .reduce((sum, order) => sum + Number(order.montant_total || 0), 0)
  }, [orders])

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      const status = (order.statut || "").toLowerCase()
      const matchesFilter =
        orderFilter === "all" ||
        (orderFilter === "pending" && !status.includes("finalis") && !status.includes("annul")) ||
        (orderFilter === "completed" && status.includes("finalis")) ||
        (orderFilter === "cancelled" && status.includes("annul"))

      const matchesSearch =
        !query ||
        order.id_commande.toString().includes(query) ||
        new Date(order.date_commande).toLocaleDateString("fr-FR").includes(query)

      return matchesFilter && matchesSearch
    })
  }, [orders, orderFilter, search])

  useEffect(() => {
    if (!previewOrderId) {
      setPreviewDetails(null)
      return
    }

    if (detailsCache[previewOrderId]) {
      setPreviewDetails(detailsCache[previewOrderId])
      setPreviewLoading(false)
      return
    }

    let cancelled = false
    async function loadDetails() {
      try {
        setPreviewLoading(true)
        const response = await fetchSellerOrderDetails(previewOrderId)
        if (!response?.success || !response.data) {
          throw new Error(response?.message || "Impossible de charger les détails")
        }
        if (!cancelled) {
          setDetailsCache((prev) => ({ ...prev, [previewOrderId]: response.data }))
          setPreviewDetails(response.data)
        }
      } catch (err) {
        if (!cancelled) {
          setPreviewError(err.message || "Erreur lors du chargement des détails")
          setPreviewDetails(null)
        }
      } finally {
        if (!cancelled) setPreviewLoading(false)
      }
    }

    loadDetails()

    return () => {
      cancelled = true
    }
  }, [previewOrderId, detailsCache])

  const handleOpenDetails = (orderId) => {
    if (!orderId) return
    setPreviewOrderId(orderId)
    setPreviewError(null)
  }

  const handleUpdateLineStatus = async (orderId, lineId, statut) => {
    try {
      setStatusUpdating(lineId)
      const response = await updateSellerOrderLineStatus(orderId, lineId, statut)
      if (!response?.success) {
        throw new Error(response?.message || "Échec de la mise à jour")
      }

      setDetailsCache((prev) => {
        const existing = prev[orderId]
        if (!existing) return prev
        const updatedLines = existing.mes_lignes.map((line) =>
          line.order_line_id === lineId ? { ...line, statut_ligne: statut } : line,
        )
        const updated = { ...existing, mes_lignes: updatedLines }
        return { ...prev, [orderId]: updated }
      })

      setPreviewDetails((prev) =>
        prev
          ? {
              ...prev,
              mes_lignes: prev.mes_lignes.map((line) =>
                line.order_line_id === lineId ? { ...line, statut_ligne: statut } : line,
              ),
            }
          : prev,
      )

      setSuccessMessage("Statut de la commande mis à jour ✅")
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du statut")
    } finally {
      setStatusUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-lg backdrop-blur">
          <p className="text-lg font-medium text-slate-500">Chargement de votre espace vendeur…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-100 bg-red-50/80 p-10 text-center shadow-lg backdrop-blur">
          <p className="text-lg font-semibold text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Bonjour {profile?.prenom || "vendeur"} 👋</h1>
          <p className="mt-2 text-sm text-slate-500">
            Gérez vos informations, vos produits et suivez vos commandes en temps réel.
          </p>
        </div>

        {successMessage && (
          <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-600 shadow-sm">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          <ProfileCard profile={profile} onEdit={() => setShowModal(true)} />

          <div className="rounded-3xl border border-white/60 bg-white/95 p-6 text-center shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Cagnotte disponible</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalRevenue)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Montant total des commandes finalisées. Les fonds sont versés selon vos conditions de paiement.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-pasapas-blue px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-700"
            >
              Retirer ma cagnotte
            </button>
          </div>
        </div>

        <ProductsSection products={products} />

        <section className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Commandes</h2>
              <p className="text-xs text-slate-500">Suivez l’avancement et mettez à jour le statut de vos commandes en cours.</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par n° de commande ou date"
                className="w-full md:w-64 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-inner focus:border-pasapas-blue focus:outline-none"
              />
              <select
                value={orderFilter}
                onChange={(event) => setOrderFilter(event.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-inner focus:border-pasapas-blue focus:outline-none"
              >
                <option value="all">Toutes</option>
                <option value="pending">En cours</option>
                <option value="completed">Finalisées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
          </div>

          <OrdersSection
            title=""
            emptyMessage="Aucune commande pour le moment."
            orders={filteredOrders}
            onOpenDetails={handleOpenDetails}
            activeOrderId={previewOrderId}
          />
        </section>

        {previewOrderId && (
          <>
            <div
              className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setPreviewOrderId(null)}
            />
            <div
              className="fixed inset-0 z-40 flex items-center justify-center px-4"
              onClick={() => setPreviewOrderId(null)}
            >
              <div
                className="w-full max-w-3xl rounded-3xl border border-white/70 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-90"
                onClick={(event) => event.stopPropagation()}
              >
                <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Commande #{previewOrderId}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mettez à jour l’état des articles pour informer le client.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewOrderId(null)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  >
                    Fermer
                  </button>
                </header>

                {previewLoading && (
                  <p className="py-6 text-center text-sm text-slate-500">Chargement des détails…</p>
                )}
                {previewError && (
                  <p className="py-4 text-center text-sm text-rose-500">{previewError}</p>
                )}
                {!previewLoading && previewDetails && (
                  <div className="mt-4 space-y-4">
                    {previewDetails.mes_lignes?.length ? (
                      <ul className="space-y-3">
                        {previewDetails.mes_lignes.map((line) => (
                          <li
                            key={line.order_line_id}
                            className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4 text-sm text-slate-700"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {line.brand} · {line.model}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Taille {line.size} · {line.gender} · Qté {line.quantite}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(Number(line.prix_unitaire) * line.quantite)}
                                </p>
                                <p className="text-xs text-slate-500">Statut actuel : {line.statut_ligne}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <label className="text-xs font-medium text-slate-500">Mettre à jour :</label>
                              <select
                                value={line.statut_ligne}
                                onChange={(event) => handleUpdateLineStatus(previewOrderId, line.order_line_id, event.target.value)}
                                disabled={statusUpdating === line.order_line_id}
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 focus:border-pasapas-blue focus:outline-none"
                              >
                                {statutOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
                        Aucun article détaillé pour cette commande.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
    </div>

      {showModal && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}
