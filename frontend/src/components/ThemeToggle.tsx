"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as
      | "light"
      | "dark"
      | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-bs-theme", initialTheme);

    setTimeout(() => {
      setTheme(initialTheme);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
  };

  if (!theme) return null;

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-secondary position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
      style={{
        width: "50px",
        height: "50px",
        zIndex: 1050,
        backgroundColor: "var(--bs-body-bg)", // Usa a cor de fundo do tema atual
        backdropFilter: "blur(5px)",
      }}
      title={
        theme === "light" ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"
      }
    >
      <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>
        {theme === "light" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
