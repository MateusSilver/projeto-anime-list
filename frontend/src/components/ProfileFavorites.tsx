/* eslint-disable @next/next/no-img-element */
// src/components/ProfileFavorites.tsx
import Link from "next/link";
import { StarIcon } from "lucide-react";
import { Anime } from "@/types/anime"; // Reaproveitamos a tipagem

export default function ProfileFavorites({
  favoriteAnimes,
}: {
  favoriteAnimes: Anime[];
}) {
  return (
    <div>
      <h5 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <StarIcon size={22} className="text-warning" fill="#FFD700" />
        Favoritos (
        {favoriteAnimes?.length
          ? favoriteAnimes.length.toLocaleString("pt-BR")
          : 0}
        )
      </h5>

      {!favoriteAnimes || favoriteAnimes.length === 0 ? (
        <div className="bg-body p-4 rounded-4 text-center border border-dashed shadow-sm">
          <p className="text-muted m-0 small fw-semibold">
            Nenhum anime favoritado ainda.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {favoriteAnimes.map((anime) => (
            <div className="col-4 col-sm-3 col-md-2" key={anime.id}>
              <Link
                href={`/anime/${anime.id}`}
                className="text-decoration-none"
              >
                <div
                  className="card border-0 h-100 text-center overflow-hidden shadow-sm"
                  style={{ transition: "transform 0.2s" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <img
                    src={
                      anime.imageUrl || "https://placehold.co/200x300?text=Capa"
                    }
                    alt={anime.title}
                    className="card-img-top"
                    style={{ height: "120px", objectFit: "cover" }}
                  />
                  <div className="card-body p-2 d-flex align-items-center justify-content-center bg-body-tertiary">
                    <small
                      className="fw-bold text-body text-truncate d-block w-100"
                      style={{ fontSize: "11px" }}
                      title={anime.title}
                    >
                      {anime.title}
                    </small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
