"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errormessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Insira email e senha");
      return;
    }

    setIsLoading(true);
    try {
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

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login bem-sucedido!");

        router.push("/");
      } else {
        throw new Error("Token de autenticação não recebido");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-body d-flex justify-content-center align-items-center vh-100">
      <div className="card border border-secondary-subtle bg-body-tertiary shadow-sm rounded-4 p-4">
        <h2 className="card-title text-primary">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label text-muted fw-bold small"
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
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label text-muted fw-semibold small"
            >
              Senha
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control fw-medium py-2 pe-5"
                value={password}
                placeholder="senha"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none"
                style={{ zIndex: 10 }}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {errormessage && (
            <div className="alert alert-danger" role="alert">
              {errormessage}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary bg-primary text-light border-primary w-100 fw-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
          <div className="text-center mt-4 pt-3 border-top border-secondary-subtle">
            <p className="text-muted small m-0">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-primary text-decoration-none fw-bold"
              >
                Criar Conta
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
