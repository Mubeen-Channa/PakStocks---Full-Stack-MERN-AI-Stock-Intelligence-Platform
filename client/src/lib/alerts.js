import api from "./api";

/* GET ALERTS */
export const getAlerts = async () => {
  const res = await api.get("/alerts");
  return res.data;
};

/* CREATE ALERT */
export const createAlert = async (data) => {
  const res = await api.post("/alerts", data);
  return res.data;
};

/* CHECK ALERTS */
export const checkAlerts = async () => {
  const res = await api.get("/alerts/check");
  return res.data;
};

/* DELETE ALERT */
export const deleteAlert = async (id) => {
  const res = await api.delete(`/alerts/${id}`);
  return res.data;
};

/* MARK TRIGGERED ALERTS AS SEEN */
export const markAlertsSeen = async () => {
  const res = await api.put("/alerts/mark-seen");
  return res.data;
};