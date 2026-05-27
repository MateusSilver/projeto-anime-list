"use client";
import { useState, useMemo } from "react";
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

export default function List({
  initialAnimes,
}: {
  initialAnimes: ListProps[];
}) {
  const [sortBy, setSortBy] = useState<string>("status");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [animes, setAnimes] = useState<ListProps[]>(initialAnimes);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleFilterValueChange = (category: string) => {
    setFilterCategory(category);
    setFilterValue("");
  };

  const sortedAnimes = useMemo(() => {
    let animesCopy = [...animes];

    if (filterCategory !== "all" && filterValue) {
      animesCopy = animesCopy.filter((anime) => {
        if (filterCategory === "status") {
          return (
            anime.status?.trim().toLowerCase() === filterValue.toLowerCase()
          );
        }
        if (filterCategory === "type") {
          return (
            anime.type?.toUpperCase().trim() ===
            filterValue.toUpperCase().trim()
          );
        }
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
  }, [animes, sortBy, filterCategory, filterValue]);

  const handleUpdateAnimeEpisodes = async (id: number) => {
    console.log(`Incrementando episódios para anime ID: ${id}`);
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
        `anime status de ${animeAtual.title} atualizado para 'Concluído'`,
      );
      novoStatus = "Completed";
    } else if (animeAtual.status !== "Watching") {
      window.alert(
        `anime status de ${animeAtual.title} atualizado para 'Assistindo'`,
      );
      novoStatus = "Watching";
    }

    const animeAtualizado = {
      ...animeAtual,
      watchedEpisodes: updatedEpisodes,
      status: novoStatus,
    };

    setAnimes(
      animes.map((anime) => (anime.id === id ? animeAtualizado : anime)),
    );

    try {
      const response = await fetch(`http://localhost:8080/api/animes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
    }

    const updatedAnimes = animes.map((anime) => {
      if (anime.id !== id) {
        return anime;
      }
      if (anime.episodes && anime.watchedEpisodes >= anime.episodes) {
        return anime;
      }
      const updatedEpisodes = anime.watchedEpisodes + 1;
      let novoStatus = anime.status;
      if (anime.episodes && anime.episodes === updatedEpisodes) {
        window.alert(
          `anime status de ${anime.title} atualizado para 'Concluído'`,
        );
        novoStatus = "Completed";
      }
      if (anime.status !== "Watching") {
        novoStatus = "Watching";
        window.alert(
          `anime status de ${anime.title} atualizado para 'Assistindo'`,
        );
      }
      return {
        ...anime,
        watchedEpisodes: updatedEpisodes,
        status: novoStatus,
      };
    });
    setAnimes(updatedAnimes);
  };

  const handleSaveAnime = async (anime: ListProps) => {
    setAnimes([anime, ...animes]);
    setIsPopupOpen(false);
    try {
      const { id, ...dadosParaSalvar } = anime;
      const response = await fetch("http://localhost:8080/api/animes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaSalvar),
      });

      if (!response.ok) {
        throw new Error(`Falha ao persistir dados: ${response.statusText}`);
      }

      const animeSalvo = await response.json();
      setAnimes((prevAnimes) =>
        prevAnimes.map((a) => (a.id === anime.id ? animeSalvo : a)),
      );
    } catch (error) {
      console.error("Error saving anime:", error);
      alert("Ocorreu um erro ao salvar o anime. Por favor, tente novamente.");
      setAnimes((prevAnimes) => prevAnimes.filter((a) => a.id !== anime.id));
      alert("Ocorreu um erro ao salvar o anime. Por favor, tente novamente.");
    }
  };

  return (
    <>
      <AnimeControls
        filterCategory={filterCategory}
        onFilterCategoryChange={handleFilterValueChange}
        filterValue={filterValue}
        onFilterValueChange={setFilterValue}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onOpenPopUp={() => setIsPopupOpen(true)}
        filterOptions={FILTER_OPTIONS}
      />

      <div
        className="mb-4 d-flex justify-content-between align-items-end border-bottom pb-2"
        style={{ borderColor: "var(--bs-card-border-color)" }}
      >
        <div>
          {filterCategory !== "all" && filterValue && (
            <p className="m-0 text-muted fw-medium">
              Filtrando por:{" "}
              <span className="text-dark">
                {CATEGORY_LABELS[filterCategory]}
              </span>{" "}
              -{" "}
              <span className="text-primary">
                {VALUE_LABELS[filterValue] || filterValue}
              </span>
            </p>
          )}
        </div>
        {filterCategory !== "all" && (
          <p className="m-0 text-muted fw-semibold">
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
              valueLabels={VALUE_LABELS}
              badgeClasses={BADGE_CLASSES}
            />
          </div>
        ))}

        {sortedAnimes.length === 0 && (
          <div className="col-12 text-center py-5">
            <div
              className="alert bg-white border shadow-sm d-inline-block p-4"
              role="alert"
            >
              <h5 className="alert-heading text-muted fw-bold mb-1">
                Nenhum dado encontrado
              </h5>
              <p className="mb-0 text-muted small">
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
    </>
  );
}
