// src/lib/axios.ts
import axios from 'axios';
import { auth } from '@/firebase';
import { getIdToken } from 'firebase/auth';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // or your prod API
});

instance.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await getIdToken(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
