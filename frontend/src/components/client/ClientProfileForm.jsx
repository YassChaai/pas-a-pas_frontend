import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createClientProfile } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ClientProfileForm() {
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
      await createClientProfile(data)
      navigate("/client/dashboard")
    } catch (err) {
      setError("Impossible d’enregistrer le profil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Profil client</h2>

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
        <Label>Genre</Label>
        <div className="flex justify-center gap-6">
          <label><input type="radio" name="genre" value="Homme" required /> Homme</label>
          <label><input type="radio" name="genre" value="Femme" required /> Femme</label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse">Adresse</Label>
        <Input id="adresse" name="adresse" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code_postal">Code postal</Label>
          <Input id="code_postal" name="code_postal" required />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="ville">Ville</Label>
          <Input id="ville" name="ville" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input id="telephone" name="telephone" required />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white">
        {loading ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
