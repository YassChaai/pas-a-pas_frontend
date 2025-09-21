import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "@/services/authService"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterForm() {
  const [role, setRole] = useState(null) // 2 vendeur, 3 client
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    data.role = role

    try {
      const res = await register(data)
      if (res.token) {
        login(res.token) // stocke dans AuthContext

        if (role === 3) navigate("/client/profile")
        if (role === 2) navigate("/seller/profile")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d’inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      <div className="space-y-2">
        <Label>Vous êtes</Label>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setRole(3)}
            className={`px-5 py-2 rounded-md w-32 ${role === 3 ? "bg-blue-700 text-white" : "bg-gray-100"}`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setRole(2)}
            className={`px-5 py-2 rounded-md w-32 ${role === 2 ? "bg-blue-700 text-white" : "bg-gray-100"}`}
          >
            Vendeur
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={!role || loading} className="w-full bg-blue-700 text-white">
        {loading ? "Création..." : "Créer mon compte"}
      </Button>
    </form>
  )
}
