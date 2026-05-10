import axios from 'axios';

const renderApiUrl = 'https://expert-session-booking-system-1.onrender.com';
const configuredApiUrl = import.meta.env.VITE_API_URL;

const baseURL =
  configuredApiUrl && !configuredApiUrl.includes('expert-booking-backend-phi.vercel.app')
    ? configuredApiUrl
    : renderApiUrl;

export const api = axios.create({
  baseURL
});
