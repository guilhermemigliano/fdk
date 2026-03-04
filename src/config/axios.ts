import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject({
      message: error.response.data.error,
      status: error.response.status,
    });
  },
);
