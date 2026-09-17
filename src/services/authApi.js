const API_URL = "http://localhost:3001";

const LOCAL_USERS_KEY = "agenda_usuarios";
const INITIAL_USERS = [
  {
    id: 1,
    nombre: "Administrador General",
    correo: "admin@correo.com",
    password: "123",
    rol: "ADMIN"
  },
  {
    id: 2,
    nombre: "Juan Pérez",
    correo: "juan@correo.com",
    password: "123",
    rol: "USUARIO"
  }
];

const getLocalUsers = () => {
  const users = localStorage.getItem(LOCAL_USERS_KEY);
  if (!users) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(users);
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

export const loginApi = async (correo, password) => {
  try {
    const res = await fetch(`${API_URL}/usuarios?correo=${encodeURIComponent(correo)}&password=${encodeURIComponent(password)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) {
        return { success: true, user: data[0] };
      }
    }
  } catch (error) {
    console.warn("API de servidor no disponible, usando localStorage");
  }

  const users = getLocalUsers();
  const user = users.find(u => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password);
  if (user) {
    return { success: true, user };
  }
  return { success: false, message: "Correo o contraseña incorrectos." };
};

export const registerApi = async (nuevoUsuario) => {
  try {
    const checkRes = await fetch(`${API_URL}/usuarios?correo=${encodeURIComponent(nuevoUsuario.correo)}`);
    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (existing.length > 0) {
        return { success: false, message: "El correo ya se encuentra registrado." };
      }
    }

    const userWithRole = { ...nuevoUsuario, rol: nuevoUsuario.rol || "USUARIO" };
    const res = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userWithRole)
    });

    if (res.ok) {
      const created = await res.json();
      return { success: true, user: created };
    }
  } catch (error) {
    console.warn("Servidor offline, guardando en localStorage");
  }

  const users = getLocalUsers();
  const duplicate = users.find(u => u.correo.toLowerCase() === nuevoUsuario.correo.toLowerCase());
  if (duplicate) {
    return { success: false, message: "El correo ya se encuentra registrado." };
  }

  const userWithId = {
    id: Date.now(),
    ...nuevoUsuario,
    rol: nuevoUsuario.rol || "USUARIO"
  };

  users.push(userWithId);
  saveLocalUsers(users);
  return { success: true, user: userWithId };
};
