import api from "./api";

export const markAttendance = async (payload) => {
  const { data } = await api.post("/attendance", payload);
  return data;
};

export const getMyAttendance = async () => {
  const { data } = await api.get("/attendance/my");
  return data;
};

export const getAllAttendance = async (params) => {
  const { data } = await api.get("/attendance", { params });
  return data;
};

export const updateAttendance = async (id, payload) => {
  const { data } = await api.put(`/attendance/${id}`, payload);
  return data;
};

export const deleteAttendance = async (id) => {
  const { data } = await api.delete(`/attendance/${id}`);
  return data;
};
