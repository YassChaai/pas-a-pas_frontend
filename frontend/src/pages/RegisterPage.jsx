import RegisterForm from "@/components/auth/RegisterForm"

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Créer un compte</h1>
        <p className="text-sm text-gray-500 mt-1">
          Rejoignez Pas à Pas. Choisissez votre rôle pour personnaliser votre expérience.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Vous avez déjà un compte ? <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  )
}
