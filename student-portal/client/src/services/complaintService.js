import api from "./api";

export const createComplaint = async (payload) => {
  const { data } = await api.post("/complaints", payload);
  return data;
};

export const getMyComplaints = async () => {
  const { data } = await api.get("/complaints/my");
  return data;
};

export const getAllComplaints = async () => {
  const { data } = await api.get("/complaints");
  return data;
};

export const updateComplaint = async (id, payload) => {
  const { data } = await api.put(`/complaints/${id}`, payload);
  return data;
};
