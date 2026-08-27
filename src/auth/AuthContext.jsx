import { createContext, useContext, useMemo, useState } from 'react';
import { apiFetch } from '../api/client.js';

const AuthContext = createContext(null);

function readUser() {
  try { return JSON.parse(localStorage.getItem('examHubUser')); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  async function login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('examHubToken', data.token);
    localStorage.setItem('examHubUser', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('examHubToken');
    localStorage.removeItem('examHubUser');
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
