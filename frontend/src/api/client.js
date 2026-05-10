import axios from 'axios';

// Always use the current origin proxy so deployment env vars cannot point back to the old backend.
const baseURL = '/api';

export const api = axios.create({
  baseURL
});
