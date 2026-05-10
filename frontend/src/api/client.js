import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL;

// Route through the current origin by default so Vercel can proxy to the backend.
const baseURL = configuredApiUrl || '/api';

export const api = axios.create({
  baseURL
});
