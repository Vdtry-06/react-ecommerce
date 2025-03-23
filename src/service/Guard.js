import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";

export const ProtectedRoute = ({element: Component}) => {
    const location = useLocation();
    return ApiService.isAuthenticated() ? (
        Component
    ) : (
        <Navigate to="/login" replace state={{from: location}} />
    );
};

export const AdminRoute = ({element: Component}) => {
    const location = useLocation();
    const [isAdmin, setIsAdmin] = React.useState(null);

    React.useEffect(() => {
        setIsAdmin(ApiService.isAdmin());
    }, []);

    if (isAdmin === null) return <div>Loading...</div>; // Đợi kiểm tra quyền

    return isAdmin ? Component : <Navigate to="/login" replace state={{from: location}} />;
};

