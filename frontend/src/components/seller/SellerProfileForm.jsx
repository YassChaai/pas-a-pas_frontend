import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createSellerProfile } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SellerProfileForm() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    try {
      await createSellerProfile(data)
      navigate("/seller/dashboard")
    } catch (err) {
      setError("Impossible d’enregistrer le profil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Profil vendeur</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" name="nom" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" name="prenom" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="raison_sociale">Raison sociale</Label>
        <Input id="raison_sociale" name="raison_sociale" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="siret">SIRET (facultatif)</Label>
          <Input id="siret" name="siret" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rib">RIB (facultatif)</Label>
          <Input id="rib" name="rib" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse_siege">Adresse du siège (facultatif)</Label>
        <Input id="adresse_siege" name="adresse_siege" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="ville">Ville</Label>
          <Input id="ville" name="ville" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code_postal">Code postal</Label>
          <Input id="code_postal" name="code_postal" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email_contact">Email contact (facultatif)</Label>
          <Input id="email_contact" name="email_contact" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telephone_contact">Téléphone contact (facultatif)</Label>
          <Input id="telephone_contact" name="telephone_contact" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white">
        {loading ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
