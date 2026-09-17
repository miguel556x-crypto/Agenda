import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const RegisterForm = ({ irALogin }) => {
  const { register } = useContext(AuthContext);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [rol, setRol] = useState("USUARIO");

  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const validarFormulario = () => {
    const err = {};
    const nombreClean = nombre.trim();
    const correoClean = correo.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombreClean) err.nombre = "El nombre es obligatorio";
    if (!correoClean) {
      err.correo = "El correo es obligatorio";
    } else if (!regexEmail.test(correoClean)) {
      err.correo = "Formato de correo inválido";
    }

    if (!password) {
      err.password = "La contraseña es obligatoria";
    } else if (password.length < 4) {
      err.password = "Mínimo 4 caracteres";
    }

    if (!confirmarPassword) {
      err.confirmarPassword = "Debe confirmar la contraseña";
    } else if (password !== confirmarPassword) {
      err.confirmarPassword = "Las contraseñas no coinciden";
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setExito("");

    if (!validarFormulario()) return;

    setCargando(true);
    const res = await register({
      nombre: nombre.trim(),
      correo: correo.trim(),
      password,
      rol
    });
    setCargando(false);

    if (res.success) {
      setExito("¡Registro exitoso! Redirigiendo al inicio de sesión...");
      setTimeout(() => irALogin(), 1500);
    } else {
      setErrores({ correo: res.message });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 mt-6 sm:mt-10 animate-fade-in">
      <div className="glass-card rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-teal-500/25 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Crear Cuenta</h2>
          <p className="text-sm text-slate-500 mt-1">Regístrate para agendar o administrar citas</p>
        </div>

        {exito && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-slide-down">
            <svg className="w-4 h-4 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{exito}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.nombre ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
                placeholder="Ej. Sofía Martínez"
              />
            </div>
            {errores.nombre && <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.nombre}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico
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
                  errores.correo ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
                placeholder="sofia@correo.com"
              />
            </div>
            {errores.correo && <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.correo}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.password ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
                placeholder="••••••••"
              />
              {errores.password && <span className="text-rose-500 text-[11px] font-medium mt-1 inline-block">{errores.password}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirmar
              </label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.confirmarPassword ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
                placeholder="••••••••"
              />
              {errores.confirmarPassword && <span className="text-rose-500 text-[11px] font-medium mt-1 inline-block">{errores.confirmarPassword}</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipo de Rol
            </label>
            <div className="relative">
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none appearance-none transition-all"
              >
                <option value="USUARIO">👤 Usuario Estándar (Visualizar citas)</option>
                <option value="ADMIN">🛡️ Administrador (Crear, confirmar y gestionar)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 active:scale-[0.98] shadow-md shadow-emerald-600/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {cargando ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <span>Registrar Cuenta</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            ¿Ya tienes una cuenta registrada?{" "}
            <button
              type="button"
              onClick={irALogin}
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition ml-1"
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
