import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://edu-master-psi.vercel.app",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default axiosInstance;
