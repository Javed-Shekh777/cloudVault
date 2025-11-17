// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; // or your auth context

export default function ProtectedRoute() {
    const { user } = useSelector(state => state.auth); // adjust based on your auth state
    // console.log(state);
    if (!user) {
        // not logged in → redirect to login
        return <Navigate to="/login" replace />;
    }

    // logged in → render children
    return <Outlet />;
}
