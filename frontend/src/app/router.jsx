import { createBrowserRouter, Outlet } from "react-router-dom";
import ChatboxPreview from "../shared/pages/ChatboxPreview.jsx";
import Login from "../features/auth copy/pages/Login.jsx";
import Register from "../features/auth copy/pages/Register.jsx";
import VerifyOtp from "../features/auth copy/pages/VerifyOtp.jsx";
import GoogleSuccess from "../features/auth copy/pages/GoogleSuccess.jsx";
import ForgotPassword from "../features/auth copy/pages/ForgotPassword.jsx";
import ChangePassword from "../features/auth copy/pages/ChangePassword.jsx";
import ResetPassword from "../features/auth copy/pages/ResetPassword.jsx";
import ProtectedLayout from "../layouts/ProtectedLayout.jsx";
// 1. Define dummy components for demonstration
const Layout = () => (
  <div>
    <h1>Main Layout Dashboard</h1>
    {/* The Outlet component renders whatever child route is active */}
    <Outlet />
  </div>
);
const Profile = () => <h2>User Profile</h2>;
const Settings = () => <h2>Account Settings</h2>;
const NotFound = () => <h2>404 - Page Not Found</h2>;

// 2. Create the route object array structure
const routesConfiguration = [
  {
    path: "/", // Parent route path
    element: <Layout />, // Shared parent layout component
    children: [
      // Nested child routes array
      {
        path: `/chats/:projectId`, // Matches the parent path exactly ("/")
        element: <ChatboxPreview />,
      },
      {
        path: "profile", // Relative path resolves to "/profile"
        element: <Profile />,
      },
      {
        path: "settings", // Relative path resolves to "/settings"
        element: <Settings />,
      },
      /* --- Auth Routes --- */
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verifyOtp",
        element: <VerifyOtp />,
      },
      {
        path: "/auth/google/success",
        element: <GoogleSuccess />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/change-password",
        element: (
          <ProtectedLayout>
            <ChangePassword />
          </ProtectedLayout>
        ),
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*", // Catch-all route for unmatched URLs
    element: <NotFound />,
  },
];

// 3. Initialize the router object
export const router = createBrowserRouter(routesConfiguration);
