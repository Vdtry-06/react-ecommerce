"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { setToken } from "../service/localStorage"
import "../../static/style/oauth-callback.css"

const OAuthCallbackPage = () => {
  const [status, setStatus] = useState("Processing")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")
    const role = params.get("role")

    if (!token) {
      setStatus("Error: No authentication token received")
      return
    }

    setToken(token)
    localStorage.setItem("isLoggedIn", "true")
    if (role) {
      localStorage.setItem("role", role)
    }

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ token, role }, "*")
      window.close()
    } else {
      setStatus("Success! Redirecting...")
      setTimeout(() => {
        navigate("/")
      }, 1500)
    }
  }, [location, navigate])

  return (
    <div className="oauth-callback-container">
      <div className="oauth-callback-box">
        <h2 className="oauth-callback-title">{status.startsWith("Error") ? "Login Error" : "Login Processing"}</h2>

        <div className="oauth-callback-message">{status}</div>

        {!status.startsWith("Error") && <div className="oauth-callback-spinner"></div>}
      </div>
    </div>
  )
}

export default OAuthCallbackPage

