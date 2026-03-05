import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user?.id) {
    config.headers.userId = user.id;
  }

  return config;
});

export default api;