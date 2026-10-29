import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export async function login({ email, password }) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function register({ name, email, password }) {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
}

export async function logout() {
  const response = await api.post('/auth/logout');
  return response.data;
}

export async function getMe() {
  const response = await api.get('/auth/get-me');
  return response.data;
}

export default api;
