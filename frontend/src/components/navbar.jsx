import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, ShoppingCart, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import logo from "@/assets/pas-a-pas.svg"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const { isAuthenticated, logout, user } = useAuth()
  const { cart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) =>
    location.pathname === path
      ? "text-pasapas-blue font-semibold"
      : "text-gray-700 hover:text-pasapas-blue transition"

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const term = params.get("search") || ""
    setSearchValue(term)
    setIsSearchOpen(Boolean(term))
  }, [location.search])

  const mobileLinkClasses = (path) => {
    const baseClasses = "block px-3 py-2 rounded-md text-base font-medium text-gray-700"
    if (!path) {
      return `${baseClasses} hover:bg-pasapas-blue hover:text-white`
    }

    return location.pathname === path
      ? `${baseClasses} bg-pasapas-blue text-white`
      : `${baseClasses} hover:bg-pasapas-blue hover:text-white`
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setIsOpen(false)

    const query = searchValue.trim()
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`)
    } else {
      navigate("/")
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" aria-label="Retour à l'accueil">
              <img src={logo} alt="Pas à Pas" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Liens centre (desktop) */}
          <div className="hidden md:flex flex-1 justify-center items-center min-h-[40px]">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative w-64">
                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Rechercher une marque ou un modèle"
                  autoFocus
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pasapas-blue"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-pasapas-blue"
                  aria-label="Rechercher"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/" className={isActive("/")}>
                  Sneakers
                </Link>
                <Link to="/sneakart" className={isActive("/sneakart")}>
                  SneakArt
                </Link>
              </div>
            )}
          </div>

          {/* Actions droite */}
          <div className="hidden md:flex items-center space-x-6 relative">
            <div className="flex items-center space-x-4 mr-6">
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen((prev) => !prev)
                  if (isSearchOpen && !searchValue) {
                    navigate("/")
                  }
                }}
                className="p-2 text-gray-700 hover:text-pasapas-blue"
                aria-label={isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-pasapas-blue transition" />
                {cart && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
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
                  className="border-pasapas-blue text-pasapas-blue hover:bg-blue-50"
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
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Rechercher une marque ou un modèle"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pasapas-blue"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-pasapas-blue"
                aria-label="Rechercher"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={mobileLinkClasses("/")}
            >
              Sneakers
            </Link>
            <Link
              to="/sneakart"
              onClick={() => setIsOpen(false)}
              className={mobileLinkClasses("/sneakart")}
            >
              SneakArt
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className={mobileLinkClasses("/cart")}
            >
              Panier {cart && cart.length > 0 && `(${cart.length})`}
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 3 && (
                  <Link
                    to="/client/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={mobileLinkClasses("/client/dashboard")}
                  >
                    Espace Client
                  </Link>
                )}
                {user?.role === 2 && (
                  <Link
                    to="/seller/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={mobileLinkClasses("/seller/dashboard")}
                  >
                    Espace Vendeur
                  </Link>
                )}
                {user?.role === 1 && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={mobileLinkClasses("/admin/dashboard")}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClasses("/login")}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClasses("/register")}
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
