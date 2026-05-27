/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import AnimeCard from "./AnimeCard";
import AnimeControls from "./AnimeControls";

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
  const [isFetchingJikanData, setIsFetchingJikanData] =
    useState<boolean>(false);
  const [newAnimeTitle, setNewAnimeTitle] = useState<Partial<ListProps>>({
    malId: 0,
    title: "",
    type: "TV",
    episodes: 0,
    watchedEpisodes: 0,
    score: 0,
    status: "Plan to Watch",
    comments: "",
    imageUrl: "",
  });

  const currentFilterOptions = FILTER_OPTIONS[filterCategory] || [];

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

  const handleUpdateAnimeEpisodes = (id: number) => {
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

  const fetchJikanData = async () => {
    if (!newAnimeTitle.malId) return;
    setIsFetchingJikanData(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${newAnimeTitle.malId}`,
      );
      if (!response.ok) throw new Error("Anime não encontrado");
      const { data } = await response.json();

      setNewAnimeTitle((prev) => ({
        ...prev,
        title: data.title,
        imageUrl:
          data.images?.jpg?.large_image_url || data.images?.jpg?.image_url,
        episodes: data.episodes || 0,
        type: data.type || "TV",
        score: data.score || 0,
      }));
    } catch (error) {
      alert(
        "Erro ao buscar dados do anime. Verifique o MAL ID e tente novamente.",
      );
    } finally {
      setIsFetchingJikanData(false);
    }
  };

  const handleAddAnime = () => {
    if (!newAnimeTitle.title) {
      alert("Título do anime é obrigatório.");
      return;
    }

    const novoAnime: ListProps = {
      ...newAnimeTitle,
      id: Math.floor(Math.random() * 10000),
      comments: "",
    } as ListProps;

    setAnimes([novoAnime, ...animes]);
    setNewAnimeTitle({
      malId: 0,
      title: "",
      type: "TV",
      episodes: 0,
      watchedEpisodes: 0,
      score: 0,
      status: "Plan to Watch",
      comments: "",
      imageUrl: "",
    });
    setIsPopupOpen(false);
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
      {isPopupOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-bottom-0 bg-light pb-0">
                <h5 className="modal-title fw-semibold text-dark">
                  Catalogar novo Anime
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsPopupOpen(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center bg-light p-3 border-0">
                    {newAnimeTitle.imageUrl ? (
                      <img
                        src={newAnimeTitle.imageUrl}
                        alt={newAnimeTitle.title}
                        className="img-fluid rounded shadow-sm mb-3"
                        style={{ maxHeight: "250px", objectFit: "contain" }}
                      />
                    ) : (
                      <div
                        className="bg-secondary d-flex align-items-center justify-content-center p-3 rounded shadow-sm"
                        style={{
                          width: "160px",
                          height: "230px",
                          opacity: 0.2,
                        }}
                      >
                        <div className="text-center text-white fw-semibold">
                          Imagem não disponível
                        </div>
                      </div>
                    )}
                    <label className="form-label text-muted fw-semibold small w-100">
                      Anime List ID
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control fw-semibold"
                        placeholder="0000"
                        value={newAnimeTitle.malId || ""}
                        onChange={(e) =>
                          setNewAnimeTitle({
                            ...newAnimeTitle,
                            malId: Number(e.target.value),
                          })
                        }
                      />
                      <button
                        className="btn btn-dark fw-semibold"
                        type="button"
                        onClick={fetchJikanData}
                        disabled={isFetchingJikanData}
                      >
                        {isFetchingJikanData ? "Buscando..." : "Buscar"}
                      </button>
                    </div>
                    <small
                      className="text-muted mt-2 text-center"
                      style={{ fontSize: "11px" }}
                    >
                      Digite o ID do anime no MyAnimeList para buscar seus
                      dados.
                    </small>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-muted fw-semibold">
                        Título
                      </label>
                      <input
                        type="text"
                        className="form-control fw-semibold"
                        placeholder="Digite o título do anime"
                        value={newAnimeTitle.title || ""}
                        onChange={(e) =>
                          setNewAnimeTitle({
                            ...newAnimeTitle,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 g-2 row">
                      <div className="col-6">
                        <label className="form-label text-muted fw-semibold small">
                          Status
                        </label>
                        <select
                          className="form-select fw-semibold"
                          value={newAnimeTitle.status}
                          onChange={(e) =>
                            setNewAnimeTitle({
                              ...newAnimeTitle,
                              status: e.target.value,
                            })
                          }
                        >
                          {FILTER_OPTIONS.status.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label text-muted fw-semibold small">
                          Tipo
                        </label>
                        <select
                          className="form-select fw-semibold"
                          value={newAnimeTitle.type}
                          onChange={(e) =>
                            setNewAnimeTitle({
                              ...newAnimeTitle,
                              type: e.target.value,
                            })
                          }
                        >
                          {FILTER_OPTIONS.type.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6 mt-3">
                        <label>Total de episódios</label>
                        <input
                          type="number"
                          className="form-control fw-semibold"
                          placeholder="Digite o total de episódios"
                          value={newAnimeTitle.episodes || 0}
                          onChange={(e) =>
                            setNewAnimeTitle({
                              ...newAnimeTitle,
                              episodes: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label text-muted fw-semibold small">
                        Episódios assistidos
                      </label>
                      <input
                        type="number"
                        className="form-control fw-semibold"
                        placeholder="Digite o número de episódios assistidos"
                        value={newAnimeTitle.watchedEpisodes || 0}
                        onChange={(e) =>
                          setNewAnimeTitle({
                            ...newAnimeTitle,
                            watchedEpisodes: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="form-label text-muted fw-semibold small mt-3">
                        Nota (0-10)
                      </label>
                      <input
                        type="number"
                        className="form-control fw-semibold"
                        placeholder="Digite a nota (0-10)"
                        value={newAnimeTitle.score || 0}
                        onChange={(e) =>
                          setNewAnimeTitle({
                            ...newAnimeTitle,
                            score: Math.max(
                              0,
                              Math.min(10, parseFloat(e.target.value) || 0),
                            ),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button
                  type="button"
                  className="btn btn-primary fw-semibold"
                  onClick={handleAddAnime}
                >
                  Adicionar Anime
                </button>
                <button
                  type="button"
                  className="btn btn-secondary fw-semibold"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
