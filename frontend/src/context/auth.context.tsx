import React from 'react';
import { API_BASE_URL } from '../config';

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
  loading: false,
});

const JWT_LOCAL_STORAGE_KEY = 'jwt_token';

export function getJwtToken() {
  return localStorage.getItem(JWT_LOCAL_STORAGE_KEY);
}

function setJwtToken(token: string) {
  localStorage.setItem(JWT_LOCAL_STORAGE_KEY, token);
}

function removeJwtToken() {
  localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const signIn = async (email: string, password: string) => {
    await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setJwtToken(res.data);
          setIsAuthenticated(true);
        }
      });
  };

  const clearAuthState = () => {
    setLoading(false);
    setIsAuthenticated(false);
    removeJwtToken();
  };

  const verifyToken = async (token: string) => {
    setLoading(true);

    fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setJwtToken(res.data);
          setIsAuthenticated(true);
          setLoading(false);
        } else {
          clearAuthState();
        }
      })
      .catch(clearAuthState);
  };

  React.useEffect(() => {
    const token = getJwtToken();
    if (!token) {
      clearAuthState();
    } else {
      verifyToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        signOut: clearAuthState,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
