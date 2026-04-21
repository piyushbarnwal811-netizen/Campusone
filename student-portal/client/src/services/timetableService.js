import api from "./api";

export const getMyTimetable = async () => {
  const { data } = await api.get("/timetable/my");
  return data;
};

export const getAllTimetable = async () => {
  const { data } = await api.get("/timetable");
  return data;
};

export const createTimetable = async (payload) => {
  const { data } = await api.post("/timetable", payload);
  return data;
};

export const updateTimetable = async (id, payload) => {
  const { data } = await api.put(`/timetable/${id}`, payload);
  return data;
};

export const deleteTimetable = async (id) => {
  const { data } = await api.delete(`/timetable/${id}`);
  return data;
};
