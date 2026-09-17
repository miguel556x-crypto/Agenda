import React from "react";

export const CitaCard = ({ cita, onEliminar, onCambiarEstado, esAdmin }) => {
  const getStatusConfig = (estado) => {
    switch (estado) {
      case "Confirmada":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
          dot: "bg-emerald-500",
          borderTop: "from-emerald-500 to-teal-500",
          icon: "✓"
        };
      case "Cancelada":
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-200/80",
          dot: "bg-rose-500",
          borderTop: "from-rose-500 to-red-500",
          icon: "✕"
        };
      default:
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-200/80",
          dot: "bg-amber-500 animate-pulse",
          borderTop: "from-amber-500 to-orange-500",
          icon: "⏳"
        };
    }
  };

  const statusConfig = getStatusConfig(cita.estado);

  return (
    <div className="group glass-card rounded-2xl p-5 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-slate-200/90 hover:border-indigo-200/80 relative overflow-hidden flex flex-col justify-between">
      {/* Top accent gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig.borderTop}`}></div>

      <div>
        {/* Header: Client name & Status Badge */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200/70 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
              {cita.cliente ? cita.cliente[0].toUpperCase() : "C"}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 leading-tight group-hover:text-indigo-900 transition-colors">
                {cita.cliente}
              </h3>
              <span className="inline-block mt-0.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                {cita.servicio}
              </span>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold border shadow-xs ${statusConfig.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
            {cita.estado}
          </span>
        </div>

        {/* Details list */}
        <div className="mt-3.5 space-y-2 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate" title={cita.correo}>{cita.correo}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-slate-700">{cita.fecha}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-slate-700">{cita.hora}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50">
            <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-slate-500">Atiende:</span>
            <span className="font-bold text-slate-700">{cita.profesional}</span>
          </div>
        </div>
      </div>

      {/* Admin Action buttons */}
      {esAdmin && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            {cita.estado !== "Confirmada" && (
              <button
                type="button"
                onClick={() => onCambiarEstado(cita.id, "Confirmada")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-95 transition-all"
                title="Confirmar Cita"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Confirmar
              </button>
            )}

            {cita.estado !== "Cancelada" && (
              <button
                type="button"
                onClick={() => onCambiarEstado(cita.id, "Cancelada")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 active:scale-95 transition-all"
                title="Cancelar Cita"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => onEliminar(cita.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all"
            title="Eliminar registro de cita"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
