import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login as loginApi } from "@/services/authService"
import { useAuth } from "@/context/AuthContext"
import { jwtDecode } from "jwt-decode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await loginApi(data)
      if (res.token) {
        login(res.token)

        const decoded = jwtDecode(res.token)
        if (decoded.role === 3) navigate("/client/dashboard")
        if (decoded.role === 2) navigate("/seller/dashboard")
      }
    } catch {
      setError("Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="exemple@mail.com"
          className="mt-1 w-full"
        />
      </div>

      {/* Mot de passe */}
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="********"
          className="mt-1 w-full"
        />
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-pasapas-blue text-white hover:bg-blue-700 transition rounded-md font-medium"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  )
}
