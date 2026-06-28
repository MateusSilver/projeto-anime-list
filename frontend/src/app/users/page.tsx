/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Users } from "lucide-react";
import { UserProfile } from "@/types/user";
import EmptyState from "@/components/EmptySpace";

export default function UsersCommunityPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Busca na nossa nova rota pública
        const res = await fetch("http://localhost:8080/api/users/public-list");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Erro ao buscar comunidade:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5 text-body-secondary">
        <Loader2 size={48} className="icon-spin text-primary mb-3" />
        <h5 className="fw-semibold">Carregando a comunidade...</h5>
      </div>
    );
  }

  return (
    <main className="container py-5 mt-5">
      <div className="mb-5 border-bottom border-secondary-subtle pb-3">
        <h1 className="fw-bold d-flex align-items-center gap-2">
          <Users className="text-primary" size={32} />
          Comunidade My Anime List
        </h1>
        <p className="text-body-secondary m-0">
          Descubra novos animes explorando o acervo de outros utilizadores.
        </p>
      </div>

      <div className="row g-4">
        {users.map((user) => (
          <div key={user.id} className="col-12 col-md-6 col-lg-4">
            <div
              className=" h-100 border-0 card border border-secondary-subtle bg-body-tertiary shadow-sm rounded-4 p-4"
              style={{ transition: "transform 0.2s" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <img
                  src={
                    user.profileImageUrl ||
                    "https://placehold.co/100x100?text=U"
                  }
                  alt={user.name}
                  className="rounded-circle border border-3 border-body"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-1 text-truncate">{user.name}</h5>
                  <p className="text-muted small mb-2">
                    {user.totalAnimes} animes no acervo
                  </p>
                  <Link
                    href={`/user/${user.id}/list`}
                    className="btn btn-sm bg-primary text-light rounded-pill px-3"
                  >
                    Ver Acervo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <EmptyState
            title={"Usuários não encontrados"}
            description="o sistema ainda não tem usuários"
          />
        )}
      </div>
    </main>
  );
}
