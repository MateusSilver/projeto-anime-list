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

export default function List({
  initialAnimes,
}: {
  initialAnimes: ListProps[];
}) {
  const [sortBy, setSortBy] = useState<string>("status");
  const sortedAnimes = useMemo(() => {
    const animesCopy = [...initialAnimes];
    const PesoStatus: Record<string, number> = {
      Watching: 1,
      Completed: 2,
      "On-Hold": 3,
      Dropped: 4,
      "Plan to Watch": 5,
    };
    return animesCopy.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "status":
          const pesoA = PesoStatus[a.status] || 999;
          const pesoB = PesoStatus[b.status] || 999;
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
  }, [initialAnimes, sortBy]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 border rounded flex-wrap gap-3">
        <span>{sortedAnimes.length} animes</span>
        <div className="d-flex align-items-center gap-2">
          <label
            htmlFor="sortSelect"
            className="form-label w-100 m-0 text-muted fw-semibold"
          >
            Sort by:
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
                    className="card-title text-truncate mb-2"
                    title={anime.title}
                  >
                    {anime.title}
                  </h5>

                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-dark text-capitalize">
                      {anime.type === "Movie"
                        ? "Filme"
                        : anime.type === "ONA"
                          ? "Streaming"
                          : anime.type === "OVA"
                            ? "DVD"
                            : anime.type === "Special"
                              ? "Especial"
                              : "TV"}
                    </span>
                    <span className="badge bg-primary">
                      ★ {anime.score ? anime.score.toFixed(0) : "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progresso:</span>
                    <span className="text-truncate fw-semibold">
                      {anime.watchedEpisodes} / {anime.episodes || "??"} ep
                    </span>
                  </div>
                  <div className="progress bg-dark" style={{ height: "6px" }}>
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
                    className="mt-3 pt-2 border-top border-secondary d-flex justify-content-between align-items-center text-uppercase"
                    style={{ borderColor: "var(--bs-card-border-color)" }}
                  >
                    <small className="text-muted text-capitalize">
                      Status:
                    </small>
                    <span
                      className={`badge ${
                        anime.status === "Completed"
                          ? "bg-info"
                          : anime.status === "On-Hold"
                            ? "bg-warning text-dark"
                            : anime.status === "Dropped"
                              ? "bg-danger text-white"
                              : anime.status === "Plan to Watch"
                                ? "bg-dark text-white"
                                : anime.status === "Watching"
                                  ? "bg-success text-white"
                                  : "bg-warning text-dark"
                      }`}
                    >
                      {anime.status === "Completed"
                        ? "Concluído"
                        : anime.status === "On-Hold"
                          ? "Pausado"
                          : anime.status === "Dropped"
                            ? "Abandonado"
                            : anime.status === "Plan to Watch"
                              ? "Planejo ver"
                              : anime.status === "Watching"
                                ? "Assistindo"
                                : anime.status || "Desconecido"}
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
              className="alert alert-dark border border-danger d-inline-block p-4"
              role="alert"
            >
              <h4 className="alert-heading text-danger fw-bold">
                Nenhum dado encontrado
              </h4>
              <p className="mb-0 text-muted">A sua API não retornou dados.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
