// src/components/ProtectedRoute.jsx
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { refreshAuth } from "../redux/authSlice";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, accessToken } = useSelector((s) => s.auth);
  const [checking, setChecking] = useState(true);
  const isMounted = useRef(true);

  // useEffect(() => {
  //   isMounted.current = true;
  //   const tryRefresh = async () => {
  //     // If we already have user+accessToken, no need to refresh right now
  //     if (accessToken && user) {
  //       if (isMounted.current) setChecking(false);
  //       return;
  //     }

  //     try {
  //       console.log('Attempting token refresh...');
  //       // Try refresh (backend reads httpOnly refresh cookie)
  //       const res = await dispatch(refreshAuth()).unwrap();
  //       console.log(res);
  //       // success -> auth state updated by slice
  //     } catch (err) {
  //       console.log(err);
  //       // ignore here; result will be redirect below
  //     } finally {
  //       if (isMounted.current) setChecking(false);
  //     }
  //   };

  //   tryRefresh();

  //   return () => {
  //     isMounted.current = false;
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // run once on mount

  useEffect(() => {
  isMounted.current = true;

  const tryRefresh = async () => {
    try {
      console.log("Trying to refresh...");
      await dispatch(refreshAuth()).unwrap(); 
    } catch (err) {
      console.log("Refresh failed:", err);

      // ❗ If backend said user not found → local storage clear
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    } finally {
      if (isMounted.current) setChecking(false);
    }
  };

  tryRefresh();

  return () => (isMounted.current = false);
}, []);


  if (checking) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-pulse text-lg">Checking authentication...</div>
      </div>
    );
  }

  // If after checking we still don't have auth -> redirect to login
  if (!accessToken || !user) {
    // send current location so user can be redirected back after login if you implement that
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
