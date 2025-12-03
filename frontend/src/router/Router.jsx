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
import FileExplorer from "../pages/FileExplorer";
import VerifyAccountOTP from "../pages/VerifyAccountOTP";
import EmailVerifiedPage from "../pages/EmailVerifiedPage";
import VerifyHandler from "../pages/VerifyHandler";
import LockedPage from "../pages/LockedPage";
import SettingsLayout from "../pages/settings/SettingsLayout";
import ProfileTab from "../pages/settings/ProfileTab";

const router = createBrowserRouter([
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
          { path: "locked", element: <LockedPage /> },
          //    <Route path="settings" element={<SettingsLayout />}>
          // <Route path="profile" element={<ProfileTab />} />
          // <Route path="security" element={<SecurityTab />} />
          // <Route path="notifications" element={<NotificationsTab />} />
          // <Route path="storage" element={<StorageTab />} />
          // <Route path="appearance" element={<AppearanceTab />} />
          // <Route path="privacy" element={<PrivacyTab />} />
          // <Route path="dev" element={<DeveloperTab />} />
          // <Route path="danger" element={<DangerTab />} />
          {
            path: "setting", element: <SettingsLayout />,
            // children: [
            //   { path: "profile", element: <ProfileTab /> },
            //   { path: "security", element: <SecurityTab /> },
            //   { path: "notifications", element: <NotificationsTab /> },
            //   { path: "storage", element: <StorageTab /> },
            //   { path: "appearance", element: <AppearanceTab /> },
            //   { path: "privacy", element: <PrivacyTab /> },
            //   { path: "dev", element: <DeveloperTab /> },
            //   { path: "danger", element: <DangerTab /> },


            // ]
          },


          { path: "file", element: <FileExplorer /> },

        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "verify-mail", element: <VerifyAccountOTP /> },
  { path: "verify-account", element: <EmailVerifiedPage /> },
  { path: "verify", element: <VerifyHandler /> },

]);

export default router;
