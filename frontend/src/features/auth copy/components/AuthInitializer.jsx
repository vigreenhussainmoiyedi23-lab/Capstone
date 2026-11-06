import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  authStart,
  authFailure,
  authSuccess,
} from "../authSlice.js";

import {
  GetUserAPI,
  refreshTokenApi,
} from "../service/api.service.js";

const REFRESH_INTERVAL = 14 * 60 * 1000;

// Prevent duplicate refresh cycles in React StrictMode.
let authPromise = null;

const restoreSession = async () => {
  if (!authPromise) {
    authPromise = (async () => {
      const tokenResponse = await refreshTokenApi();

      const userResponse = await GetUserAPI();

      return {
        user: userResponse.user,
        accessToken: tokenResponse.accessToken,
      };
    })().finally(() => {
      authPromise = null;
    });
  }

  return authPromise;
};

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    let refreshTimer;

    const initialize = async (initial = false) => {
      if (initial) {
        dispatch(authStart());
      }

      try {
        const { user, accessToken } = await restoreSession();

        if (!mounted) return;

        dispatch(authSuccess({ user, accessToken }));

        // Schedule the next rotation only after successful restoration.
        clearTimeout(refreshTimer);

        refreshTimer = setTimeout(() => {
          initialize(false);
        }, REFRESH_INTERVAL);
      } catch (error) {
        if (!mounted) return;

        console.error("Authentication lifecycle error:", error);

        dispatch(authFailure("Session expired"));

        clearTimeout(refreshTimer);
      }
    };

    initialize(true);

    return () => {
      mounted = false;
      clearTimeout(refreshTimer);
    };
  }, [dispatch]);

  return null;
};

export default AuthInitializer;