import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../shared/pages/HomePage.jsx";
import Dashboard from "../shared/pages/Dashboard.jsx";
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

const NotFound = () => (
  <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center p-4 text-center">
    <h1 className="text-6xl font-bold font-serif text-gold mb-2">404</h1>
    <h2 className="text-xl font-sans mb-4">Page Not Found</h2>
    <a
      href="/"
      className="px-5 py-2 rounded-xl bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 text-sm transition-all"
    >
      Return to Home
    </a>
  </div>
);

const routesConfiguration = [
  {
    path: "/",
    element: <CommonLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        ),
      },
      {
        path: "/chats/:projectId",
        element: (
          <ProtectedLayout>
            <ChatboxPreview />
          </ProtectedLayout>
        ),
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
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routesConfiguration);
