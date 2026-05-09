// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get("adminToken");

    if (!token) {
        localStorage.removeItem("auth")
        return <Navigate to="/signin" replace />; // ✅ Component, not function
    }

    return children;
};

export default ProtectedRoute;