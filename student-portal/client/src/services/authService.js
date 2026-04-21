import api from "./api";

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
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
