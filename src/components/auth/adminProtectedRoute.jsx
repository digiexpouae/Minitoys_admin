// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get("adminToken");
    const [user, setuser] = useState(() => {
        const auth = localStorage.getItem('auth')
        const userRole = JSON.parse(auth)
        return userRole
    })


    if (!token) {
        localStorage.removeItem("auth")

        return <Navigate to="/signin" replace />; // ✅ Component, not function
    }

    if (user.role == "vendor") {
        return <Navigate to="/" replace />;
    }


    return children;
};

export default ProtectedRoute;