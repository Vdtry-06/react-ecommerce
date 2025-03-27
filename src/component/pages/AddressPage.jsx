"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import ApiService from "../../service/ApiService"
import "../../static/style/address.css"

const AddressPage = () => {
  const [address, setAddress] = useState({
    country: "",
    city: "",
    ward: "",
    street: "",
    houseNumber: "",
  })
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isEditMode = location.pathname === "/edit-address"

  // Form fields configuration
  const fields = [
    { name: "country", label: "Country" },
    { name: "city", label: "City" },
    { name: "ward", label: "Ward" },
    { name: "street", label: "Street" },
    { name: "houseNumber", label: "House Number" },
  ]

  useEffect(() => {
    if (isEditMode || location.pathname === "/add-address") {
      fetchUserInfo()
    }
  }, [location.pathname])

  const fetchUserInfo = async () => {
    try {
      const response = await ApiService.getMyInfo()
      setAddress(
        response?.data?.address || {
          country: "",
          city: "",
          ward: "",
          street: "",
          houseNumber: "",
        },
      )
    } catch (err) {
      setError("Unable to fetch user information")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await (isEditMode ? ApiService.updateAddress(address) : ApiService.addAddress(address))
      navigate("/account")
    } catch (err) {
      setError("Failed to save address information")
    }
  }

  return (
    <div className="address-page">
      <h2>{isEditMode ? "Edit Address" : "Add Address"}</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name}>
            {field.label}:
            <input type="text" name={field.name} value={address[field.name] || ""} onChange={handleChange} required />
          </label>
        ))}
        <button type="submit">{isEditMode ? "Update Address" : "Save Address"}</button>
      </form>
    </div>
  )
}

export default AddressPage

