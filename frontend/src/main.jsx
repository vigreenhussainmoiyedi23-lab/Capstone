import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.jsx";
import AuthInitializer from "./features/auth/components/AuthInitializer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
