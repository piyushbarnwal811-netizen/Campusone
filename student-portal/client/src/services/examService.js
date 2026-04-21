import api from "./api";

export const getMyExams = async () => {
  const { data } = await api.get("/exams/my");
  return data;
};

export const getAllExams = async () => {
  const { data } = await api.get("/exams");
  return data;
};

export const createExam = async (payload) => {
  const { data } = await api.post("/exams", payload);
  return data;
};

export const updateExam = async (id, payload) => {
  const { data } = await api.put(`/exams/${id}`, payload);
  return data;
};

export const deleteExam = async (id) => {
  const { data } = await api.delete(`/exams/${id}`);
  return data;
};
