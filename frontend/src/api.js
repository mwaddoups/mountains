import axios from "axios";
import Cookies from "universal-cookie";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/"
});

api.interceptors.request.use(config => {
  const cookies = new Cookies()
  const token = cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config
}, error => {
  return Promise.reject(error);
})

export default api; 