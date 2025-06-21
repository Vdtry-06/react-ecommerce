import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import ApiService from "../service/ApiService"

export const ProtectedRoute = ({ element: Component }) => {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    setIsAuthenticated(ApiService.isAuthenticated())

    const handleAuthChange = () => {
      setIsAuthenticated(ApiService.isAuthenticated())
    }

    window.addEventListener("authChanged", handleAuthChange)

    return () => {
      window.removeEventListener("authChanged", handleAuthChange)
    }
  }, [])

  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? Component : <Navigate to="/login" replace state={{ from: location }} />
}

export const AdminRoute = ({ element: Component }) => {
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    setIsAdmin(ApiService.isAdmin())

    const handleAuthChange = () => {
      setIsAdmin(ApiService.isAdmin())
    }

    window.addEventListener("authChanged", handleAuthChange)

    return () => {
      window.removeEventListener("authChanged", handleAuthChange)
    }
  }, [])

  if (isAdmin === null) return <div>Loading...</div> 

  return isAdmin ? Component : <Navigate to="/" replace state={{ from: location }} />
}

