import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Anime } from "@/types/anime";
import { STATUS_WEIGHTS } from "@/constants/animeConstants";

export function useAnimes() {
  const router = useRouter();

  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [sortBy, setSortBy] = useState<string>("status");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  useEffect(() => {
    const loadAllData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const cacheExistente = sessionStorage.getItem("meusAnimesCache");
      if (cacheExistente) {
        setAnimes(JSON.parse(cacheExistente));
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/animes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Falha no servidor");

        const data = await res.json();
        setAnimes(data);
        sessionStorage.setItem("meusAnimesCache", JSON.stringify(data));
      } catch (error) {
        console.error("Erro fatal ao carregar animes", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [router]);

  const handleFilterCategoryChange = (category: string) => {
    setFilterCategory(category);
    setFilterValue("");
  };

  const handleToggleFavorite = async (id: number) => {
    const novosAnimes = animes.map((a) =>
      a.id === id ? { ...a, favorite: !a.favorite } : a,
    );
    setAnimes(novosAnimes);
    sessionStorage.setItem("meusAnimesCache", JSON.stringify(novosAnimes));

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/animes/${id}/favorite`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error();
    } catch (error) {
      // Reversão de salvamento
      const animesRevertidos = animes.map((a) =>
        a.id === id ? { ...a, favorite: !a.favorite } : a,
      );
      setAnimes(animesRevertidos);
      sessionStorage.setItem(
        "meusAnimesCache",
        JSON.stringify(animesRevertidos),
      );
      alert(`Falha ao atualizar favorito. ${error}`);
    }
  };

  // Incrementar Episódio
  const handleUpdateAnimeEpisodes = async (id: number) => {
    const animeAtual = animes.find((anime) => anime.id === id);
    if (!animeAtual) return;

    if (
      animeAtual.episodes &&
      animeAtual.watchedEpisodes >= animeAtual.episodes
    )
      return;

    const updatedEpisodes = animeAtual.watchedEpisodes + 1;
    let novoStatus = animeAtual.status;

    if (animeAtual.episodes && animeAtual.episodes === updatedEpisodes) {
      window.alert(
        `Parabéns! O status de ${animeAtual.title} foi atualizado para 'Concluído'`,
      );
      novoStatus = "Completed";
    } else if (animeAtual.status !== "Watching") {
      novoStatus = "Watching";
    }

    const animeAtualizado = {
      ...animeAtual,
      watchedEpisodes: updatedEpisodes,
      status: novoStatus,
    };
    const animesNovos = animes.map((anime) =>
      anime.id === id ? animeAtualizado : anime,
    );

    setAnimes(animesNovos);
    sessionStorage.setItem("meusAnimesCache", JSON.stringify(animesNovos));

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/animes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(animeAtualizado),
      });
      if (!response.ok) throw new Error();
    } catch (error) {
      console.error("Error updating anime:", error);
      alert("Ocorreu um erro ao atualizar o anime.");
      setAnimes(animes.map((anime) => (anime.id === id ? animeAtual : anime)));
      sessionStorage.removeItem("meusAnimesCache");
    }
  };

  // Salvar Novo Anime
  const handleSaveAnime = async (anime: Anime) => {
    setIsPopupOpen(false);
    const token = localStorage.getItem("token");
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...dadosParaSalvar } = anime;
      const response = await fetch("http://localhost:8080/api/animes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosParaSalvar),
      });

      if (response.status === 409) throw new Error("Anime já existe na lista.");
      if (!response.ok) throw new Error();

      const animeSalvo = await response.json();
      const novaLista = [animeSalvo, ...animes];
      setAnimes(novaLista);
      sessionStorage.setItem("meusAnimesCache", JSON.stringify(novaLista));
    } catch (error) {
      console.error("Erro salvando o anime:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao salvar o anime.",
      );
    }
  };

  // Filtros e Ordenação
  const sortedAnimes = useMemo(() => {
    let anecdotesCopy = [...animes];

    if (showFavoritesOnly)
      anecdotesCopy = anecdotesCopy.filter((a) => a.favorite);
    if (searchQuery.trim() !== "") {
      anecdotesCopy = anecdotesCopy.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (filterCategory !== "all" && filterValue) {
      anecdotesCopy = anecdotesCopy.filter((a) => {
        if (filterCategory === "status") return a.status === filterValue;
        if (filterCategory === "type") return a.type === filterValue;
        return true;
      });
    }

    return anecdotesCopy.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "status":
          const pesoA = STATUS_WEIGHTS[a.status] || 999;
          const pesoB = STATUS_WEIGHTS[b.status] || 999;
          if (pesoA !== pesoB) return pesoA - pesoB;
          return (b.score || 0) - (a.score || 0);
        case "scoreDesc":
          return (b.score || 0) - (a.score || 0);
        case "scoreAsc":
          return (a.score || 0) - (b.score || 0);
        default:
          return 0;
      }
    });
  }, [
    animes,
    sortBy,
    filterCategory,
    filterValue,
    searchQuery,
    showFavoritesOnly,
  ]);

  // Retorno simplificado de tudo o que a tela vai precisar consumir
  return {
    sortedAnimes,
    isLoading,
    isPopupOpen,
    setIsPopupOpen,
    filterCategory,
    filterValue,
    setFilterValue,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    showFavoritesOnly,
    setShowFavoritesOnly,
    handleFilterCategoryChange,
    handleToggleFavorite,
    handleUpdateAnimeEpisodes,
    handleSaveAnime,
  };
}
