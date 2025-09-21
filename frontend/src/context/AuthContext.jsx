import { createContext, useContext, useState } from "react"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [user, setUser] = useState(token ? jwtDecode(token) : null)

  const login = (jwt) => {
    localStorage.setItem("token", jwt)
    setToken(jwt)
    setUser(jwtDecode(jwt))
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user, // contient { id, role }
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
