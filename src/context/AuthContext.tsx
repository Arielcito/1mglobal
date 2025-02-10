'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/services/api';

interface User {
  id: string;
  email: string;
  token: string;
  name?: string;
  image?: string;
  isAdmin?: boolean;
  emailVerified?: string | null;
  username?: string;
  fullName?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUserState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const saveUserToStorage = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

const getUserFromStorage = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

const clearUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserState = useCallback(async (token: string) => {
    try {
      const userId = Cookies.get('userId');
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }, []);

  const refreshUserState = async () => {
    const token = Cookies.get('token');
    if (token && user) {
      const userData = await fetchUserState(token);
      if (userData) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        saveUserToStorage(updatedUser);
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('token');
      const email = Cookies.get('userEmail');
      const storedUser = getUserFromStorage();
      
      if (storedUser && token) {
        setUser(storedUser);
        setIsLoading(false);
        return;
      }
      
      if (token && email) {
        const userData = await fetchUserState(token);
        console.log("userData", userData)
        if (userData) {
          const newUser = { id: userData.id, token, email, ...userData };
          setUser(newUser);
          saveUserToStorage(newUser);
        } else {
          Cookies.remove('token');
          Cookies.remove('userEmail');
          Cookies.remove('userId');
          clearUserFromStorage();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchUserState]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/auth/login', { email, password });
      console.log("response", response)
      const data = response.data;
      const userData = data.user;
      
      // Configuración mejorada de cookies para producción
      const cookieOptions = {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
        expires: 7,
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_DOMAIN : undefined
      };

      Cookies.set('token', data.token, cookieOptions);
      Cookies.set('userEmail', email, cookieOptions);
      Cookies.set('userId', userData.id, cookieOptions);

      const userToSet = {
        id: userData.id,
        email: userData.email,
        token: data.token,
        name: userData.name,
        isAdmin: userData.isAdmin,
        image: userData.image,
        emailVerified: userData.emailVerified,
        username: userData.username,
        fullName: userData.fullName,
        createdAt: userData.createdAt
      };

      setUser(userToSet);
      saveUserToStorage(userToSet);
      
      setIsLoading(false);
      router.push('/dashboard');
      
      // Esperamos un momento y luego recargamos
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error: unknown) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = useCallback(() => {
    // Primero limpiamos el estado y el almacenamiento
    setUser(null);
    clearUserFromStorage();
    
    // Limpiamos todas las cookies relacionadas con la sesión
    Cookies.remove('token', { path: '/' });
    Cookies.remove('userEmail', { path: '/' });
    Cookies.remove('userId', { path: '/' });
    
    // Redirigimos después de un pequeño delay para asegurar la limpieza
    setTimeout(() => {
      window.location.href = '/auth/signin';
    }, 100);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 