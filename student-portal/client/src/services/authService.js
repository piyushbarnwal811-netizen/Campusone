import api from "./api";

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const requestRegisterOtp = async (payload) => {
  const { data } = await api.post("/auth/register/request-otp", payload);
  return data;
};

export const requestPasswordResetOtp = async (payload) => {
  const { data } = await api.post("/auth/password/request-otp", payload);
  return data;
};

export const resetPasswordWithOtp = async (payload) => {
  const { data } = await api.post("/auth/password/reset", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const getStudents = async () => {
  const { data } = await api.get("/auth/students");
  return data;
};

export const createAdmin = async (payload) => {
  const { data } = await api.post("/auth/create-admin", payload);
  return data;
};

export const createFaculty = async (payload) => {
  const { data } = await api.post("/auth/create-faculty", payload);
  return data;
};
