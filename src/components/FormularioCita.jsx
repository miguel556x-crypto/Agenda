import React, { useState } from "react";

export const FormularioCita = ({ onAgregarCita, onCancelar }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    correo: "",
    servicio: "",
    fecha: "",
    hora: "",
    profesional: "",
    estado: "Pendiente"
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: "" });
    }
  };

  const validar = () => {
    const err = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.cliente.trim()) err.cliente = "El nombre del cliente es obligatorio";
    if (!formData.correo.trim()) {
      err.correo = "El correo electrónico es obligatorio";
    } else if (!regexEmail.test(formData.correo.trim())) {
      err.correo = "Formato de correo no válido";
    }
    if (!formData.servicio.trim()) err.servicio = "El servicio a solicitar es obligatorio";
    if (!formData.fecha) err.fecha = "Seleccione una fecha";
    if (!formData.hora) err.hora = "Indique un horario (ej. 10:00 AM)";
    if (!formData.profesional.trim()) err.profesional = "El profesional responsable es obligatorio";

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    onAgregarCita({
      ...formData,
      cliente: formData.cliente.trim(),
      correo: formData.correo.trim(),
      servicio: formData.servicio.trim(),
      profesional: formData.profesional.trim()
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 border border-slate-200/90 mb-8 animate-slide-down relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>

      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 leading-tight">Registrar Nueva Cita</h3>
            <p className="text-xs text-slate-500">Completa la información del cliente y la reserva</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancelar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          title="Cerrar formulario"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cliente */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cliente
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Nombre completo"
                className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.cliente ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {errores.cliente && <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.cliente}</span>}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.correo ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {errores.correo && <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.correo}</span>}
          </div>

          {/* Servicio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Servicio
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <input
                type="text"
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                placeholder="Ej. Corte de Cabello, Consulta, Manicura..."
                className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.servicio ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {errores.servicio && <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.servicio}</span>}
          </div>

          {/* Profesional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Profesional / Responsable
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input
                type="text"
                name="profesional"
                value={formData.profesional}
                onChange={handleChange}
                placeholder="Nombre del especialista"
                className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.profesional ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {errores.profesional && <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.profesional}</span>}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Fecha de la Cita
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 rounded-xl bg-slate-50/50 border text-sm text-slate-800 focus:bg-white focus:outline-none transition-all ${
                errores.fecha ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              }`}
            />
            {errores.fecha && <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.fecha}</span>}
          </div>

          {/* Hora */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hora / Turno
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                placeholder="Ej. 10:00 AM o 16:30"
                className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errores.hora ? "border-rose-400 focus:ring-2 focus:ring-rose-500/20" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {errores.hora && <span className="text-rose-500 text-xs font-medium mt-1 inline-block">{errores.hora}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100 mt-4">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 active:scale-95 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Guardar Cita
          </button>
        </div>
      </form>
    </div>
  );
};
