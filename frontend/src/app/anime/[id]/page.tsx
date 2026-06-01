/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ListProps } from "@/components/List"; // Ajuste o caminho se necessário

// Estendemos a ListProps para incluir o DTO que vem do Java
interface AnimeDetailsDTO {
  anime: ListProps & { tags?: string[] };
  globalUserCount: number;
}

export default function AnimeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const animeId = params.id; // Pega o ID da URL

  const [data, setData] = useState<AnimeDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!animeId) {
        setError("ID do anime não fornecido.");
        setIsLoading(false);
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/animes/${animeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Não foi possível carregar os detalhes do anime.");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os detalhes do anime.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (animeId) fetchAnimeDetails();
  }, [animeId, router]);

  if (isLoading) {
    return <div className="text-center mt-5">A carregar detalhes...</div>;
  }

  if (error || !data) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          {error || "Anime não encontrado."}
        </div>
        <Link href="/" className="btn btn-primary">
          Voltar para o Acervo
        </Link>
      </div>
    );
  }

  const { anime, globalUserCount } = data;

  return (
    <main className="container py-5">
      {/* Botão de Voltar */}
      <div className="mb-4">
        <Link
          href="/"
          className="text-decoration-none text-secondary fw-semibold"
        >
          &larr; Voltar para a minha lista
        </Link>
      </div>

      <div className="row g-5">
        {/* Coluna Esquerda: Imagem e Status Global */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
            <img
              src={anime.imageUrl || "https://via.placeholder.com/300x400"}
              alt={anime.title}
              className="img-fluid w-100"
              style={{ objectFit: "cover", maxHeight: "500px" }}
            />
          </div>

          <div className="bg-light p-3 rounded-3 border text-center">
            <p className="text-muted small mb-1 fw-semibold">
              Estatística Global
            </p>
            <h5 className="fw-bold text-dark m-0">
              👥 {globalUserCount}{" "}
              {globalUserCount === 1 ? "utilizador tem" : "utilizadores têm"}{" "}
              este anime
            </h5>
          </div>
        </div>

        {/* Coluna Direita: Detalhes, Tags e Comentários */}
        <div className="col-12 col-md-8">
          <h1 className="fw-bold mb-2">{anime.title}</h1>

          <div className="d-flex flex-wrap gap-2 mb-4">
            <span className="badge bg-primary fs-6">{anime.status}</span>
            <span className="badge bg-secondary fs-6">{anime.type}</span>
            <span className="badge bg-warning text-dark fs-6">
              ⭐ Nota: {anime.score || "S/N"}
            </span>
            <span className="badge bg-info text-dark fs-6">
              📺 Episódios: {anime.watchedEpisodes || 0} /{" "}
              {anime.episodes || "?"}
            </span>
          </div>

          {/* Área de Tags */}
          <div className="mb-5">
            <h5 className="fw-bold border-bottom pb-2 mb-3">Tags</h5>
            <div className="d-flex flex-wrap gap-2">
              {anime.tags && anime.tags.length > 0 ? (
                anime.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge bg-light text-dark border px-3 py-2"
                  >
                    # {tag}
                  </span>
                ))
              ) : (
                <p className="text-muted small">Nenhuma tag adicionada.</p>
              )}
            </div>
          </div>

          {/* Área de Comentários */}
          <div>
            <h5 className="fw-bold border-bottom pb-2 mb-3">
              As Minhas Anotações
            </h5>
            {anime.comments ? (
              <div className="bg-light p-4 rounded-3 border">
                <p className="m-0 text-dark" style={{ whiteSpace: "pre-wrap" }}>
                  {anime.comments}
                </p>
              </div>
            ) : (
              <div className="bg-light p-4 rounded-3 border border-dashed text-center">
                <p className="text-muted m-0">
                  Você ainda não escreveu comentários para este anime.
                </p>
              </div>
            )}
          </div>

          {/* Botão de Edição Futuro */}
          <div className="mt-4">
            <button className="btn btn-outline-primary fw-semibold px-4">
              Editar Dados
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
