import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-pasapas-blue">
            Pas à Pas
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-pasapas-blue">
              Accueil
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-pasapas-blue">
              Produits
            </Link>
            <Link to="/sneakart" className="text-gray-700 hover:text-pasapas-blue">
              SneakArt
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button className="bg-pasapas-green hover:bg-green-700 text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="text-gray-700 border-gray-300"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="bg-pasapas-blue hover:bg-blue-700 text-white">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    className="text-pasapas-blue border-pasapas-blue hover:bg-blue-50"
                  >
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={toggleMenu}
              className="block text-gray-700 hover:text-pasapas-blue"
            >
              Accueil
            </Link>
            <Link
              to="/products"
              onClick={toggleMenu}
              className="block text-gray-700 hover:text-pasapas-blue"
            >
              Produits
            </Link>
            <Link
              to="/sneakart"
              onClick={toggleMenu}
              className="block text-gray-700 hover:text-pasapas-blue"
            >
              SneakArt
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={toggleMenu}
                  className="block text-gray-700 hover:text-pasapas-blue"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className="w-full text-left text-gray-700 hover:text-red-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="block text-gray-700 hover:text-pasapas-blue"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="block text-gray-700 hover:text-pasapas-blue"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
