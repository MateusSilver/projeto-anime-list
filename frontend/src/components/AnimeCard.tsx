/* eslint-disable @next/next/no-img-element */
import { ListProps } from "./List";
import Link from "next/link";

export interface AnimeCardProps {
  anime: ListProps;
  onIncrement: (id: number) => void;
  valueLabels: Record<string, string>;
  badgeClasses: Record<string, string>;
}

export default function AnimeCard({
  anime,
  onIncrement,
  valueLabels,
  badgeClasses,
}: AnimeCardProps) {
  return (
    <div className="card anime-card text-white">
      <Link href={`/anime/${anime.id}`}>
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
      </Link>

      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <Link className="text-decoration-none" href={`/anime/${anime.id}`}>
            <h5
              className="card-title text-truncate mb-2 text-dark"
              title={anime.title}
            >
              {anime.title}
            </h5>
          </Link>

          <div className="d-flex gap-2 mb-3">
            <span className="badge bg-dark text-capitalize">
              {valueLabels[anime.type] || anime.type || "Desconhecido"}
            </span>
            <span className="badge bg-primary">
              ★ {anime.score ? anime.score.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>Progresso:</span>
            <span className="text-truncate fw-semibold text-dark d-flex align-items-center gap-1">
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
              className={`badge ${badgeClasses[anime.status] || "bg-secondary text-white"}`}
            >
              {valueLabels[anime.status] || anime.status || "Desconhecido"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
