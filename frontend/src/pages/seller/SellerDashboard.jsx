import { useEffect, useMemo, useState } from "react"
import {
  fetchSellerProfile,
  updateSellerProfile,
  fetchSellerProducts,
  fetchSellerOrders,
  fetchSellerOrderDetails,
  updateSellerOrderLineStatus,
  updateSellerOrderStatus,
  createSellerProduct,
  createSellerProductStock,
  deleteSellerProduct,
  deleteSellerProfile,
} from "@/services/sellerService"

const statutOptions = [
  { label: "En attente", value: "en attente" },
  { label: "Préparée", value: "préparée" },
  { label: "Expédiée", value: "expédiée" },
  { label: "Annulée", value: "annulée" },
]

const orderStatusOptions = [
  { label: "Payée", value: "payée" },
  { label: "En cours", value: "en cours" },
  { label: "Expédiée", value: "expédiée" },
  { label: "Finalisée", value: "finalisée" },
  { label: "Annulée", value: "annulée" },
]

const DELETE_CONFIRMATION_CODE = "SUPPRIMER MON PROFIL"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function normalizeStatusText(value) {
  return (value || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

function getOrderStatusBucket(status) {
  const normalized = normalizeStatusText(status)
  if (!normalized) return "pending"
  if (normalized.includes("annul")) return "cancelled"
  if (
    normalized.includes("finalis") ||
    normalized.includes("expedie") ||
    normalized.includes("livre") ||
    normalized.includes("pay")
  ) {
    return "completed"
  }
  return "pending"
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

function NewProductModal({ onClose, onSave, saving = false, error = null }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    description: "",
    color: "",
    release_date: "",
    url: "",
    images: [null, null, null],
    price: "",
    quantity: 1,
    size: "TU",
    gender: "Unisexe",
    original_url: "",
  })
  const [localError, setLocalError] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageReset = (index) => {
    setForm((prev) => {
      const next = [...prev.images]
      next[index] = null
      return { ...prev, images: next }
    })
  }

  const handleImageFileChange = (index, file) => {
    if (!file) {
      handleImageReset(index)
      return
    }

    const reader = new FileReader()
    setUploading(true)
    reader.onloadend = () => {
      setForm((prev) => {
        const next = [...prev.images]
        next[index] = reader.result
        return { ...prev, images: next }
      })
      setUploading(false)
    }
    reader.onerror = () => {
      setUploading(false)
      setLocalError("Impossible de lire ce fichier. Réessayez avec une autre image.")
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedBrand = form.brand.trim()
    const trimmedModel = form.model.trim()
    const firstImage = form.images.find(Boolean)

    if (!trimmedBrand || !trimmedModel) {
      setLocalError("Merci de renseigner une marque et un modèle.")
      return
    }

    if (!firstImage) {
      setLocalError("Ajoutez au moins une image pour présenter le produit.")
      return
    }

    setLocalError(null)

    const payload = {
      ...form,
      brand: trimmedBrand,
      model: trimmedModel,
      description: form.description.trim(),
      color: form.color.trim(),
      release_date: form.release_date,
      url: form.url.trim(),
      original_url: form.original_url.trim(),
      images: form.images.filter(Boolean),
      price: form.price,
      quantity: Number(form.quantity) || 0,
    }

    try {
      await onSave(payload)
      onClose()
    } catch (err) {
      setLocalError(err.message || "Impossible de créer le produit")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-2xl backdrop-blur">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Ajouter un produit upcyclé</h3>
          <p className="text-xs text-slate-500">
            Décrivez votre création (ex : baskets transformées en pot de fleurs). Pensez à ajouter au moins une image.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 px-6 py-6 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Marque
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                placeholder="ex : Upcycle Lab"
                required
              />
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Modèle
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                placeholder="ex : Basket pot de fleurs"
                required
              />
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                placeholder="Matériaux, démarche écologique, histoire de la pièce..."
              />
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Couleur principale
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                placeholder="ex : Vert sauge"
              />
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Date de mise en circulation
              <input
                type="date"
                name="release_date"
                value={form.release_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Lien d’inspiration (facultatif)
              <input
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                placeholder="Page projet, article, etc."
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">Images (3 max)</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((index) => {
                  const imageSrc = form.images[index]
                  return (
                    <div
                      key={index}
                      className="flex h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-3 text-center text-xs text-slate-500"
                    >
                      {imageSrc ? (
                        <>
                          <img
                            src={imageSrc}
                            alt={`Prévisualisation ${index + 1}`}
                            className="h-20 w-full rounded-xl object-cover shadow-inner"
                          />
                          <div className="flex gap-2">
                            <label className="cursor-pointer rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-400">
                              Changer
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                  const file = event.target.files?.[0]
                                  handleImageFileChange(index, file || null)
                                  event.target.value = ""
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-500 hover:border-rose-300"
                              onClick={() => handleImageReset(index)}
                            >
                              Retirer
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-500 hover:border-pasapas-blue">
                          <span>Choisir une image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              handleImageFileChange(index, file || null)
                              event.target.value = ""
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-[11px] text-slate-400">Formats acceptés : JPG, PNG, WebP. Taille conseillée &lt; 2&nbsp;Mo.</p>
            </div>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Prix (en €)
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                placeholder="ex : 120"
                required
              />
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Quantité disponible
              <input
                type="number"
                min="0"
                step="1"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                required
              />
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Taille (ou format)
              <input
                type="text"
                name="size"
                value={form.size}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                placeholder="ex : Taille unique, 42, petit format..."
              />
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Public cible
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
              >
                <option value="Unisexe">Unisexe</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Mixte">Mixte</option>
              </select>
            </label>

            <label className="block space-y-1 text-sm font-medium text-slate-700">
              Lien source (facultatif)
              <input
                type="url"
                name="original_url"
                value={form.original_url}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-pasapas-blue focus:outline-none"
                placeholder="Lien vers la paire d'origine, tutoriel, etc."
              />
            </label>
          </div>

          {(localError || error) && (
            <div className="md:col-span-2 rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-2 text-sm text-rose-600">
              {localError || error}
            </div>
          )}

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-400"
              disabled={saving || uploading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-full bg-pasapas-blue px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
            >
              {saving || uploading ? "Création…" : "Ajouter le produit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ProductDetailModal({ product, onClose, onDelete = () => {}, deleteLoading = false, deleteError = null }) {
  if (!product) return null

  const infoItems = [
    { label: "Référence", value: product.parent_id },
    { label: "Couleur", value: product.color },
    { label: "Prix", value: product.price },
    { label: "Genre", value: product.gender },
    { label: "Catégorie", value: product.category },
    { label: "Date de sortie", value: product.release_date },
    { label: "État", value: product.condition },
  ].filter((item) => item.value)

  const stockValue =
    product.stock ?? product.quantity ?? product.available_quantity ?? product.inventory

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Produit</p>
              <h3 className="text-lg font-semibold text-slate-900">
                {product.brand} · {product.model}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700"
            >
              Fermer
            </button>
          </header>

          <div className="grid gap-6 px-6 py-6 md:grid-cols-[220px,1fr]">
            <div className="flex items-center justify-center">
              <img
                src={product.img_1}
                alt={product.model}
                className="h-48 w-48 rounded-2xl object-cover shadow-xl"
              />
            </div>

            <div className="space-y-4">
              {product.description && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm text-slate-600 shadow-inner">
                  {product.description}
                </div>
              )}

              {infoItems.length > 0 && (
                <dl className="grid gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</dt>
                      <dd className="text-sm font-medium text-slate-800">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                {product.size && (
                  <span className="rounded-full border border-slate-200 px-3 py-1">Taille : {product.size}</span>
                )}
                {stockValue !== undefined && stockValue !== null && (
                  <span className="rounded-full border border-slate-200 px-3 py-1">Stock : {stockValue}</span>
                )}
              </div>
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <div className="text-xs text-slate-400">
              Créé le {product.created_at ? new Date(product.created_at).toLocaleString("fr-FR") : "—"}
            </div>
            <div className="flex flex-wrap gap-2">
              {deleteError && (
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600">
                  {deleteError}
                </span>
              )}
              <button
                type="button"
                onClick={() => onDelete(product.parent_id)}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? "Suppression…" : "Supprimer ce produit"}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
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

function ProductsSection({ products, onSelectProduct = () => {}, onCreateProduct = () => {} }) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Mes produits en vente</h2>
          <span className="rounded-full bg-pasapas-blue/10 px-3 py-1 text-xs font-semibold text-pasapas-blue">
            {products?.length || 0} produit{products?.length > 1 ? "s" : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={onCreateProduct}
          className="inline-flex items-center gap-2 rounded-full border border-pasapas-blue/30 bg-white px-4 py-2 text-xs font-semibold text-pasapas-blue shadow-sm transition hover:border-pasapas-blue/60 hover:bg-pasapas-blue/10"
        >
          <span className="hidden sm:inline">Ajouter un produit</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pasapas-blue text-white">+</span>
        </button>
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
            className="flex cursor-pointer gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-700 shadow-sm transition hover:border-pasapas-blue/50 hover:bg-white"
            onClick={() => onSelectProduct(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelectProduct(product)
              }
            }}
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
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewOrderId, setPreviewOrderId] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(null)
  const [previewDetails, setPreviewDetails] = useState(null)
  const [detailsCache, setDetailsCache] = useState({})
  const [statusUpdating, setStatusUpdating] = useState(null)
  const [orderStatusUpdating, setOrderStatusUpdating] = useState(false)
  const [orderFilter, setOrderFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [productPreview, setProductPreview] = useState(null)
  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const [createProductError, setCreateProductError] = useState(null)
  const [productDeleteError, setProductDeleteError] = useState(null)
  const [productDeleteLoading, setProductDeleteLoading] = useState(false)

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

  useEffect(() => {
    if (!productPreview && !showCreateProduct) return

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (productPreview) setProductPreview(null)
        if (showCreateProduct) setShowCreateProduct(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [productPreview, showCreateProduct])

  useEffect(() => {
    if (!showCreateProduct) {
      setCreateProductError(null)
    }
  }, [showCreateProduct])

  useEffect(() => {
    if (!productPreview) {
      setProductDeleteError(null)
    }
  }, [productPreview])

  const handleSaveProfile = async (payload) => {
    const response = await updateSellerProfile(payload)
    if (!response?.success) {
      throw new Error(response?.message || "Échec de la mise à jour")
    }
    setProfile(response.data)
    setSuccessMessage("Profil vendeur mis à jour ✅")
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  const handleUpdateOrderStatus = async (orderId, statut) => {
    if (!orderId || !statut) return
    if (previewDetails?.statut === statut) return
    try {
      setOrderStatusUpdating(true)
      const response = await updateSellerOrderStatus(orderId, statut)
      if (!response?.success) {
        throw new Error(response?.message || "Échec de la mise à jour du statut de commande")
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id_commande === orderId ? { ...order, statut } : order,
        ),
      )

      setPreviewDetails((prev) => (prev ? { ...prev, statut } : prev))

      setDetailsCache((prev) =>
        prev[orderId]
          ? {
              ...prev,
              [orderId]: {
                ...prev[orderId],
                statut,
              },
            }
          : prev,
      )

      setSuccessMessage("Statut de la commande mis à jour ✅")
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du statut de la commande")
    } finally {
      setOrderStatusUpdating(false)
    }
  }

  const handleCreateProduct = async (payload) => {
    try {
      setIsCreatingProduct(true)
      setCreateProductError(null)

      const [img1 = "", img2 = "", img3 = ""] = payload.images || []

      const productResponse = await createSellerProduct({
        url: payload.url || null,
        brand: payload.brand,
        model: payload.model,
        description: payload.description || null,
        release_date: payload.release_date || null,
        color: payload.color || null,
        img_1: img1 || null,
        img_2: img2 || null,
        img_3: img3 || null,
      })

      if (!productResponse?.success || !productResponse.data) {
        throw new Error(productResponse?.message || "Impossible de créer le produit")
      }

      const quantity = Number.isFinite(payload.quantity) ? Number(payload.quantity) : 0
      const priceValue = Number(payload.price)
      const formattedPrice = Number.isFinite(priceValue) ? `${priceValue.toFixed(2)}€` : "0€"
      const sanitizedSize = (payload.size || "").trim().slice(0, 10) || "TU"
      const sanitizedGender = (payload.gender || "").trim().slice(0, 10) || "Unisexe"

      const stockResponse = await createSellerProductStock(productResponse.data.parent_id, {
        original_url: payload.original_url || payload.url || null,
        size: sanitizedSize,
        price: formattedPrice,
        availability: quantity > 0 ? "Disponible" : "Indisponible",
        quantity,
        gender: sanitizedGender,
      })

      if (!stockResponse?.success || !stockResponse.data) {
        throw new Error(stockResponse?.message || "Impossible de créer le stock")
      }

      const enrichedProduct = {
        ...productResponse.data,
        stock: stockResponse.data.quantity,
        size: stockResponse.data.size,
        gender: stockResponse.data.gender,
        price: stockResponse.data.price,
      }

      setProducts((prev) => [enrichedProduct, ...prev])
      setSuccessMessage("Produit ajouté avec succès ✅")
      setTimeout(() => setSuccessMessage(null), 4000)
      return enrichedProduct
    } catch (err) {
      const message = err.message || "Erreur lors de la création du produit"
      setCreateProductError(message)
      throw err
    } finally {
      setIsCreatingProduct(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!productId || productDeleteLoading) return

    const confirmed = window.confirm(
      "Voulez-vous supprimer ce produit ? Cette action est irréversible.",
    )
    if (!confirmed) return

    try {
      setProductDeleteLoading(true)
      setProductDeleteError(null)

      const response = await deleteSellerProduct(productId)
      if (!response?.success) {
        throw new Error(response?.message || "Impossible de supprimer le produit")
      }

      setProducts((prev) => prev.filter((product) => Number(product.parent_id) !== Number(productId)))
      setProductPreview(null)
      setSuccessMessage("Produit supprimé ✅")
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err) {
      setProductDeleteError(err.message || "Erreur lors de la suppression du produit")
    } finally {
      setProductDeleteLoading(false)
    }
  }

  const handleDeleteProfile = async () => {
    try {
      setIsDeleting(true)
      const response = await deleteSellerProfile({
        confirmDeletion: true,
        confirmationCode: DELETE_CONFIRMATION_CODE,
      })

      if (!response?.success) {
        throw new Error(response?.message || "Échec de la suppression du profil")
      }

      setSuccessMessage("Compte vendeur supprimé. Déconnexion en cours…")
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("token")
          window.location.href = "/"
        }
      }, 1500)
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression du profil")
    } finally {
      setIsDeleting(false)
      setConfirmDelete(false)
    }
  }

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => normalizeStatusText(order.statut).includes("finalise"))
      .reduce((sum, order) => sum + Number(order.montant_total || 0), 0)
  }, [orders])

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    const normalizedQuery = normalizeStatusText(search)

    return orders.filter((order) => {
      const statusBucket = getOrderStatusBucket(order.statut)
      const matchesFilter = orderFilter === "all" || statusBucket === orderFilter

      const statusNormalized = normalizeStatusText(order.statut)
      const dateString = order.date_commande
        ? new Date(order.date_commande).toLocaleDateString("fr-FR").toLowerCase()
        : ""

      const matchesSearch =
        !query ||
        order.id_commande?.toString().includes(query) ||
        dateString.includes(query) ||
        (normalizedQuery && statusNormalized.includes(normalizedQuery))

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

        <ProductsSection
          products={products}
          onSelectProduct={setProductPreview}
          onCreateProduct={() => setShowCreateProduct(true)}
        />

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

        <div className="rounded-3xl border border-rose-100 bg-rose-50/70 p-6 text-center text-sm text-rose-600 shadow-inner">
          <p className="font-semibold">Supprimer mon profil vendeur</p>
          <p className="mt-1 text-rose-500">
            Cette action supprimera définitivement vos informations vendeur, vos produits associés et votre accès à cet espace.
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

        {showCreateProduct && (
          <NewProductModal
            onClose={() => {
              setShowCreateProduct(false)
              setCreateProductError(null)
            }}
            onSave={handleCreateProduct}
            saving={isCreatingProduct}
            error={createProductError}
          />
        )}

        {productPreview && (
          <ProductDetailModal
            product={productPreview}
            onClose={() => setProductPreview(null)}
            onDelete={handleDeleteProduct}
            deleteLoading={productDeleteLoading}
            deleteError={productDeleteError}
          />
        )}

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
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">Statut de la commande</p>
                        <p className="text-sm font-semibold text-slate-900">{previewDetails.statut || "—"}</p>
                      </div>
                      <select
                        value={previewDetails.statut || ""}
                        onChange={(event) => handleUpdateOrderStatus(previewOrderId, event.target.value)}
                        disabled={orderStatusUpdating}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-inner focus:border-pasapas-blue focus:outline-none disabled:cursor-not-allowed"
                      >
                        {orderStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

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
