/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ListProps } from "@/components/List";
import { Save, Loader2, Search } from "lucide-react";

interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (anime: ListProps) => void;
  filterOptions: Record<string, { value: string; label: string }[]>;
}

const DEFAULT_ANIME: Partial<ListProps> = {
  malId: 0,
  title: "",
  imageUrl: "",
  status: "Plan to Watch",
  score: undefined,
  episodes: undefined,
  watchedEpisodes: undefined,
  type: "TV",
};

export default function AddAnimeModal({
  isOpen,
  onClose,
  onSave,
  filterOptions,
}: AddAnimeModalProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [newAnime, setNewAnime] = useState<Partial<ListProps>>(DEFAULT_ANIME);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setNewAnime(DEFAULT_ANIME);
    onClose();
  };

  const fetchJikanData = async () => {
    if (!newAnime.malId) return;

    setIsFetching(true);

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${newAnime.malId}`,
      );

      if (response.status === 429) {
        throw new Error(
          "Limite de requisições atingido. Por favor, tente novamente mais tarde.",
        );
      }

      const responseJson = await response.json();
      if (!responseJson.data) {
        throw new Error("ID não encontrado no Myanimelist");
      }

      const data = responseJson.data;

      setNewAnime((prev) => ({
        ...prev,
        title: data.title || prev.title,
        imageUrl:
          data.images?.jpg?.large_image_url || data.images?.jpg?.image_url,
        episodes: data.episodes || 12,
        type: data.type || "TV",
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Ocorreu um erro ao buscar os dados do anime.");
      } else {
        alert("Ocorreu um erro ao buscar os dados do anime.");
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleInternalSave = () => {
    if (!newAnime.title) {
      alert("Por favor, insira um título para o anime.");
      return;
    }
    setIsSaving(true);

    const animeToSave = {
      ...newAnime,
      id: Math.floor(Math.random() * 10000),
      comments: "",
      score: newAnime.score || 0,
      episodes: newAnime.episodes || 0,
      watchedEpisodes: newAnime.watchedEpisodes || 0,
    } as ListProps;

    onSave(animeToSave);
    setNewAnime(DEFAULT_ANIME);
    setIsSaving(false);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="bg-body modal-content border-0 shadow-lg">
          <div className="bg-body modal-header border-bottom-0 bg-light pb-0">
            <h5 className="modal-title fw-semibold text-body">
              Catalogar novo Anime
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center bg-body-secondary p-3 border-0 rounded">
                {newAnime.imageUrl ? (
                  <img
                    src={newAnime.imageUrl}
                    alt={newAnime.title}
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
                    <div className="text-center text-body fw-semibold">
                      Imagem não disponível
                    </div>
                  </div>
                )}
                <label className="form-label text-body-secondary fw-semibold small w-100">
                  Anime List ID
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="bg-body text-body form-control fw-semibold"
                    placeholder="0000"
                    value={newAnime.malId || ""}
                    onChange={(e) =>
                      setNewAnime({
                        ...newAnime,
                        malId: Number(e.target.value),
                      })
                    }
                  />
                  <button
                    className="btn btn-primary fw-semibold"
                    type="button"
                    title={
                      isFetching ? "Buscando" : "Buscar ID no My Anime List"
                    }
                    onClick={fetchJikanData}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="icon-spin" /> Buscando...
                      </>
                    ) : (
                      <>
                        <Search />
                      </>
                    )}
                  </button>
                </div>
                <small
                  className="text-body mt-2 text-center"
                  style={{ fontSize: "11px" }}
                >
                  Digite o ID do anime no MyAnimeList para buscar seus dados.
                </small>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-3">
                  <label className="form-label text-body-secondary fw-semibold">
                    Título
                  </label>
                  <input
                    type="text"
                    className="bg-body-secondary text-body form-control fw-semibold"
                    placeholder="Digite o título do anime"
                    value={newAnime.title || ""}
                    onChange={(e) =>
                      setNewAnime({
                        ...newAnime,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12 mt-3">
                  <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
                    <input
                      className="form-check-input m-0 bg-body-secondary"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckFavorite"
                      style={{
                        width: "40px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      checked={newAnime.favorite || false}
                      onChange={(e) =>
                        setNewAnime({
                          ...newAnime,
                          favorite: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="text-body-secondary form-check-label fw-bold text-dark"
                      htmlFor="flexSwitchCheckFavorite"
                      style={{ cursor: "pointer" }}
                    >
                      Marcar como Favorito
                    </label>
                  </div>
                </div>
                <div className="mb-3 g-2 row">
                  <div className="col-6 mt-3">
                    <label className="form-label text-body-secondary fw-semibold small">
                      Status
                    </label>
                    <select
                      className="bg-body-secondary text-body-secondary form-select fw-semibold"
                      value={newAnime.status}
                      onChange={(e) =>
                        setNewAnime({
                          ...newAnime,
                          status: e.target.value,
                        })
                      }
                    >
                      {filterOptions.status.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 mt-3">
                    <label className="form-label text-body-secondary fw-semibold small">
                      Tipo
                    </label>
                    <select
                      className="bg-body-secondary text-body-secondary form-select fw-semibold"
                      value={newAnime.type}
                      onChange={(e) =>
                        setNewAnime({
                          ...newAnime,
                          type: e.target.value,
                        })
                      }
                    >
                      {filterOptions.type.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 mt-3">
                    <label className="form-label text-body-secondary fw-semibold small">
                      Total de episódios
                    </label>
                    <input
                      type="number"
                      className="bg-body-secondary text-body form-control fw-semibold"
                      placeholder="00"
                      value={newAnime.episodes ?? ""}
                      onChange={(e) =>
                        setNewAnime({
                          ...newAnime,
                          episodes:
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3 g-2 row">
                  <div className="col-6 mt-3">
                    <label className="form-label text-body-secondary fw-semibold small">
                      Episódios assistidos
                    </label>
                    <input
                      type="number"
                      className="bg-body-secondary text-body form-control fw-semibold"
                      placeholder="00"
                      value={newAnime.watchedEpisodes ?? ""}
                      onChange={(e) =>
                        setNewAnime({
                          ...newAnime,
                          watchedEpisodes:
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-6 mt-3">
                    <label className="form-label text-body-secondary fw-semibold small">
                      Nota (0-10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="bg-body-secondary text-body form-control fw-semibold"
                      placeholder="Nota (0-10)"
                      value={newAnime.score ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewAnime({
                          ...newAnime,
                          score:
                            val === ""
                              ? undefined
                              : Math.max(0, Math.min(10, parseFloat(val))),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-top-0 pt-0">
            <button
              type="button"
              className="btn btn-primary fw-semibold d-flex align-items-center gap-2"
              onClick={handleInternalSave}
              disabled={isSaving}
              title={isSaving ? "Salvando" : "Salvar Titulo"}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="icon-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Salvar
                </>
              )}
            </button>
            <button
              type="button"
              title="cancelar"
              className="btn btn-secondary fw-semibold"
              onClick={handleClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
