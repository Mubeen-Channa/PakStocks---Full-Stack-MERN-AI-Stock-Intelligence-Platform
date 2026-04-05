import axios from "axios";

const ML_API = "http://localhost:5000/predict";

export async function getTrendPrediction(features) {
  try {
    const response = await axios.post(ML_API, features);
    return response.data.trend;
  } catch (error) {
    console.error("ML Service Error:", error.message);
    return "UNKNOWN";
  }
}