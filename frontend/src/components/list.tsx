/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";

interface ListProps {
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

  const currentFilterOptions = FILTER_OPTIONS[filterCategory] || [];

  const handleFilterValueChange = (category: string) => {
    setFilterCategory(category);
    setFilterValue("");
  };

  const sortedAnimes = useMemo(() => {
    let animesCopy = [...initialAnimes];

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
  }, [initialAnimes, sortBy, filterCategory, filterValue]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 border rounded flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex flex-column align-items-center gap-2">
            <label
              htmlFor="filterCategorySelect"
              className="form-label w-100 m-0 text-muted fw-semibold"
            >
              Filtrar por:
            </label>
            <select
              id="filterCategorySelect"
              className="form-select border-0 bg-light fw-semibold"
              value={filterCategory}
              style={{ minWidth: "200px", color: "var(--bs-body-color)" }}
              onChange={(e) => handleFilterValueChange(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="status">Status</option>
              <option value="type">Tipo</option>
            </select>
          </div>

          <div className="d-flex flex-column align-items-center gap-2">
            <label
              htmlFor="filterValueSelect"
              className="form-label w-100 m-0 text-muted fw-semibold"
            >
              Opção:
            </label>
            <select
              id="filterValueSelect"
              className="form-select border-0 bg-light fw-semibold"
              value={filterValue}
              style={{ minWidth: "200px", color: "var(--bs-body-color)" }}
              onChange={(e) => setFilterValue(e.target.value)}
              disabled={filterCategory === "all"}
            >
              <option value="">
                {filterCategory === "all" ? "Selecione" : "Selecione o tipo"}
              </option>
              {currentFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex flex-column align-items-center gap-2">
          <label
            htmlFor="sortSelect"
            className="form-label w-100 m-0 text-muted fw-semibold"
          >
            Ordenar por:
          </label>
          <select
            id="sortSelect"
            className="form-select border-0 bg-light fw-semibold"
            value={sortBy}
            style={{ minWidth: "200px", color: "var(--bs-body-color)" }}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="status">Status</option>
            <option value="name">Nome</option>
            <option value="scoreDesc">Maior Nota</option>
            <option value="scoreAsc">Menor Nota</option>
          </select>
        </div>
      </div>

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
        <p className="m-0 text-muted fw-semibold">
          <span className="text-primary fs-5">{sortedAnimes.length}</span>{" "}
          Animes encontrados
        </p>
      </div>

      <div className="row g-2">
        {sortedAnimes.map((anime) => (
          <div key={anime.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <div className="card anime-card text-white">
              <div className="card-img-container">
                <img
                  src={
                    anime.imageUrl ||
                    "https://placehold.co/400x600/EDF2F7/718096?text=Sem+Capa"
                  }
                  alt={anime.title}
                  className="anime-poster"
                  loading="lazy"
                />
              </div>

              <div className="card-body d-flex flex-column justify-content-between p-3">
                <div>
                  <h5
                    className="card-title text-truncate mb-2 text-dark"
                    title={anime.title}
                  >
                    {anime.title}
                  </h5>

                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-dark text-capitalize">
                      {VALUE_LABELS[anime.type] || anime.type || "Desconhecido"}
                    </span>
                    <span className="badge bg-primary">
                      ★ {anime.score ? anime.score.toFixed(0) : "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progresso:</span>
                    <span className="text-truncate fw-semibold text-dark">
                      {anime.watchedEpisodes} / {anime.episodes || "??"}
                    </span>
                  </div>
                  <div
                    className="progress"
                    style={{ height: "6px", backgroundColor: "#EDF2F7" }}
                  >
                    <div
                      className="progress-bar bg-primary rounded-pill"
                      role="progressbar"
                      style={{
                        width: anime.episodes
                          ? `${(anime.watchedEpisodes / anime.episodes) * 100}%`
                          : "0%",
                      }}
                    ></div>
                  </div>

                  <div
                    className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center text-uppercase"
                    style={{ borderColor: "rgba(0,0,0,0.05)" }}
                  >
                    <small className="text-muted text-capitalize fw-semibold">
                      Status:
                    </small>
                    <span
                      className={`badge ${BADGE_CLASSES[anime.status] || "bg-secondary text-white"}`}
                    >
                      {VALUE_LABELS[anime.status] ||
                        anime.status ||
                        "Desconhecido"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
    </>
  );
}
