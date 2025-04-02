import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import ApiService from "../../service/ApiService"

export const ProtectedRoute = ({ element: Component }) => {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(ApiService.isAuthenticated())

    // Listen for auth changes
    const handleAuthChange = () => {
      setIsAuthenticated(ApiService.isAuthenticated())
    }

    window.addEventListener("authChanged", handleAuthChange)

    return () => {
      window.removeEventListener("authChanged", handleAuthChange)
    }
  }, [])

  if (isAuthenticated === null) {
    return <div>Loading...</div> // Show loading while checking auth
  }

  return isAuthenticated ? Component : <Navigate to="/login" replace state={{ from: location }} />
}

export const AdminRoute = ({ element: Component }) => {
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    // Check admin status
    setIsAdmin(ApiService.isAdmin())

    // Listen for auth changes
    const handleAuthChange = () => {
      setIsAdmin(ApiService.isAdmin())
    }

    window.addEventListener("authChanged", handleAuthChange)

    return () => {
      window.removeEventListener("authChanged", handleAuthChange)
    }
  }, [])

  if (isAdmin === null) return <div>Loading...</div> // Wait for admin check

  return isAdmin ? Component : <Navigate to="/" replace state={{ from: location }} />
}

