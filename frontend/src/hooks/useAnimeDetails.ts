import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Anime } from "@/types/anime";

// DTO do java
export interface AnimeDetailsDTO {
  anime: Anime & { tags?: string[] };
  globalUserCount: number;
  globalAverageScore: number;
}

export function useAnimeDetails(animeId: string | string[]) {
  const router = useRouter();

  const [data, setData] = useState<AnimeDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // reviews
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // modals e formulário de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Anime & { tags: string[] }>>(
    {},
  );
  const [tagsInput, setTagsInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Utilitário de Imagem
  const getHighResImageUrl = (url?: string) => {
    if (!url) return "https://placehold.co/400x600/EDF2F7/718096?text=Sem+Capa";
    if (!url.includes("myanimelist.net")) return url;
    if (url.match(/l\.(jpg|webp|png|jpeg)$/i)) return url;
    if (url.match(/t\.(jpg|webp|png|jpeg)$/i)) {
      return url.replace(/t\.(jpg|webp|png|jpeg)$/i, "l.$1");
    }
    return url.replace(/\.(jpg|webp|png|jpeg)$/i, "l.$1");
  };

  // Buscar Resenhas
  const fetchReviews = async (malIdToSearch: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/animes/reviews/${malIdToSearch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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

  // Buscar Detalhes
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
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }

        if (!response.ok)
          throw new Error("Não foi possível carregar os detalhes.");

        const result = await response.json();
        setData(result);

        if (result?.anime?.malId) {
          fetchReviews(result.anime.malId);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar detalhes.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (animeId) fetchAnimeDetails();
  }, [animeId, router]);

  // Manipulação de Edição
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
      const payload = { ...editForm, tags: updateTags };

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

      if (!response.ok)
        throw new Error("Não foi possível salvar as alterações.");

      const updatedAnime = await response.json();
      setData((prev) => (prev ? { ...prev, anime: updatedAnime } : prev));

      // Invalida os caches
      sessionStorage.removeItem("meusAnimesCache");

      setIsModalOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar as alterações.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Buscar da Jikan API
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
      if (!response.ok)
        throw new Error("Não foi possível buscar os dados do Jikan.");

      const jikanData = await response.json();
      const animeOficial = jikanData.data;

      setEditForm((prev) => ({
        ...prev,
        episodes: prev?.episodes || animeOficial.episodes || 0,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar dados do Jikan.",
      );
    } finally {
      setIsFetching(false);
    }
  };

  // Resenhas e Likes
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
        setReviews((prev) =>
          prev.map((rev) =>
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

  return {
    data,
    isLoading,
    error,
    reviews,
    isReviewModalOpen,
    setIsReviewModalOpen,
    isModalOpen,
    setIsModalOpen,
    isImageModalOpen,
    setIsImageModalOpen,
    editForm,
    setEditForm,
    tagsInput,
    setTagsInput,
    isSaving,
    isFetching,
    getHighResImageUrl,
    handleOpenEdit,
    handleSaveEdit,
    fetchJikanData,
    handleLikeReview,
    handleSaveReview,
  };
}
