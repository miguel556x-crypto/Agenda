import React, { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Navbar } from "./components/Navbar";
import { CitasPage } from "./citas";
import "./App.css";

export default function App() {
  const { usuarioActual, cargando } = useContext(AuthContext);
  const [vista, setVista] = useState("login");

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Cargando AgendaPro...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ambient flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-16 animate-fade-in">
        {!usuarioActual ? (
          vista === "login" ? (
            <LoginForm irARegistro={() => setVista("registro")} />
          ) : (
            <RegisterForm irALogin={() => setVista("login")} />
          )
        ) : (
          <CitasPage />
        )}
      </main>
    </div>
  );
}
