"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errormessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      if (!email || !password) {
        setErrorMessage("Insira email e senha");
        return;
      }

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = await response.json();
      console.log("Login bem-sucedido:", data);
      alert(`Bem vindo, ${data.name ? data.name : data.email}!`);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 my-auto">
        <h2 className="card-title text-primary">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label text-muted fw-semi-bold small"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control fw-medium py-2"
              value={email}
              placeholder="Digite seu email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label text-muted fw-semibold small"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="form-control fw-medium py-2"
              value={password}
              placeholder="senha"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errormessage && (
            <div className="alert alert-danger" role="alert">
              {errormessage}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary bg-primary border-primary w-100 fw-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
