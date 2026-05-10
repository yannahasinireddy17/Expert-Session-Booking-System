const STORAGE_KEY = 'expertBookingUser';

export const getStoredUser = () => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
};

export const setStoredUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('auth-changed'));
};

export const clearStoredUser = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('auth-changed'));
};

export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
