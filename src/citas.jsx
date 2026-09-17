import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { getCitasApi, crearCitaApi, eliminarCitaApi, actualizarCitaApi } from "./services/citasApi";
import { CitaCard } from "./components/CitaCard";
import { FormularioCita } from "./components/FormularioCita";

export const CitasPage = () => {
  const { usuarioActual } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODAS");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajePermiso, setMensajePermiso] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargando, setCargando] = useState(true);

  const esAdmin = usuarioActual?.rol === "ADMIN";

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    setCargando(true);
    const data = await getCitasApi();
    setCitas(data || []);
    setCargando(false);
  };

  const verificarPermiso = () => {
    if (!esAdmin) {
      setMensajePermiso("No tienes permisos para realizar esta acción.");
      setTimeout(() => setMensajePermiso(""), 3500);
      return false;
    }
    return true;
  };

  const handleCrearCita = async (nuevaCita) => {
    if (!verificarPermiso()) return;

    const creada = await crearCitaApi(nuevaCita);
    setCitas([...citas, creada]);
    setMostrarFormulario(false);
    setMensajeExito("Cita registrada exitosamente en el sistema.");
    setTimeout(() => setMensajeExito(""), 3500);
  };

  const handleEliminarCita = async (id) => {
    if (!verificarPermiso()) return;

    await eliminarCitaApi(id);
    setCitas(citas.filter((c) => c.id !== id));
    setMensajeExito("Cita eliminada correctamente.");
    setTimeout(() => setMensajeExito(""), 3500);
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    if (!verificarPermiso()) return;

    const citaTarget = citas.find((c) => c.id === id);
    if (citaTarget) {
      const actualizada = await actualizarCitaApi(id, { ...citaTarget, estado: nuevoEstado });
      setCitas(citas.map((c) => (c.id === id ? actualizada : c)));
      setMensajeExito(`Estado de la cita actualizado a "${nuevoEstado}".`);
      setTimeout(() => setMensajeExito(""), 3000);
    }
  };

  // Contadores para métricas
  const totalCitas = citas.length;
  const countConfirmadas = citas.filter((c) => c.estado === "Confirmada").length;
  const countPendientes = citas.filter((c) => c.estado === "Pendiente").length;
  const countCanceladas = citas.filter((c) => c.estado === "Cancelada").length;

  // Filtrado de citas
  const busquedaClean = busqueda.trim().toLowerCase();
  const citasFiltradas = citas.filter((cita) => {
    const coincideEstado = filtroEstado === "TODAS" || cita.estado === filtroEstado;
    if (!coincideEstado) return false;

    if (!busquedaClean) return true;

    return (
      cita.cliente?.toLowerCase().includes(busquedaClean) ||
      cita.correo?.toLowerCase().includes(busquedaClean) ||
      cita.servicio?.toLowerCase().includes(busquedaClean) ||
      cita.estado?.toLowerCase().includes(busquedaClean) ||
      cita.profesional?.toLowerCase().includes(busquedaClean)
    );
  });

  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Panel de Control
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 capitalize">
            Gestión de Citas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 capitalize">{fechaHoy}</p>
        </div>

        {esAdmin && (
          <div>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all text-sm"
            >
              {mostrarFormulario ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cerrar Formulario</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nueva Cita</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards / Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* Total Citas */}
        <button
          type="button"
          onClick={() => setFiltroEstado("TODAS")}
          className={`text-left glass-card p-4 rounded-2xl border transition-all ${
            filtroEstado === "TODAS" 
              ? "ring-2 ring-indigo-500 border-indigo-200 shadow-md shadow-indigo-500/10" 
              : "hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Citas</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCitas}</p>
          <span className="text-[11px] text-indigo-600 font-medium mt-0.5 inline-block">Todas registradas</span>
        </button>

        {/* Confirmadas */}
        <button
          type="button"
          onClick={() => setFiltroEstado("Confirmada")}
          className={`text-left glass-card p-4 rounded-2xl border transition-all ${
            filtroEstado === "Confirmada" 
              ? "ring-2 ring-emerald-500 border-emerald-200 shadow-md shadow-emerald-500/10" 
              : "hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Confirmadas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{countConfirmadas}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 inline-block">Listas para atender</span>
        </button>

        {/* Pendientes */}
        <button
          type="button"
          onClick={() => setFiltroEstado("Pendiente")}
          className={`text-left glass-card p-4 rounded-2xl border transition-all ${
            filtroEstado === "Pendiente" 
              ? "ring-2 ring-amber-500 border-amber-200 shadow-md shadow-amber-500/10" 
              : "hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pendientes</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{countPendientes}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-0.5 inline-block">Requieren confirmación</span>
        </button>

        {/* Canceladas */}
        <button
          type="button"
          onClick={() => setFiltroEstado("Cancelada")}
          className={`text-left glass-card p-4 rounded-2xl border transition-all ${
            filtroEstado === "Cancelada" 
              ? "ring-2 ring-rose-500 border-rose-200 shadow-md shadow-rose-500/10" 
              : "hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Canceladas</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">{countCanceladas}</p>
          <span className="text-[11px] text-rose-600 font-medium mt-0.5 inline-block">Anuladas / Descartadas</span>
        </button>
      </div>

      {/* Notifications / Feedback Banners */}
      {mensajePermiso && (
        <div className="glass-card bg-rose-50/90 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 font-semibold flex items-center justify-between gap-3 animate-slide-down">
          <div className="flex items-center gap-2.5 text-sm">
            <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{mensajePermiso}</span>
          </div>
          <button onClick={() => setMensajePermiso("")} className="text-rose-400 hover:text-rose-600">✕</button>
        </div>
      )}

      {mensajeExito && (
        <div className="glass-card bg-emerald-50/90 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-6 font-semibold flex items-center justify-between gap-3 animate-slide-down">
          <div className="flex items-center gap-2.5 text-sm">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{mensajeExito}</span>
          </div>
          <button onClick={() => setMensajeExito("")} className="text-emerald-400 hover:text-emerald-600">✕</button>
        </div>
      )}

      {/* Formulario para agregar cita */}
      {mostrarFormulario && esAdmin && (
        <FormularioCita
          onAgregarCita={handleCrearCita}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {/* Search Bar & Filters Section */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-slate-200/80 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente, correo, servicio o profesional..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros de Estado (Pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: "TODAS", label: "Todas", count: totalCitas },
            { key: "Pendiente", label: "Pendientes", count: countPendientes },
            { key: "Confirmada", label: "Confirmadas", count: countConfirmadas },
            { key: "Cancelada", label: "Canceladas", count: countCanceladas }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFiltroEstado(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filtroEstado === tab.key
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filtroEstado === tab.key
                    ? "bg-slate-700 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Citas Grid or Empty State */}
      {cargando ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-500">Cargando citas...</p>
        </div>
      ) : citasFiltradas.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto mt-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No se encontraron citas</h3>
          <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
            {busqueda || filtroEstado !== "TODAS"
              ? "No hay resultados con los filtros actuales. Prueba cambiando el término de búsqueda o el estado."
              : "No hay citas registradas en la agenda actualmente."}
          </p>
          {(busqueda || filtroEstado !== "TODAS") && (
            <button
              onClick={() => {
                setBusqueda("");
                setFiltroEstado("TODAS");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
            >
              Restablecer Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {citasFiltradas.map((cita) => (
            <CitaCard
              key={cita.id}
              cita={cita}
              onEliminar={handleEliminarCita}
              onCambiarEstado={handleCambiarEstado}
              esAdmin={esAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};
