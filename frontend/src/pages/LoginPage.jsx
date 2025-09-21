import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="w-full max-w-md bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Connexion</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bienvenue. Entrez vos identifiants pour continuer.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Pas de compte ?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  )
}
