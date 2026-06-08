/* eslint-disable @next/next/no-img-element */
import { ListProps } from "./List";
import Link from "next/link";

export interface AnimeCardProps {
  anime: ListProps;
  onIncrement: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  valueLabels: Record<string, string>;
  badgeClasses: Record<string, string>;
}

export default function AnimeCard({
  anime,
  onIncrement,
  onToggleFavorite,
  valueLabels,
  badgeClasses,
}: AnimeCardProps) {
  return (
    <div className="card anime-card bg-body text-body-secondary">
      <Link href={`/anime/${anime.id}`}>
        <div className="card-img-container position-relative">
          <button
            className="btn d-flex align-items-center justify-content-center btn-outline-danger position-absolute top-0 end-0 m-2"
            style={{
              top: "10px",
              right: "10px",
              borderRadius: "50%",
              zIndex: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              border: "none",
              width: "35px",
              height: "35px",
              padding: 0,
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(anime.id);
            }}
            title={
              anime.favorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
          >
            <span
              style={{
                fontSize: "1.2rem",
                lineHeight: 1,
                color: anime.favorite ? "#FFD700" : "#ddd",
                marginTop: "-2px",
              }}
            >
              {anime.favorite ? "★" : "☆"}
            </span>
          </button>
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
      </Link>

      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <Link
            className="text-decoration-none link-body-emphasis"
            href={`/anime/${anime.id}`}
          >
            <h5
              className="text-reset card-title text-truncate mb-2 fw-bold"
              title={anime.title}
            >
              {anime.title}
            </h5>
          </Link>

          <div className="d-flex gap-2 mb-3">
            <span className="badge bg-body-secondary text-body text-capitalize">
              {valueLabels[anime.type] || anime.type || "Desconhecido"}
            </span>
            <span className="badge bg-primary">
              ★ {anime.score ? anime.score.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between small text-body-secondary mb-1">
            <span className="fw-semibold">Progresso:</span>
            <span className="fw-semibold text-body d-flex align-items-center gap-1">
              <button
                className="btn btn-sm btn-outline-success p-0 d-flex align-items-center justify-content-center"
                style={{
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  borderRadius: "25px",
                }}
                title="Mais um episódio assistido"
                onClick={() => onIncrement(anime.id)}
                disabled={
                  !!anime.episodes && anime.watchedEpisodes >= anime.episodes
                }
              >
                +
              </button>
              {anime.watchedEpisodes} / {anime.episodes || "??"}
            </span>
          </div>
          <div className="progress bg-body-secondary" style={{ height: "6px" }}>
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
            className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center  text-uppercase"
            style={{ borderColor: "rgba(0,0,0,0.05)" }}
          >
            <small className="text-body-secondary text-capitalize fw-semibold">
              Status:
            </small>
            <span
              className={`badge ${badgeClasses[anime.status] || "bg-secondary text-body"}`}
            >
              {valueLabels[anime.status] || anime.status || "Desconhecido"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
