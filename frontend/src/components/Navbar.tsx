/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOutIcon, Users, ListVideo } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const isDetailsPage = pathname.startsWith("/anime/");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        setUserImage(null);
        return;
      }

      setIsLoggedIn(true);

      try {
        const res = await fetch("http://localhost:8080/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUserImage(data.profileImageUrl);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Erro ao carregar avatar do Navbar", error);
      }
    };

    verifySession();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("meusAnimesCache");
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/register") return null;

  const isVisible = !isDetailsPage || isScrolled;
  const positionClass = isDetailsPage ? "fixed-top" : "sticky-top";

  return (
    <nav
      className={`navbar navbar-expand-md navbar-light glass-navbar ${positionClass}`}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
        zIndex: 1040,
      }}
    >
      <div className="container py-1">
        {/* Logo / Título */}
        <Link
          href="/"
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
        >
          <span className="text-primary fs-4">My Anime List Pro</span>
        </Link>

        {/* Botão Hambúrguer para Mobile */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links Centrais e Perfil */}
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav me-auto mb-2 mb-md-0 ms-md-4 gap-2">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link fw-medium d-flex align-items-center gap-1 ${pathname === "/" ? "text-primary active" : ""}`}
              >
                <ListVideo size={18} /> Meu Acervo
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/users"
                className={`nav-link fw-medium d-flex align-items-center gap-1 ${pathname.startsWith("/users") ? "text-primary active" : ""}`}
              >
                <Users size={18} /> Comunidade
              </Link>
            </li>
          </ul>

          {/* Área Direita (Perfil / Login) */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="text-decoration-none">
                  <div
                    className="d-flex align-items-center gap-2 hover-scale"
                    title="Meu Perfil"
                  >
                    <img
                      src={
                        userImage || "https://placehold.co/150x150?text=User"
                      }
                      alt="Avatar"
                      className="rounded-circle border border-2 border-primary"
                      style={{
                        width: "35px",
                        height: "35px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger fw-semibold rounded-pill px-3 d-flex align-items-center gap-1"
                >
                  <LogOutIcon size={16} />{" "}
                  <span className="d-none d-md-inline">Sair</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary fw-semibold rounded-pill px-4"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
