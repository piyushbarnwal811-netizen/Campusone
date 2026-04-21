import api from "./api";

export const getMyNotices = async () => {
  const { data } = await api.get("/notices/my");
  return data;
};

export const getAllNotices = async () => {
  const { data } = await api.get("/notices");
  return data;
};

export const createNotice = async (payload) => {
  const { data } = await api.post("/notices", payload);
  return data;
};

export const updateNotice = async (id, payload) => {
  const { data } = await api.put(`/notices/${id}`, payload);
  return data;
};

export const deleteNotice = async (id) => {
  const { data } = await api.delete(`/notices/${id}`);
  return data;
};
