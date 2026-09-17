import React, { createContext, useState, useEffect } from "react";
import { loginApi, registerApi } from "../services/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const sesionGuardada = localStorage.getItem("sesion_usuario");
    if (sesionGuardada) {
      try {
        setUsuarioActual(JSON.parse(sesionGuardada));
      } catch (e) {
        localStorage.removeItem("sesion_usuario");
      }
    }
    setCargando(false);
  }, []);

  const login = async (correo, password) => {
    const res = await loginApi(correo, password);
    if (res.success) {
      setUsuarioActual(res.user);
      localStorage.setItem("sesion_usuario", JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (datosUsuario) => {
    const res = await registerApi(datosUsuario);
    return res;
  };

  const logout = () => {
    setUsuarioActual(null);
    localStorage.removeItem("sesion_usuario");
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, login, register, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};
