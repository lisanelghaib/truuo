"use client";

import { authService, User } from "@/lib/auth";
import { stack } from "@/lib/stack";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    // Subscribe to Stack Auth user changes
    const unsubscribe = stack.onUserChange((stackUser) => {
      if (stackUser) {
        setUser({
          id: stackUser.id,
          primaryEmail: stackUser.primaryEmail,
          displayName: stackUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Initial user check
    const initialUser = stack.getUser();
    if (initialUser) {
      setUser({
        id: initialUser.id,
        primaryEmail: initialUser.primaryEmail,
        displayName: initialUser.displayName,
      });
    }
    setLoading(false);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.login(email, password);
      // User state will be updated automatically via the subscription
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await authService.createAccount(email, password, name);
      // User state will be updated automatically via the subscription
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      // User state will be updated automatically via the subscription
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
