import axios from "axios";

const API = "http://localhost:4000/api/predict";

export const getPrediction = async (symbol) => {
  try {
    const res = await axios.get(`${API}/${symbol}`);
    return res.data;
  } catch (err) {
    console.error("Prediction error:", err.message);
    return null;
  }
};