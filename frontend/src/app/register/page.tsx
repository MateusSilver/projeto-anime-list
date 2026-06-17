"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const newUser = {
      name,
      email,
      password,
      profileImageUrl: "https://placehold.co/150x150?text=User",
    };

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (res.status === 409) {
        throw new Error("Este e-mail já está registado!");
      }

      if (!res.ok) {
        throw new Error("Ocorreu um erro ao criar a conta.");
      }

      alert("Conta criada com sucesso! Faça login para começar.");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Erro de conexão com o servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-body d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 my-auto">
        <h2 className="card-title text-primary">Criar Conta</h2>
        <p className="text-muted small">
          Junte-se à comunidade My Anime List Pro
        </p>

        {errorMsg && (
          <div className="alert alert-danger py-2 small fw-medium" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Campo Nome */}
          <div className="mb-3">
            <label
              htmlFor="name"
              className="form-label text-muted fw-bold small"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              className="form-control fw-medium py-2"
              placeholder="Seu nome ou apelido"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Campo E-mail */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold small">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="form-control fw-medium py-2"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Campo Senha com o Olho */}
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label text-muted fw-semibold small"
            >
              Senha
            </label>
            <div className="position-relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control fw-medium py-2 pe-5"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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

          {/* Botão de Registo */}
          <button
            type="submit"
            className="btn btn-primary bg-primary text-light w-100 border-primary fw-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="icon-spin" /> A criar conta...
              </>
            ) : (
              "Registrar"
            )}
          </button>
        </form>

        {/* Link para voltar ao Login */}
        <div className="text-center mt-4 pt-3 border-top border-secondary-subtle">
          <p className="text-muted small m-0">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-primary text-decoration-none fw-bold"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
