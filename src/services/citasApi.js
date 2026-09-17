const API_URL = "http://localhost:3001";
const LOCAL_CITAS_KEY = "agenda_citas";

const INITIAL_CITAS = [
  {
    id: 1,
    cliente: "Juan Pérez",
    correo: "juan@correo.com",
    servicio: "Corte de Cabello",
    fecha: "2026-09-20",
    hora: "10:00 AM",
    estado: "Pendiente",
    profesional: "Carlos Ruiz"
  },
  {
    id: 2,
    cliente: "María López",
    correo: "maria@correo.com",
    servicio: "Manicura Pro",
    fecha: "2026-09-21",
    hora: "11:30 AM",
    estado: "Confirmada",
    profesional: "Ana Gómez"
  }
];

const getLocalCitas = () => {
  const citas = localStorage.getItem(LOCAL_CITAS_KEY);
  if (!citas) {
    localStorage.setItem(LOCAL_CITAS_KEY, JSON.stringify(INITIAL_CITAS));
    return INITIAL_CITAS;
  }
  return JSON.parse(citas);
};

const saveLocalCitas = (citas) => {
  localStorage.setItem(LOCAL_CITAS_KEY, JSON.stringify(citas));
};

export const getCitasApi = async () => {
  try {
    const res = await fetch(`${API_URL}/citas`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("json-server no disponible, cargando citas de localStorage");
  }
  return getLocalCitas();
};

export const crearCitaApi = async (nuevaCita) => {
  try {
    const res = await fetch(`${API_URL}/citas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaCita)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Servidor offline, guardando cita localmente");
  }

  const citas = getLocalCitas();
  const citaConId = { id: Date.now(), ...nuevaCita };
  citas.push(citaConId);
  saveLocalCitas(citas);
  return citaConId;
};

export const eliminarCitaApi = async (id) => {
  try {
    const res = await fetch(`${API_URL}/citas/${id}`, { method: "DELETE" });
    if (res.ok) return true;
  } catch (e) {
    console.warn("Servidor offline, eliminando cita localmente");
  }

  let citas = getLocalCitas();
  citas = citas.filter(c => c.id !== id);
  saveLocalCitas(citas);
  return true;
};

export const actualizarCitaApi = async (id, citaActualizada) => {
  try {
    const res = await fetch(`${API_URL}/citas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(citaActualizada)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Servidor offline, actualizando cita localmente");
  }

  let citas = getLocalCitas();
  citas = citas.map(c => c.id === id ? { ...c, ...citaActualizada } : c);
  saveLocalCitas(citas);
  return citaActualizada;
};
