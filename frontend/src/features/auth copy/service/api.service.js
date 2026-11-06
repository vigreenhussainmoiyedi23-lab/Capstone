import api from "../../../app/axios";

export const LoginAPI = async (data) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const RegisterAPI = async (data) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};

export const LogoutAPI = async () => {
  const response = await api.get("/api/auth/logout");
  return response.data;
};

export const GetUserAPI = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

export const verifyOtpApi = async (otp) => {
  const response = await api.post("/api/auth/verify-otp", { otp });
  return response.data;
};

export const resendOtpApi = async () => {
  const response = await api.get("/api/auth/resend-otp");
  return response.data;
};

export const refreshTokenApi = async () => {
  const response = await api.get("/api/auth/refresh-token");
  return response.data;
};
export const forgotPasswordApi = async (data) => {
  const response = await api.post("/api/auth/forget-password", data);
  return response.data;
};
export const ResetPasswordApi = async (data) => {
  const response = await api.post(
    `/api/auth/reset-password/${data.token}`,
    data,
  );
  return response.data;
};
export const changePasswordApi = async (data) => {
  const response = await api.post(`/api/auth/change-password`, data);
  return response.data;
};
