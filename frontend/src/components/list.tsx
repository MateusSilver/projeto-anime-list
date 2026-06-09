/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useMemo } from "react";
import { Loader2, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimeCard from "./AnimeCard";
import AnimeControls from "./AnimeControls";
import AddAnimeModal from "./AddAnimeModal";

export interface ListProps {
  id: number;
  malId: number;
  title: string;
  type: string;
  episodes: number;
  watchedEpisodes: number;
  score: number;
  status: string;
  comments: string;
  imageUrl: string;
  favorite?: boolean;
}

// dicionarios globais

const CATEGORY_LABELS: Record<string, string> = {
  status: "Status",
  type: "Tipo",
};

const VALUE_LABELS: Record<string, string> = {
  Watching: "Assistindo",
  Completed: "Concluído",
  "On-Hold": "Pausado",
  Dropped: "Abandonado",
  "Plan to Watch": "Planejo ver",
  TV: "TV",
  Movie: "Filme",
  OVA: "OVA",
  ONA: "Streaming",
  Special: "Especial",
  all: "Todos",
};

const STATUS_WEIGHTS: Record<string, number> = {
  Watching: 1,
  Completed: 2,
  "On-Hold": 3,
  Dropped: 4,
  "Plan to Watch": 5,
};

const BADGE_CLASSES: Record<string, string> = {
  Watching: "bg-success text-white",
  Completed: "bg-info",
  "On-Hold": "bg-warning text-dark",
  Dropped: "bg-danger text-white",
  "Plan to Watch": "bg-dark text-white",
};

const FILTER_OPTIONS: Record<string, { value: string; label: string }[]> = {
  status: [
    { value: "Watching", label: "Assistindo" },
    { value: "Completed", label: "Concluído" },
    { value: "On-Hold", label: "Pausado" },
    { value: "Dropped", label: "Abandonado" },
    { value: "Plan to Watch", label: "Planejo ver" },
  ],
  type: [
    { value: "TV", label: "TV" },
    { value: "Movie", label: "Filme" },
    { value: "OVA", label: "OVA" },
    { value: "ONA", label: "Streaming" },
    { value: "Special", label: "Especial" },
  ],
};

export default function List() {
  const [sortBy, setSortBy] = useState<string>("status");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [animes, setAnimes] = useState<ListProps[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [userBasicInfo, setUserBasicInfo] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const loadAllData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      //Buscar o Perfil
      const fetchProfile = async () => {
        try {
          const res = await fetch("http://localhost:8080/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUserBasicInfo({ name: data.name, image: data.profileImageUrl });
          }
        } catch (error) {
          console.error(
            "Erro ao carregar mini-perfil (não afeta os animes)",
            error,
          );
        }
      };

      //Buscar os Animes
      const fetchAnimes = async () => {
        const cacheExistente = sessionStorage.getItem("meusAnimesCache");
        if (cacheExistente) {
          setAnimes(JSON.parse(cacheExistente));
          setIsLoading(false);
          return; // Se tem cache, para aqui e nem faz o fetch
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

      fetchProfile();
      fetchAnimes();
    };

    loadAllData();
  }, [router]);

  const handleFilterValueChange = (category: string) => {
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
      const animesRevertidos = animes.map((a) =>
        a.id === id ? { ...a, favorite: !a.favorite } : a,
      );
      setAnimes(animesRevertidos);
      sessionStorage.setItem(
        "meusAnimesCache",
        JSON.stringify(animesRevertidos),
      );
      alert("Falha ao atualizar favorito.");
    }
  };

  const sortedAnimes = useMemo(() => {
    let animesCopy = [...animes];

    if (showFavoritesOnly) {
      animesCopy = animesCopy.filter((anime) => anime.favorite);
    }

    if (searchQuery.trim() !== "") {
      animesCopy = animesCopy.filter((anime) =>
        anime.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterCategory !== "all" && filterValue) {
      animesCopy = animesCopy.filter((anime) => {
        if (filterCategory === "status") return anime.status === filterValue;
        if (filterCategory === "type") return anime.type === filterValue;
        return true;
      });
    }

    return animesCopy.sort((a, b) => {
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

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5 text-body-secondary">
        <Loader2 size={48} className="icon-spin text-primary mb-3" />
        <h5 className="fw-semibold">Carregando seu acervo...</h5>
      </div>
    );
  }

  const handleUpdateAnimeEpisodes = async (id: number) => {
    const animeAtual = animes.find((anime) => anime.id === id);
    if (!animeAtual) return;

    if (
      animeAtual.episodes &&
      animeAtual.watchedEpisodes >= animeAtual.episodes
    ) {
      return;
    }

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

      if (!response.ok) {
        throw new Error(`Falha ao persistir dados: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating anime:", error);
      alert(
        "Ocorreu um erro ao atualizar o anime. Por favor, tente novamente.",
      );
      setAnimes(animes.map((anime) => (anime.id === id ? animeAtual : anime)));
      sessionStorage.removeItem("meusAnimesCache");
    }
  };

  const handleSaveAnime = async (anime: ListProps) => {
    setIsPopupOpen(false);
    const token = localStorage.getItem("token");
    try {
      const { id, ...dadosParaSalvar } = anime;

      const response = await fetch("http://localhost:8080/api/animes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosParaSalvar),
      });

      if (response.status === 409) {
        throw new Error("Anime já existe na lista.");
      }

      if (!response.ok) {
        throw new Error(`Falha ao persistir dados: ${response.statusText}`);
      }

      const animeSalvo = await response.json();
      const novaLista = [animeSalvo, ...animes];

      setAnimes(novaLista);

      sessionStorage.setItem("meusAnimesCache", JSON.stringify(novaLista));
    } catch (error) {
      console.error("Erro salvando o anime:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao salvar o anime. Por favor, tente novamente.",
      );
    }
  };

  return (
    <main>
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3 flex-wrap">
        <div>
          <h1 className="fw-bold text-truncate mb-1">
            <span className="text-primary">My Anime List Pro</span>
          </h1>
          <p className="text-muted m-0">
            Gerenciamento de acervo pessoal e estatísticas
          </p>
        </div>
        <div className="d-flex flex-row gap-2">
          <Link href="/profile" className="text-decoration-none">
            <div
              className="d-flex align-items-center gap-2 px-3 py-2 border border-secondary-subtle rounded-pill bg-body-tertiary shadow-sm"
              style={{ transition: "all 0.2s", cursor: "pointer" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              title="Acessar Meu Perfil"
            >
              <img
                src={
                  userBasicInfo?.image ||
                  "https://placehold.co/150x150?text=User"
                }
                alt="Avatar"
                className="rounded-circle border border-2 border-primary"
                style={{ width: "35px", height: "35px", objectFit: "cover" }}
              />
              <span className="fw-bold text-body m-0 d-none d-sm-block">
                {userBasicInfo?.name || "Meu Perfil"}
              </span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="d-flex align-items-center justify-content-center gap-1 btn btn-outline-danger fw-semibold rounded-pill px-4"
          >
            <LogOutIcon />
            Sair
          </button>
        </div>
      </div>
      <AnimeControls
        filterCategory={filterCategory}
        onFilterCategoryChange={handleFilterValueChange}
        filterValue={filterValue}
        onFilterValueChange={setFilterValue}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onOpenPopUp={() => setIsPopupOpen(true)}
        filterOptions={FILTER_OPTIONS}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
      />

      <div
        className="mb-4 d-flex justify-content-between align-items-end border-bottom pb-2"
        style={{ borderColor: "var(--bs-card-border-color)" }}
      >
        <div>
          {filterCategory !== "all" && filterValue && (
            <p className="m-0 text-body-secondary fw-medium">
              Filtrando por: <span>{CATEGORY_LABELS[filterCategory]}</span> -{" "}
              <span className="text-primary">
                {VALUE_LABELS[filterValue] || filterValue}
              </span>
            </p>
          )}
        </div>
        {filterCategory !== "all" && (
          <p className="m-0 text-body-secondary fw-semibold">
            <span className="text-primary fs-5">{sortedAnimes.length}</span>{" "}
            Animes encontrados
          </p>
        )}
      </div>

      <div className="row g-2">
        {sortedAnimes.map((anime) => (
          <div key={anime.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <AnimeCard
              anime={anime}
              onIncrement={handleUpdateAnimeEpisodes}
              onToggleFavorite={handleToggleFavorite}
              valueLabels={VALUE_LABELS}
              badgeClasses={BADGE_CLASSES}
            />
          </div>
        ))}

        {sortedAnimes.length === 0 && (
          <div className="col-12 text-center py-5">
            <div
              className="alert bg-body border shadow-sm d-inline-block p-4"
              role="alert"
            >
              <h5 className="alert-heading text-body-secondary fw-bold mb-1">
                Nenhum dado encontrado
              </h5>
              <p className="mb-0 text-body-secondary small">
                Tente ajustar os seus filtros.
              </p>
            </div>
          </div>
        )}
      </div>
      <AddAnimeModal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveAnime}
        filterOptions={FILTER_OPTIONS}
      />
    </main>
  );
}
