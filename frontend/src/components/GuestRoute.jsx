import { Navigate, Outlet } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export default function GuestRoute() {

    const { user, loading: authLoading } = useContext(AuthContext);

    if (authLoading) {
        return <div>Loading...</div>
    }

    if (user && user.role !== 'guest') {
        return <Navigate to="/boards" />
    } else {
        return <Outlet />
    }
}