import api from "./api";

export const getIndices = () => api.get("/indices");
