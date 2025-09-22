import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { register as registerApi } from "@/services/authService"
import { useAuth } from "@/context/AuthContext"
import { jwtDecode } from "jwt-decode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterForm() {
  const [role, setRole] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from || null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    data.role = parseInt(role) // 2 = vendeur, 3 = client

    try {
      const res = await registerApi(data)
      if (res.token) {
        login(res.token)
        const decoded = jwtDecode(res.token)

        if (from) {
          navigate(from, { replace: true })
          return
        }

        if (decoded.role === 3) navigate("/client/dashboard")
        if (decoded.role === 2) navigate("/seller/dashboard")
      }
    } catch {
      setError("Impossible de créer le compte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-800">Créer un compte</h2>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="exemple@mail.com" />
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required placeholder="********" />
      </div>

      <div>
        <Label>Vous êtes :</Label>
        <RadioGroup value={role} onValueChange={setRole} className="flex gap-4 mt-2">
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer ${
            role === "3" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}>
            <RadioGroupItem value="3" className="hidden" />
            Client
          </label>
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer ${
            role === "2" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}>
            <RadioGroupItem value="2" className="hidden" />
            Vendeur
          </label>
        </RadioGroup>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition rounded-md font-medium"
      >
        {loading ? "Création..." : "S’inscrire"}
      </Button>
    </form>
  )
}
