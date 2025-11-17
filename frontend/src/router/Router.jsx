import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/RootLayout";
import Shared from "../pages/Shared";
import Trash from "../pages/Trash";
import Starred from "../pages/Starred";
import Search from "../pages/Search";
import MyDrive from "../pages/MyDrive";
import Recent from "../pages/Recent";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    element: <ProtectedRoute />, // ✅ protect everything inside
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <MyDrive /> },
          { path: "drive", element: <MyDrive /> },
          { path: "shared", element: <Shared /> },
          { path: "trash", element: <Trash /> },
          { path: "starred", element: <Starred /> },
          { path: "search", element: <Search /> },
          { path: "recent", element: <Recent /> },
          { path: "profile", element: <Profile /> },

        ],
      },
    ],
  },
]);

export default router;
