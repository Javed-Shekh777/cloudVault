// // src/components/ProtectedRoute.jsx
// import { useEffect, useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { refreshAuth } from "../redux/authSlice";

// export default function ProtectedRoute() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { user, accessToken } = useSelector((s) => s.auth);
//   const [checking, setChecking] = useState(true);
//   const isMounted = useRef(true);



//   useEffect(() => {
//   isMounted.current = true;

//   const tryRefresh = async () => {
//     try {
//       console.log("Trying to refresh...");
//       await dispatch(refreshAuth()).unwrap(); 
//     } catch (err) {
//       console.log("Refresh failed:", err);

//       // ❗ If backend said user not found → local storage clear
//       localStorage.removeItem("user");
//       localStorage.removeItem("accessToken");
//     } finally {
//       if (isMounted.current) setChecking(false);
//     }
//   };

//   tryRefresh();

//   return () => (isMounted.current = false);
// }, []);


//   if (checking) {
//     return (
//       <div className="p-8 text-center">
//         <div className="inline-block animate-pulse text-lg">Checking authentication...</div>
//       </div>
//     );
//   }

//   // If after checking we still don't have auth -> redirect to login
//   if (!accessToken || !user) {
//     // send current location so user can be redirected back after login if you implement that
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return <Outlet />;
// }



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


// src/components/ProtectedRoute.jsx
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { verifyMe, refreshAuth, logoutAsync, logout } from "../redux/authSlice";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const isMounted = useRef(true);

  const { user, accessToken, isLoggingOut } = useSelector((s) => s.auth);
  console.log(isLoggingOut);

useEffect(() => {
  if (isLoggingOut) {
    setChecking(false); // skip verify/refresh
    return;
  }

  const doVerify = async () => {
    try {
      if (accessToken) {
        await dispatch(verifyMe()).unwrap();
        if (isMounted.current) setChecking(false);
        return;
      }

      await dispatch(refreshAuth()).unwrap();
      await dispatch(verifyMe()).unwrap();
    } catch (err) {
      dispatch(logout());
      console.log("Auth verification failed:", err);
    } finally {
      if (isMounted.current) setChecking(false);
    }
  };

  doVerify();
}, [accessToken, dispatch, isLoggingOut]);



  // useEffect(() => {
  //   if (isLoggingOut) {
  //     setChecking(false); // skip verify/refresh
  //     return;
  //   }
  //   isMounted.current = true;


  //   const doVerify = async () => {
  //     try {
  //       // If we already have an access token -> verify it by calling /auth/me
  //       if (accessToken) {
  //         console.log("Inside verfy me");
  //         console.log(localStorage.getItem("accessToken"));
  //         console.log(localStorage.getItem("user"));

  //         await dispatch(verifyMe()).unwrap();
  //         if (isMounted.current) setChecking(false);
  //         return;
  //       }

  //       // no access token -> try refresh (server reads cookie)
  //       await dispatch(refreshAuth()).unwrap();
  //       console.log("Inside verfy after refresh me");


  //       // refresh ok -> now call /auth/me to get user
  //       await dispatch(verifyMe()).unwrap();

  //     } catch (err) {
  //       // any failure -> clear auth and let route redirect to login
  //       dispatch(logout());
  //       console.log("Auth verification failed:", err);
  //     } finally {
  //       if (isMounted.current) setChecking(false);
  //     }
  //   };

  //   doVerify();

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, [accessToken, isLoggingOut]);

  if (checking) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-pulse text-lg">Checking authentication...</div>
      </div>
    );
  }

  // after checking, if still no auth -> redirect to login
  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
