import axios from 'axios';

const baseURL = 'https://expert-session-booking-system-1.onrender.com';

export const api = axios.create({
  baseURL
});
