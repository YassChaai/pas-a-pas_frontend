import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-pasapas-blue">
              Pas à Pas
            </Link>
          </div>

          {/* Liens centre (desktop) */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-pasapas-blue transition"
            >
              Sneakers
            </Link>
            <Link
              to="/sneakart"
              className="text-gray-700 hover:text-pasapas-blue transition"
            >
              SneakArt
            </Link>
          </div>

          {/* Actions droite */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-pasapas-blue transition" />
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 3 && (
                  <Link to="/client/dashboard">
                    <Button className="bg-pasapas-green hover:bg-green-700 text-white">
                      Espace Client
                    </Button>
                  </Link>
                )}
                {user?.role === 2 && (
                  <Link to="/seller/dashboard">
                    <Button className="bg-pasapas-green hover:bg-green-700 text-white">
                      Espace Vendeur
                    </Button>
                  </Link>
                )}
                {user?.role === 1 && (
                  <Link to="/admin/dashboard">
                    <Button className="bg-pasapas-green hover:bg-green-700 text-white">
                      Admin
                    </Button>
                  </Link>
                )}
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
                  <Button className="bg-pasapas-blue hover:bg-blue-700 text-white">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Burger menu (mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-pasapas-blue"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-pasapas-blue"
            >
              Sneakers
            </Link>
            <Link
              to="/sneakart"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-pasapas-blue"
            >
              SneakArt
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-pasapas-blue"
            >
              Panier
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-pasapas-blue"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-pasapas-blue"
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
