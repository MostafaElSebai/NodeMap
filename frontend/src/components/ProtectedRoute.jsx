import { Navigate, Outlet } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export default function ProtectedRoute() {

    const { user, loading: authLoading } = useContext(AuthContext);

    if (authLoading) {
        return <div>Loading...</div>
    }

    if (user) {
        return <Outlet />
    } else {
        return <Navigate to="/login" />
    }
}