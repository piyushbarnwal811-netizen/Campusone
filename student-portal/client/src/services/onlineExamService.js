import api from "./api";

export const getMyOnlineExamStatus = async () => {
  const { data } = await api.get("/online-exam/status");
  return data;
};

export const submitOnlineExam = async (payload) => {
  const { data } = await api.post("/online-exam/submit", payload);
  return data;
};

export const getOnlineExamPermissions = async () => {
  const { data } = await api.get("/online-exam/admin/permissions");
  return data;
};

export const grantOnlineExamPermission = async (studentId) => {
  const { data } = await api.put(`/online-exam/admin/grant/${studentId}`);
  return data;
};
