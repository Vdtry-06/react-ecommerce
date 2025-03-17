import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../static/style/address.css';

const AddressPage = () => {

    const [address, setAddress] = useState({
        country: '',
        city: '',
        // district: '',
        ward: '',
        street: '',
        houseNumber: ''
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {

        if (location.pathname === '/edit-address' || location.pathname === '/add-address') {
            fetchUserInfo();
        }
    }, [location.pathname]);


    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getMyInfo();
            // console.log("User info response:", response); // Debug API response
    
            if (response?.data?.address) {
                setAddress(response.data.address);
            } else {
                setAddress({
                    country: '',
                    city: '',
                    // district: '',
                    ward: '',
                    street: '',
                    houseNumber: ''
                });
            }
        } catch (error) {
            // console.error("Error fetching user info:", error);
            setError(error.response?.data?.message || error.message || "Unable to fetch user information");
        }
    };
    

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(location.pathname === '/edit-address') {
                await ApiService.updateAddress(address);
            } else {
                await ApiService.addAddress(address);
            }
            navigate("/account");
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Failed to save/update address");
        }
    };

    return(
        <div className="address-page">
            <h2>{location.pathname === '/edit-address' ? 'Edit Address' : "Add Addresss"}</h2>
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <label>
                    Country:
                    <input type="text"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    required/>
                </label>
                <label>
                    City:
                    <input type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required/>
                </label>
                {/* <label>
                    District:
                    <input type="text"
                    name="district"
                    value={address.district}
                    onChange={handleChange}
                    required/>
                </label> */}

                <label>
                    Ward:
                    <input type="text"
                    name="ward"
                    value={address.ward}
                    onChange={handleChange}
                    required/>
                </label>

                <label>
                    Street:
                    <input type="text"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    required/>
                </label>

                <label>
                    House Number:
                    <input type="text"
                    name="houseNumber"
                    value={address.houseNumber}
                    onChange={handleChange}
                    required/>
                </label>
                <button type="submit">{location.pathname === '/edit-address' ? 'Edit Address' : "Save Addresss"}</button>

            </form>
        </div>
    )
}

export default AddressPage;