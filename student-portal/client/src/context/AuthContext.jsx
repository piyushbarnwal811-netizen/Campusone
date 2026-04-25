import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authService.getMe();
        setUser(me);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const data = await authService.login(payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const requestRegisterOtp = async (payload) => {
    const data = await authService.requestRegisterOtp(payload);
    return data;
  };

  const requestPasswordResetOtp = async (payload) => {
    const data = await authService.requestPasswordResetOtp(payload);
    return data;
  };

  const resetPasswordWithOtp = async (payload) => {
    const data = await authService.resetPasswordWithOtp(payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      requestRegisterOtp,
      requestPasswordResetOtp,
      resetPasswordWithOtp,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
