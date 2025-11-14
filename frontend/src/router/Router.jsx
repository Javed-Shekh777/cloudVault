import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/RootLayout";
import Shared from "../pages/Shared";
import Trash from "../pages/Trash";
import Starred from "../pages/Starred";
import Search from "../pages/Search";
import MyDrive from "../pages/MyDrive";
import Recent from "../pages/Recent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // wraps header/sidebar
    children: [
      { index: true, element: <MyDrive /> },     // "/" shows MyDrive
      { path: "drive", element: <MyDrive /> },   // "/drive" also shows MyDrive
      { path: "shared", element: <Shared /> },
      { path: "trash", element: <Trash /> },
      { path: "starred", element: <Starred /> },
      { path: "search", element: <Search /> },
      { path: "recent", element: <Recent /> },
    ],
  },
]);

export default router;
