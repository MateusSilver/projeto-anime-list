/* eslint-disable @next/next/no-img-element */
import { Pen } from "lucide-react";
import { VALUE_LABELS } from "@/constants/animeConstants";
import { Anime } from "@/types/anime";

interface AnimeDetailsSectionProps {
  anime: Anime & { tags?: string[] };
  globalUserCount: number;
  globalAverageScore: number;
  getHighResImageUrl: (url?: string) => string;
  onOpenImageModal: () => void;
  onOpenEdit: () => void;
}

export default function AnimeDetailsSection({
  anime,
  globalUserCount,
  globalAverageScore,
  getHighResImageUrl,
  onOpenImageModal,
  onOpenEdit,
}: AnimeDetailsSectionProps) {
  return (
    <div className="row g-5">
      {/* Coluna Esquerda: Imagem e Status Global */}
      <div className="col-12 col-md-4">
        <div
          className="border-0 shadow-sm overflow-hidden mb-3"
          style={{ cursor: "zoom-in" }}
          onClick={onOpenImageModal}
          title="Clique para ampliar a imagem"
        >
          <img
            src={getHighResImageUrl(anime.imageUrl)}
            alt={anime.title}
            className="img-fluid w-100"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        <div className="bg-body p-3 rounded-3 border text-center">
          <p className="text-muted small mb-1 fw-semibold">
            Estatística Global
          </p>
          <h5 className="fw-bold text-primary m-0">
            {globalUserCount}{" "}
            {globalUserCount === 1 ? "seguidor" : "seguidores"}
          </h5>
          <p className="text-muted fs-4 mb-0 fw-bold">
            Média:{" "}
            <span className="text-primary">
              {globalAverageScore?.toFixed(2) || "S/N"}
            </span>
          </p>
          <span className="text-primary font-italic small mt-2">
            {anime.favorite ? "Favorito" : ""}
          </span>
        </div>
      </div>

      {/* Coluna Direita: Detalhes, Tags e Comentários */}
      <div className="col-12 col-md-8">
        <h1 className="fw-bold mb-2">{anime.title}</h1>

        <div className="d-flex flex-wrap gap-2 mb-4">
          <span className="badge bg-primary fs-6">
            {VALUE_LABELS[anime.status] || anime.status}
          </span>
          <span className="badge bg-secondary fs-6">{anime.type}</span>
          <span className="badge bg-warning text-dark fs-6">
            Nota: {anime.score || "S/N"}
          </span>
          <span className="badge bg-info text-dark fs-6">
            Episódios: {anime.watchedEpisodes || 0} / {anime.episodes || "?"}
          </span>
        </div>

        {/* Área de Tags */}
        <div className="mb-5">
          <h5 className="fw-bold border-bottom pb-2 mb-3">Tags</h5>
          <div className="d-flex flex-wrap gap-2">
            {anime.tags && anime.tags.length > 0 ? (
              anime.tags.map((tag, index) => (
                <span
                  key={index}
                  className="badge rounded-pill bg-body text-body border px-3 py-2"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-muted small">Nenhuma tag adicionada.</p>
            )}
          </div>
        </div>

        {/* Área de Comentários */}
        <div>
          <h5 className="fw-bold border-bottom pb-2 mb-3">
            As Minhas Anotações
          </h5>
          {anime.comments ? (
            <div className="bg-body p-4 rounded-3 border">
              <p
                className="m-0 text-body fst-italic"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {anime.comments}
              </p>
            </div>
          ) : (
            <div className="bg-light p-4 rounded-3 border border-dashed text-center">
              <p className="text-muted m-0">
                Você ainda não escreveu comentários para este anime.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={onOpenEdit}
            className="btn bg-primary text-white border-primary btn-outline-primary fw-semibold px-4 d-flex align-items-center gap-1"
          >
            <Pen size={18} fill="currentColor" /> Editar Dados
          </button>
        </div>
      </div>
    </div>
  );
}
