import { Loader2 } from "lucide-react";
import AnimeCard from "./AnimeCard";
import { Anime } from "@/types/anime";
import { BADGE_CLASSES, VALUE_LABELS } from "@/constants/animeConstants";

interface AnimeGridProps {
  animes: Anime[];
  isLoading: boolean;
  onIncrement: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export default function AnimeGrid({
  animes,
  isLoading,
  onIncrement,
  onToggleFavorite,
}: AnimeGridProps) {
  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5 text-body-secondary">
        <Loader2 size={48} className="icon-spin text-primary mb-3" />
        <h5 className="fw-semibold">Carregando seu acervo...</h5>
      </div>
    );
  }

  if (animes.length === 0) {
    return (
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
    );
  }

  return (
    <div className="row g-2">
      {animes.map((anime) => (
        <div key={anime.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
          <AnimeCard
            anime={anime}
            onIncrement={onIncrement}
            onToggleFavorite={onToggleFavorite}
            valueLabels={VALUE_LABELS}
            badgeClasses={BADGE_CLASSES}
          />
        </div>
      ))}
    </div>
  );
}
