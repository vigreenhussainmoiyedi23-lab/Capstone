import { useNavigate } from "react-router-dom";
import { useDispatch as useAppDispatch } from "react-redux";
import {
  authFailure,
  authStart,
  authSuccess,
  registerSuccess,
  setAccessToken,
  setUser,
} from "../authSlice.js";
import {
  LoginAPI,
  LogoutAPI,
  RegisterAPI,
  GetUserAPI,
  verifyOtpApi,
  refreshTokenApi,
  resendOtpApi,
  forgotPasswordApi,
  ResetPasswordApi,
  changePasswordApi,
} from "../service/api.service.js";
import { toastSettings } from "../../../utils/ToastSettings.js";
import { toast } from "react-toastify";

function isERROR(error) {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  );
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loginHandler = async (data) => {
    dispatch(authStart());
    const id = toast.loading("Logging in...");
    try {
      const response = await LoginAPI(data);
      dispatch(
        authSuccess({ user: response.user, accessToken: response.accessToken }),
      );
      toast.update(id, {
        render: "Login Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      navigate("/");
    } catch (error) {
      if (isERROR(error)) {
        dispatch(authFailure(error?.response?.data.message));
        toast.update(id, {
          render: error?.response?.data.message,
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };

  const verifyOtpHandler = async (data) => {
    dispatch(authStart());
    const id = toast.loading("Verifying otp...");
    try {
      const response = await verifyOtpApi(data);
      dispatch(
        authSuccess({ user: response.user, accessToken: response.accessToken }),
      );
      toast.update(id, {
        render: "registered Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      navigate("/");
    } catch (error) {
      if (isERROR(error)) {
        dispatch(authFailure(error?.response?.data.message));
        toast.update(id, {
          render: error?.response?.data.message,
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  const RegisterHandler = async (data) => {
    dispatch(authStart());
    const id = toast.loading("Registering...");
    try {
      await RegisterAPI(data);
      dispatch(registerSuccess());
      toast.update(id, {
        render: "Registration Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      navigate("/verifyOtp");
    } catch (error) {
      if (isERROR(error)) {
        dispatch(authFailure(error?.response?.data.message));
        toast.update(id, {
          render: error?.response?.data.message || "",
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  const LogoutHandler = async () => {
    dispatch(authStart());
    const id = toast.loading("Logging out...");
    try {
      await LogoutAPI();
      toast.update(id, {
        render: "Logout Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      navigate("/login");
    } catch (error) {
      if (isERROR(error)) {
        dispatch(authFailure(error?.response?.data.message));
        toast.update(id, {
          render: error?.response?.data.message || "",
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  const GetMeHandler = async () => {
    dispatch(authStart());
    try {
      const response = await GetUserAPI();
      dispatch(setUser(response.user));
    } catch (error) {
      dispatch(authFailure(""));
    }
  };

  const refreshTokenHand1er = async () => {
    dispatch(authStart());
    try {
      const response = await refreshTokenApi();
      dispatch(setAccessToken(response.accessToken));
      let refreshTimer = null;

      const scheduleRefresh = () => {
        if (refreshTimer) clearTimeout(refreshTimer);

        refreshTimer = setTimeout(
          () => {
            refreshTokenHand1er();
          },
          10 * 60 * 1000,
        );
      };

      scheduleRefresh();
      await GetMeHandler();
    } catch (error) {
      dispatch(authFailure(""));
    }
  };
  const resendOtpHandler = async () => {
    dispatch(authStart());
    try {
      await resendOtpApi();
    } catch (error) {
      dispatch(authFailure(""));
    }
  };
  const forgotHandler = async (data) => {
    dispatch(authStart());
    const id = toast.loading("sending Reset Link To your Email...");
    try {
      await forgotPasswordApi(data);
      toast.update(id, {
        render: "Sent Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
    } catch (error) {
      if (isERROR(error)) {
        dispatch(authFailure(error?.response?.data.message));
        toast.update(id, {
          render: error?.response?.data.message || "",
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  const resetPasswordHandler = async (data) => {
    dispatch(authStart());
    const id = toast.loading("resetting your password...");
    try {
      const response = await ResetPasswordApi(data);
      toast.update(id, {
        render: "password Reset Successfully",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      return response;
    } catch (error) {
      if (isERROR(error)) {
        dispatch(authFailure(error?.response?.data.message));
        toast.update(id, {
          render: error?.response?.data.message || "",
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  const changePasswordHandler = async (data) => {
    dispatch(authStart());
    const id = toast.loading("changing your password...");
    try {
      const response = await changePasswordApi(data);
      toast.update(id, {
        render: "password changed Successfully",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      return response;
    } catch (error) {
      if (isERROR(error)) {
        dispatch(authFailure(error?.response?.data.message));
        toast.update(id, {
          render: error?.response?.data.message || "",
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  return {
    loginHandler,
    RegisterHandler,
    LogoutHandler,
    GetMeHandler,
    verifyOtpHandler,
    refreshTokenHand1er,
    resendOtpHandler,
    forgotHandler,
    resetPasswordHandler,
    changePasswordHandler,
    
  };
};
