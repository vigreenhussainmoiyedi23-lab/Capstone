import { createBrowserRouter, Outlet } from "react-router-dom";
import ChatboxPreview from "../shared/pages/ChatboxPreview.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import VerifyOtp from "../features/auth/pages/VerifyOtp.jsx";
import GoogleSuccess from "../features/auth/pages/GoogleSuccess.jsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.jsx";
import ChangePassword from "../features/auth/pages/ChangePassword.jsx";
import ResetPassword from "../features/auth/pages/ResetPassword.jsx";
import ProtectedLayout from "../layouts/ProtectedLayout.jsx";
import CommonLayout from "../layouts/CommonLayout.jsx";
// 1. Define dummy components for demonstration

const NotFound = () => <h2>404 - Page Not Found</h2>;

// 2. Create the route object array structure
const routesConfiguration = [
  {
    path: "/", // Parent route path
    element: <CommonLayout />, // Shared parent layout component
    children: [
      // Nested child routes array
      {
        path: `/chats/:projectId`, // Matches the parent path exactly ("/")
        element: <ChatboxPreview />, // make this protectted
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
