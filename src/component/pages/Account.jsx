import React, { use, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../static/style/account.css';
import Pagination from "../common/Pagination";

const Account = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [ currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {

        fetchUserInfo();
    }, []);
    const fetchUserInfo = async () => {

        try {
            const response = await ApiService.getMyInfo();
            setUserInfo(response.data);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch user info');
        }
    }

    if (!userInfo) {
        return <div>Loading...</div>
    }

    const handleAddressClick = () => {
        navigate(userInfo.address ? '/edit-address' : '/add-address');
    }

    const orderItemList = userInfo.orders || [];

    const totalPages = Math.ceil(userInfo.orders.length / itemsPerPage);
    const paginatedOrders = userInfo.orders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div className="profile-page">
            <h2>Welcome {userInfo.username}</h2>

            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    <p><strong>Name: </strong>{userInfo.username}</p>
                    <p><strong>Email: </strong>{userInfo.email}</p>
                    <p><strong>First Name: </strong>{userInfo.firstName}</p>
                    <p><strong>Last Name: </strong>{userInfo.lastName}</p>
                    <img src={userInfo.imageUrl} alt={userInfo.name} className="user-image"/>
                    <p><strong>DateOfBirth: </strong>{userInfo.dateOfBirth}</p>

                    {/* <p><strong>Phone Number: </strong>{userInfo.phoneNumber}</p> */}

                    <div>
                        <h3>Address</h3>
                        {userInfo.address ? (
                            <div>
                                <p><strong>Country: </strong>{userInfo.address.country}</p>
                                <p><strong>City: </strong>{userInfo.address.city}</p>
                                <p><strong>District: </strong>{userInfo.address.district}</p>
                                <p><strong>Ward: </strong>{userInfo.address.ward}</p>
                                <p><strong>Street: </strong>{userInfo.address.street}</p>
                                <p><strong>HouseNumber: </strong>{userInfo.address.houseNumber}</p>
                                
                            </div>
                        ) : (
                            <p>No Address information available</p>
                        )}
                        <button className="profile-button" onClick={handleAddressClick}>
                            {userInfo.address ? "Edit Address" : "Add Address"}
                        </button>
                    </div>
                    <h3>Order History</h3>
                    <ul>
                        {paginatedOrders.map(order => (
                            <li key={order.id}>
                                <p><strong>Order ID: </strong>{order.id}</p>
                                <p><strong>Status: </strong>{order.status}</p>
                                <p><strong>Total Price: </strong>{order.totalPrice.toFixed(2)}</p>
                                <ul>
                                    {order.orderLines.map(item => (
                                        <li key={item.id}>
                                            <p><strong>Quantity: </strong>{item.quantity}</p>
                                            <p><strong>Price: </strong>{item.price.toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page)=> setCurrentPage(page)}/>
                </div>
            )}
        </div>
    )
}

export default Account;