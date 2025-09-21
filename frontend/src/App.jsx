import { useState } from "react"
import SignupForm from "@/components/auth/SignupForm"
import ClientProfileForm from "@/components/client/ClientProfileForm"
import SellerProfileForm from "@/components/seller/SellerProfileForm"

export default function App() {
  // Étapes possibles : signup → client → vendeur
  const [step, setStep] = useState("signup") 
  const [role, setRole] = useState(null)

  // Callback après signup
  const handleSignupSuccess = (userRole) => {
    setRole(userRole)
    if (userRole === 3) {
      setStep("client")
    } else if (userRole === 2) {
      setStep("vendeur")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pasapas-lightgreen p-6">
      {step === "signup" && <SignupForm onSignupSuccess={handleSignupSuccess} />}
      {step === "client" && <ClientProfileForm />}
      {step === "vendeur" && <SellerProfileForm />}
    </div>
  )
}
