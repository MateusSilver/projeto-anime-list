/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ListProps } from "@/components/List";
import {
  ArrowLeft,
  Loader2,
  Pen,
  Search,
  X,
  MessageSquare,
  Star,
  ThumbsUp,
} from "lucide-react";
import ReviewModal from "@/components/ReviewModal";

// Estendemos a ListProps para incluir o DTO que vem do Java
interface AnimeDetailsDTO {
  anime: ListProps & { tags?: string[] };
  globalUserCount: number;
  globalAverageScore: number;
}

const VALUE_LABELS: Record<string, string> = {
  Watching: "Assistindo",
  Completed: "Concluído",
  "On-Hold": "Pausado",
  Dropped: "Abandonado",
  "Plan to Watch": "Planejo ver",
};

export default function AnimeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const animeId = params.id; // Pega o ID da URL

  const [data, setData] = useState<AnimeDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<
    Partial<ListProps & { tags: string[] }>
  >({});
  const [tagsInput, setTagsInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  // modal de edição
  const handleOpenEdit = () => {
    if (data?.anime) {
      setEditForm(data.anime);
      setTagsInput(data.anime.tags ? data.anime.tags.join(", ") : "");
      setIsModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !data?.anime) return;

    setIsSaving(true);
    try {
      const updateTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      const payload = {
        ...editForm,
        tags: updateTags,
      };

      const response = await fetch(
        `http://localhost:8080/api/animes/${animeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Não foi possível salvar as alterações.");
      }

      const updatedAnime = await response.json();
      setData((prev) => (prev ? { ...prev, anime: updatedAnime } : prev));
      sessionStorage.removeItem("animeListCache");
      setIsModalOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao salvar as alterações.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fetchJikanData = async () => {
    if (!editForm?.malId) {
      alert("Por favor insira um ID disponível no My anime list");
      return;
    }
    setIsFetching(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${editForm.malId}`,
      );
      if (!response.ok) {
        throw new Error("Não foi possível buscar os dados do Jikan.");
      }

      const jikanData = await response.json();
      const animeOficial = jikanData.data;

      setEditForm((prev) => ({
        ...prev,
        episodes: prev?.episodes || animeOficial.episodes || 0,
      }));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao buscar dados do Jikan.",
      );
    } finally {
      setIsFetching(false);
    }
  };

  const getHighResImageUrl = (url?: string) => {
    if (!url) return "https://placehold.co/400x600/EDF2F7/718096?text=Sem+Capa";

    if (!url.includes("myanimelist.net")) return url;

    // Se já for a versão grande (termina com l.jpg, l.webp, etc), retorna direto
    if (url.match(/l\.(jpg|webp|png|jpeg)$/i)) return url;

    if (url.match(/t\.(jpg|webp|png|jpeg)$/i)) {
      return url.replace(/t\.(jpg|webp|png|jpeg)$/i, "l.$1");
    }

    return url.replace(/\.(jpg|webp|png|jpeg)$/i, "l.$1");
  };

  const fetchReviews = async (malIdToSearch: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/animes/reviews/${malIdToSearch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Erro ao buscar resenhas", error);
    }
  };

  const handleLikeReview = async (reviewId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/animes/reviews/${reviewId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const novoTotalDeLikes = await res.json();

        // Atualiza apenas a resenha
        setReviews((prevReviews) =>
          prevReviews.map((rev) =>
            rev.reviewId === reviewId
              ? {
                  ...rev,
                  likes: novoTotalDeLikes,
                  isLikedByMe: !rev.isLikedByMe,
                }
              : rev,
          ),
        );
      }
    } catch (error) {
      console.error("Erro ao curtir a resenha:", error);
    }
  };

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

        if (data?.anime?.malId) {
          fetchReviews(data.anime.malId);
        }
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
  }, [animeId, data?.anime.malId, router]);

  const handleSaveReview = async (newReviewText: string) => {
    if (!data?.anime) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/animes/${animeId}/review`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewText: newReviewText }),
      },
    );

    if (!res.ok) {
      alert("Não foi possível salvar a sua resenha.");
      throw new Error("Falha ao salvar a resenha");
    }

    setData({ ...data, anime: { ...data.anime, reviewText: newReviewText } });

    if (data.anime.malId) fetchReviews(data.anime.malId);
  };

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

  const { anime, globalUserCount, globalAverageScore } = data;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* BACKGROUND DEGRADÊ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "70vh",
          backgroundImage: `url(${anime.imageUrl || "https://via.placeholder.com/300x400"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px)",
          opacity: 0.5,
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <main
        className="container"
        style={{ position: "relative", zIndex: 1, paddingTop: "125px" }}
      >
        {/* Botão de Voltar */}
        <div className="mb-4">
          <Link href="/" className="text-decoration-none text-body fw-semibold">
            <ArrowLeft size={22} /> Voltar
          </Link>
        </div>

        <div className="row g-5">
          {/* Coluna Esquerda: Imagem e Status Global */}
          <div className="col-12 col-md-4">
            <div
              className="border-0 shadow-sm overflow-hidden mb-3"
              style={{ cursor: "zoom-in" }}
              onClick={() => setIsImageModalOpen(true)}
              title="Clique para ampliar a imagem"
            >
              <img
                src={getHighResImageUrl(anime.imageUrl)}
                alt={anime.title}
                className="img-fluid w-100"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>

            <div className="bg-body p-3 rounded-3 border text-center">
              <p className="text-muted small mb-1 fw-semibold">
                Estatística Global
              </p>
              <h5 className="fw-bold text-primary m-0">
                {globalUserCount}{" "}
                {globalUserCount === 1 ? "seguidor" : "seguidores"}
              </h5>
              <p className="text-muted fs-4 mb-0 fw-bold">
                Média:{" "}
                <span className="text-primary">
                  {globalAverageScore?.toFixed(2) || "S/N"}
                </span>
              </p>
              <span className="text-primary font-italic small mt-2">
                {anime.favorite ? "Favorito" : ""}
              </span>
            </div>
          </div>

          {/* Coluna Direita: Detalhes, Tags e Comentários */}
          <div className="col-12 col-md-8">
            <h1 className="fw-bold mb-2">{anime.title}</h1>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge bg-primary fs-6">
                {VALUE_LABELS[anime.status] || anime.status}
              </span>
              <span className="badge bg-secondary fs-6">{anime.type}</span>
              <span className="badge bg-warning text-dark fs-6">
                Nota: {anime.score || "S/N"}
              </span>
              <span className="badge bg-info text-dark fs-6">
                Episódios: {anime.watchedEpisodes || 0} /{" "}
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
                      className="badge rounded-pill bg-body text-body border px-3 py-2"
                    >
                      {tag}
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
                <div className="bg-body p-4 rounded-3 border">
                  <p
                    className="m-0 text-body fst-italic"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
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
              <button
                onClick={handleOpenEdit}
                className="btn bg-primary text-white border-primary btn-outline-primary fw-semibold px-4 d-flex align-items-center gap-1"
              >
                <Pen size={18} fill="currentColor" />
                Editar Dados
              </button>
            </div>
          </div>
        </div>
        {/* SESSÃO DE RESENHAS GLOBAIS */}
        <div className="mt-5">
          <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            Resenhas da Comunidade ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="alert bg-body-tertiary border-0 text-center py-4 d-flex align-items-center flex-column  gap-2 text-body-secondary rounded-4">
              Nenhuma resenha encontrada para este anime. Seja o primeiro a
              avaliar!
              <button
                className="btn bg-primary text-white rounded-2 fw-bold"
                onClick={() => setIsReviewModalOpen(true)}
              >
                Fazer uma Resenha
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {/* Mostra apenas as 3 melhores resenhas para não poluir a tela principal */}
              {reviews.slice(0, 3).map((review, idx) => (
                <div key={idx} className="col-12">
                  <div className="card border border-secondary-subtle bg-body-tertiary shadow-sm rounded-4 p-3">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            review.userImage ||
                            "https://placehold.co/50x50?text=U"
                          }
                          alt={review.userName}
                          className="rounded-circle border border-2 border-secondary-subtle"
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{review.userName}</h6>
                          <small className="text-body-secondary d-flex align-items-center gap-1">
                            <Star
                              size={12}
                              className="text-warning"
                              fill="#FFD700"
                            />
                            Nota:{" "}
                            {review.score ? review.score.toFixed(1) : "N/A"}
                          </small>
                        </div>
                      </div>
                      {/* Botão de Curtir Resenha */}
                      <button
                        onClick={() => handleLikeReview(review.reviewId)}
                        className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 fw-semibold shadow-sm ${
                          review.isLikedByMe
                            ? "btn-secondary"
                            : "btn-outline-secondary"
                        }`}
                        style={{ transition: "all 0.2s" }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                        title={
                          review.isLikedByMe
                            ? "Remover curtida"
                            : "Curtir resenha"
                        }
                      >
                        <ThumbsUp
                          fill={review.isLikedByMe ? "currentColor" : "none"}
                          size={14}
                        />
                        {review.likes || 0}
                      </button>
                    </div>

                    <p
                      className="card-text text-body"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {review.reviewText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão para Expandir (Será útil quando criar a página dedicada de resenhas) */}
          {reviews.length > 3 && (
            <div className="text-center mt-3">
              <Link
                href={`/animes/${anime.id}/reviews`}
                className="btn btn-primary rounded-pill px-4 fw-bold"
              >
                Ver todas as {reviews.length} resenhas
              </Link>
            </div>
          )}
        </div>
        {/* COMPONENTE DO MODAL DE RESENHA */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          initialText={data?.anime?.reviewText || ""}
          animeTitle={data?.anime?.title || "este anime"}
          onSave={handleSaveReview}
        />
        {/* MODAL DE IMAGEM */}
        {isModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(5px)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header border-bottom-0 bg-light pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold text-dark">
                    Editar Dados do Anime
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsModalOpen(false)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Coluna Esquerda: Imagem, Jikan API e URL */}
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center justify-content-start bg-body-tertiary p-4 border-0 rounded-4">
                      {editForm.imageUrl ? (
                        <img
                          src={editForm.imageUrl}
                          alt={editForm.title || "Capa do Anime"}
                          className="img-fluid rounded shadow-sm mb-4"
                          style={{ maxWidth: "250px", height: "auto" }}
                        />
                      ) : (
                        <div
                          className="bg-secondary d-flex align-items-center justify-content-center rounded shadow-sm mb-4"
                          style={{
                            width: "180px",
                            height: "250px",
                            opacity: 0.2,
                          }}
                        >
                          <div className="text-center text-white fw-semibold px-3">
                            Imagem não disponível
                          </div>
                        </div>
                      )}

                      {/* NOVO: Busca pela Jikan API */}
                      <div className="w-100 mb-3">
                        <label className="form-label text-muted fw-semibold small">
                          MyAnimeList ID
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control fw-semibold"
                            placeholder="0000"
                            value={editForm.malId || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                malId:
                                  e.target.value === ""
                                    ? undefined
                                    : parseInt(e.target.value),
                              })
                            }
                          />
                          <button
                            className="btn btn-primary fw-semibold d-flex gap-1 align-items-center"
                            type="button"
                            title="buscar ID no My anime List"
                            onClick={fetchJikanData}
                            disabled={isFetching}
                          >
                            {isFetching ? (
                              <>
                                <Loader2 size={18} /> Buscando...
                              </>
                            ) : (
                              <>
                                <Search size={18} />
                              </>
                            )}
                          </button>
                        </div>
                        <small
                          className="text-muted mt-2 d-block text-center"
                          style={{ fontSize: "11px" }}
                        >
                          Puxe título, capa e total de episódios oficiais usando
                          o ID.
                        </small>
                      </div>

                      <div className="w-100 pt-2 border-top">
                        <label className="form-label text-muted fw-semibold small mt-2">
                          Ou insira a URL da Capa Manualmente
                        </label>
                        <input
                          type="url"
                          className="form-control fw-semibold"
                          placeholder="https://exemplo.com/poster.jpg"
                          value={editForm.imageUrl || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              imageUrl: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Coluna Direita: Informações e Status */}
                    <div className="col-12 col-md-8">
                      <div className="mb-3">
                        <label className="form-label text-muted fw-semibold small">
                          Título
                        </label>
                        <input
                          type="text"
                          className="form-control fw-semibold fs-5 bg-body"
                          value={editForm.title || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-4 mt-2">
                        <div
                          className="form-check form-switch p-0 d-flex align-items-center border-none"
                          style={{ width: "fit-content" }}
                        >
                          <input
                            className=" m-0 ms-2 bg-body"
                            type="checkbox"
                            role="switch"
                            id="editFavoriteSwitch"
                            style={{
                              width: "40px",
                              height: "20px",
                              cursor: "pointer",
                            }}
                            checked={editForm.favorite || false}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                favorite: e.target.checked,
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-semibold pe-3"
                            htmlFor="editFavoriteSwitch"
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            É um Favorito
                          </label>
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label text-muted fw-semibold small">
                            Status
                          </label>
                          <select
                            className="form-select fw-semibold bg-body"
                            value={editForm.status || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="Watching">Assistindo</option>
                            <option value="Completed">Concluído</option>
                            <option value="On-Hold">Pausado</option>
                            <option value="Dropped">Abandonado</option>
                            <option value="Plan to Watch">
                              Planejo Assistir
                            </option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted fw-semibold small">
                            Tipo
                          </label>
                          <select
                            className="form-select fw-semibold bg-body"
                            value={editForm.type || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, type: e.target.value })
                            }
                          >
                            <option value="TV">TV</option>
                            <option value="Movie">Filme</option>
                            <option value="OVA">OVA</option>
                            <option value="ONA">ONA</option>
                            <option value="Special">Especial</option>
                          </select>
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-4">
                          <label className="form-label text-muted fw-semibold small">
                            Episódios (Total)
                          </label>
                          <input
                            type="number"
                            className="form-control fw-semibold bg-body"
                            min="0"
                            value={editForm.episodes || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                episodes: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-muted fw-semibold small">
                            Assistidos
                          </label>
                          <input
                            type="number"
                            className="form-control fw-semibold bg-body"
                            min="0"
                            value={editForm.watchedEpisodes || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                watchedEpisodes: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-muted fw-semibold small">
                            Nota (0-10)
                          </label>
                          <input
                            type="number"
                            className="form-control fw-semibold text-primary bg-body"
                            min="0"
                            max="10"
                            step="0.1"
                            value={editForm.score || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditForm({
                                ...editForm,
                                score:
                                  val === ""
                                    ? 0
                                    : Math.max(
                                        0,
                                        Math.min(10, parseFloat(val)),
                                      ),
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted fw-semibold small">
                          Tags (separadas por vírgula)
                        </label>
                        <textarea
                          className="form-control fw-semibold bg-body"
                          placeholder="ação, aventura, isekai"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label text-muted fw-semibold small">
                          Anotações Pessoais
                        </label>
                        <textarea
                          className="form-control fw-semibold bg-body"
                          rows={4}
                          placeholder="Escreva as suas impressões, onde parou, etc..."
                          value={editForm.comments || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              comments: e.target.value,
                            })
                          }
                          style={{ resize: "none" }}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0 pb-4 px-4">
                  <button
                    type="button"
                    className="btn btn-body border-none hover:border-none fw-semibold px-4"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary bg-primary border-primary fw-bold px-3"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isImageModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 1050,
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setIsImageModalOpen(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "90vw", height: "90vh", margin: "auto" }}
            >
              <div className="modal-content bg-transparent border-0 shadow-none w-100 h-100">
                <div
                  className="modal-header border-0 pb-0 justify-content-end position-absolute top-0 end-0 bg-body-transparent text-body"
                  style={{ zIndex: 1 }}
                >
                  <button
                    type="button"
                    className="btn text-white p-3 rounded-circle"
                    onClick={() => setIsImageModalOpen(false)}
                    title="Fechar"
                  >
                    <X fill="currentColor" size={22} />
                  </button>
                </div>

                <div className="modal-body text-center p-0 d-flex justify-content-center align-items-center h-100">
                  <img
                    src={getHighResImageUrl(anime.imageUrl)}
                    alt={anime.title}
                    className="img-fluid rounded-none shadow-lg"
                    style={{
                      maxHeight: "100vh",
                      maxWidth: "100%",
                      objectFit: "contain",
                      cursor: "zoom-out",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsImageModalOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
