import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const LoginForm = ({ irARegistro }) => {
  const { login } = useContext(AuthContext);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  
  const [errores, setErrores] = useState({});
  const [cargandoEstado, setCargandoEstado] = useState(false);
  const [mensajeGeneral, setMensajeGeneral] = useState("");

  const validarCampos = () => {
    const err = {};
    const correoTrim = correo.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoTrim) {
      err.correo = "El correo electrónico es obligatorio";
    } else if (!regexEmail.test(correoTrim)) {
      err.correo = "Formato de correo no válido";
    }

    if (!password.trim()) {
      err.password = "La contraseña es obligatoria";
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeGeneral("");

    if (!validarCampos()) return;

    setCargandoEstado(true);
    const res = await login(correo.trim(), password);
    setCargandoEstado(false);

    if (!res.success) {
      setMensajeGeneral(res.message || "Credenciales incorrectas.");
    }
  };

  const rellenarCredenciales = (emailDemo, passDemo) => {
    setCorreo(emailDemo);
    setPassword(passDemo);
    setErrores({});
    setMensajeGeneral("");
  };

  return (
    <div className="max-w-md mx-auto px-4 mt-6 sm:mt-12 animate-fade-in">
      {/* Demo helper card */}
      <div className="mb-5 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
        <div className="flex items-center gap-1.5 font-bold mb-1.5 text-indigo-900">
          <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Acceso Rápido de Prueba (Clic para autocompletar):</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            type="button"
            onClick={() => rellenarCredenciales("admin@correo.com", "123")}
            className="text-left p-2 rounded-xl bg-white border border-indigo-200/70 hover:border-indigo-400 hover:shadow-sm active:scale-95 transition flex flex-col"
          >
            <span className="font-bold text-[11px] text-rose-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Administrador
            </span>
            <span className="text-[10px] text-slate-500">admin@correo.com</span>
          </button>
          <button
            type="button"
            onClick={() => rellenarCredenciales("juan@correo.com", "123")}
            className="text-left p-2 rounded-xl bg-white border border-indigo-200/70 hover:border-indigo-400 hover:shadow-sm active:scale-95 transition flex flex-col"
          >
            <span className="font-bold text-[11px] text-indigo-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Usuario Estándar
            </span>
            <span className="text-[10px] text-slate-500">juan@correo.com</span>
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="glass-card rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Iniciar Sesión</h2>
          <p className="text-sm text-slate-500 mt-1">Ingresa a tu cuenta de Agenda ADSO</p>
        </div>

        {mensajeGeneral && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-slide-down">
            <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{mensajeGeneral}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.correo 
                    ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" 
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
                placeholder="ejemplo@correo.com"
              />
            </div>
            {errores.correo && (
              <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.correo}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.password 
                    ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" 
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
              >
                {mostrarPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errores.password && (
              <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={cargandoEstado}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] shadow-md shadow-indigo-500/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {cargandoEstado ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Ingresando...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            ¿No tienes cuenta aún?{" "}
            <button
              type="button"
              onClick={irARegistro}
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition ml-1"
            >
              Crear una cuenta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
