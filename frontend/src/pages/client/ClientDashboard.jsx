import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  fetchClientOrders,
  fetchClientProfile,
  updateClientProfile,
  deleteClientProfile,
  fetchOrderDetails,
  cancelClientOrder,
} from "@/services/clientService"
import { useAuth } from "@/context/AuthContext"

function ProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    nom: profile?.nom || "",
    prenom: profile?.prenom || "",
    genre: profile?.genre || "",
    adresse: profile?.adresse || "",
    code_postal: profile?.code_postal || "",
    ville: profile?.ville || "",
    telephone: profile?.telephone || "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Modifier mon profil</h3>
          <p className="text-xs text-slate-500">
            Vos informations seront utilisées pour la livraison et la facturation.
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
          </div>

          <label className="space-y-1 text-sm font-medium text-slate-700">
            Genre
            <select
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
              required
            >
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Autre">Autre</option>
            </select>
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700">
            Adresse
            <textarea
              name="adresse"
              value={form.adresse}
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
              Téléphone (optionnel)
              <input
                type="tel"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
              />
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function ProfileCard({ profile, onEdit }) {
  if (!profile) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white/70 p-6 text-center shadow-inner backdrop-blur">
        <p className="text-sm text-slate-500">
          Aucune fiche client trouvée. Complétez vos informations pour retrouver votre historique de commandes.
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
          <h2 className="text-xl font-semibold text-slate-900">Profil client</h2>
          <p className="text-sm text-slate-500">Gérez vos informations personnelles et coordonnées de livraison.</p>
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
          <dd className="text-base font-semibold text-slate-900">
            {profile.prenom} {profile.nom}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Genre</dt>
          <dd className="text-sm text-slate-600">{profile.genre || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Adresse</dt>
          <dd className="text-sm text-slate-600">
            {profile.adresse}
            <br />
            {profile.code_postal} {profile.ville}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Téléphone</dt>
          <dd className="text-sm text-slate-600">{profile.telephone || "—"}</dd>
        </div>
      </dl>
    </div>
  )
}

function OrdersSection({
  title,
  emptyMessage,
  orders,
  onOpenDetails = () => {},
  activeOrderId,
  onCancelOrder,
}) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
      <header className="flex items-center justify-between">
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

      <ul className="space-y-4">
        {orders?.map((order) => {
          const handleClick = () => onOpenDetails && onOpenDetails(order.id_commande)
          const statusRaw = (order.statut || "").toLowerCase()
          const statusLabel = statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : "—"
          const statusClass = statusRaw.includes("finalis") || statusRaw.includes("pay")
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
                order.id_commande === activeOrderId
                  ? "border-pasapas-blue bg-white shadow-lg"
                  : "border-slate-100",
              )}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleClick()
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
                {onCancelOrder && statusRaw.includes("en cours") && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onCancelOrder(order.id_commande)
                    }}
                    className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function ClientDashboard() {
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [previewOrderId, setPreviewOrderId] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(null)
  const [previewDetails, setPreviewDetails] = useState(null)
  const [detailsCache, setDetailsCache] = useState({})
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [profileRes, ordersRes] = await Promise.all([fetchClientProfile(), fetchClientOrders()])

        if (profileRes?.success && profileRes.data) {
          setProfile(profileRes.data)
        }
        if (ordersRes?.success && ordersRes.data) {
          setOrders(ordersRes.data)
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
    const response = await updateClientProfile(payload)
    if (!response?.success) {
      throw new Error(response?.message || "Échec de la mise à jour")
    }
    setProfile(response.data)
    setSuccessMessage("Profil mis à jour avec succès ✅")
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  const handleDeleteProfile = async () => {
    try {
      setIsDeleting(true)
      const response = await deleteClientProfile()
      if (!response?.success) {
        throw new Error(response?.message || "Suppression impossible")
      }
      logout()
      navigate("/", { replace: true })
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression du profil")
    } finally {
      setIsDeleting(false)
      setConfirmDelete(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!orderId) return
    const confirm = window.confirm("Souhaitez-vous annuler cette commande ?")
    if (!confirm) return
    try {
      const response = await cancelClientOrder(orderId)
      if (!response?.success) {
        throw new Error(response?.message || "Impossible d'annuler la commande")
      }
      setOrders((prev) =>
        prev.map((order) =>
          order.id_commande === orderId ? { ...order, statut: response.data?.statut || "annulée" } : order,
        ),
      )
      if (previewOrderId === orderId) {
        setPreviewOrderId(null)
      }
      setSuccessMessage("Commande annulée avec succès ✅")
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err) {
      setError(err.message || "Erreur lors de l'annulation de la commande")
    }
  }

  const handleOpenDetails = (orderId) => {
    if (!orderId) return
    if (previewOrderId !== orderId) {
      setPreviewOrderId(orderId)
    }
    setPreviewError(null)
  }

  useEffect(() => {
    if (!previewOrderId) {
      setPreviewDetails(null)
      return
    }

    if (detailsCache[previewOrderId]) {
      setPreviewDetails(detailsCache[previewOrderId])
      setPreviewError(null)
      setPreviewLoading(false)
      return
    }

    let cancelled = false
    async function loadDetails() {
      try {
        setPreviewLoading(true)
        const response = await fetchOrderDetails(previewOrderId)
        if (!response?.success || !response.data) {
          throw new Error(response?.message || "Impossible de charger les détails")
        }
        if (!cancelled) {
          setDetailsCache((prev) => ({ ...prev, [previewOrderId]: response.data }))
          setPreviewDetails(response.data)
          setPreviewError(null)
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

  const ordersByStatus = useMemo(() => {
    const enCours = []
    const passees = []

    for (const order of orders || []) {
      const status = (order.statut || "").toLowerCase()
      if (status.includes("finalis") || status.includes("annul")) {
        passees.push(order)
      } else {
        enCours.push(order)
      }
    }

    return { enCours, passees }
  }, [orders])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-lg backdrop-blur">
          <p className="text-lg font-medium text-slate-500">Chargement de votre espace client…</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Bonjour {profile?.prenom || "client"} 👋</h1>
          <p className="mt-2 text-sm text-slate-500">
            Retrouvez vos informations personnelles et suivez vos commandes en temps réel.
          </p>
        </div>

        {successMessage && (
          <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-600 shadow-sm">
            {successMessage}
          </div>
        )}

        <ProfileCard profile={profile} onEdit={() => setShowModal(true)} />
        <OrdersSection
          title="Commandes en cours"
          emptyMessage="Vous n’avez pas encore de commande en préparation."
          orders={ordersByStatus.enCours}
          onOpenDetails={handleOpenDetails}
          activeOrderId={previewOrderId}
          onCancelOrder={handleCancelOrder}
        />
        <OrdersSection
          title="Commandes passées"
          emptyMessage="Vous retrouverez ici l’historique de vos commandes finalisées."
          orders={ordersByStatus.passees}
          onOpenDetails={handleOpenDetails}
          activeOrderId={previewOrderId}
        />

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
                className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-90"
                onClick={(event) => event.stopPropagation()}
              >
              <header className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Commande #{previewOrderId}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cliquez sur une commande pour afficher son contenu détaillé.
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
                <div className="mt-4 max-h-60 space-y-3 overflow-y-auto pr-2">
                  {previewDetails.order_lines?.length ? (
                    <ul className="space-y-2">
                      {previewDetails.order_lines.map((line) => (
                      <li
                        key={line.order_line_id}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm text-slate-700"
                        >
                          <div>
                            <p className="font-semibold text-slate-900">
                              {line.brand} · {line.model}
                            </p>
                            <p className="text-xs text-slate-500">
                              Taille {line.size} · {line.gender} · Qté {line.quantite}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(Number(line.prix_unitaire) * line.quantite)}
                          </span>
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

        <div className="rounded-3xl border border-rose-100 bg-rose-50/70 p-6 text-center text-sm text-rose-600 shadow-inner">
          <p className="font-semibold">Supprimer mon profil</p>
          <p className="mt-1 text-rose-500">
            Cette action supprimera définitivement vos informations client et votre historique de commandes.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {confirmDelete ? (
              <>
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  disabled={isDeleting}
                  className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-rose-700 disabled:opacity-60"
                >
                  {isDeleting ? "Suppression…" : "Confirmer la suppression"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-500 hover:border-rose-300"
                  disabled={isDeleting}
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-rose-600 shadow-sm hover:bg-rose-100"
              >
                Supprimer mon profil
              </button>
            )}
          </div>
        </div>
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
