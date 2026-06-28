/* eslint-disable @next/next/no-img-element */
import { Loader2, Search } from "lucide-react";
import { Anime } from "@/types/anime";

interface EditAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editForm: Partial<Anime & { tags: string[] }>;
  setEditForm: (form: Partial<Anime & { tags: string[] }>) => void;
  tagsInput: string;
  setTagsInput: (tags: string) => void;
  isSaving: boolean;
  isFetching: boolean;
  onSave: () => void;
  onFetchJikan: () => void;
}

export default function EditAnimeModal({
  isOpen,
  onClose,
  editForm,
  setEditForm,
  tagsInput,
  setTagsInput,
  isSaving,
  isFetching,
  onSave,
  onFetchJikan,
}: EditAnimeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
            <h5 className="modal-title fw-bold text-body">
              Editar Dados do Anime
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Coluna Esquerda */}
              <div className="col-12 col-md-4 d-flex flex-column align-items-center justify-content-start bg-body-tertiary p-4 border-0 rounded-4">
                {editForm.imageUrl ? (
                  <img
                    src={editForm.imageUrl}
                    alt={editForm.title || "Capa do Anime"}
                    className="img-fluid rounded shadow-sm mb-4"
                    style={{ maxWidth: "250px", height: "auto" }}
                  />
                ) : (
                  <div
                    className="bg-secondary d-flex align-items-center justify-content-center rounded shadow-sm mb-4"
                    style={{ width: "180px", height: "250px", opacity: 0.2 }}
                  >
                    <div className="text-center text-white fw-semibold px-3">
                      Imagem não disponível
                    </div>
                  </div>
                )}

                <div className="w-100 mb-3">
                  <label className="form-label text-muted fw-semibold small">
                    MyAnimeList ID
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control fw-semibold"
                      placeholder="0000"
                      value={editForm.malId || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          malId:
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value),
                        })
                      }
                    />
                    <button
                      className="btn btn-primary fw-semibold d-flex gap-1 align-items-center"
                      type="button"
                      onClick={onFetchJikan}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <>
                          <Loader2 size={18} className="icon-spin" />{" "}
                          Buscando...
                        </>
                      ) : (
                        <Search size={18} />
                      )}
                    </button>
                  </div>
                  <small
                    className="text-muted mt-2 d-block text-center"
                    style={{ fontSize: "11px" }}
                  >
                    Puxe título, capa e total de episódios oficiais usando o ID.
                  </small>
                </div>

                <div className="w-100 pt-2 border-top">
                  <label className="form-label text-muted fw-semibold small mt-2">
                    Ou insira a URL da Capa Manualmente
                  </label>
                  <input
                    type="url"
                    className="form-control fw-semibold"
                    placeholder="https://exemplo.com/poster.jpg"
                    value={editForm.imageUrl || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Coluna Direita (Formulário Principal) */}
              <div className="col-12 col-md-8">
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold small">
                    Título
                  </label>
                  <input
                    type="text"
                    className="form-control fw-semibold fs-5 bg-body"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4 mt-2">
                  <div
                    className="form-check form-switch p-0 d-flex align-items-center border-none"
                    style={{ width: "fit-content" }}
                  >
                    <input
                      className="m-0 ms-2 bg-body"
                      type="checkbox"
                      role="switch"
                      id="editFavoriteSwitch"
                      style={{
                        width: "40px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      checked={editForm.favorite || false}
                      onChange={(e) =>
                        setEditForm({ ...editForm, favorite: e.target.checked })
                      }
                    />
                    <label
                      className="form-check-label fw-semibold pe-3"
                      htmlFor="editFavoriteSwitch"
                      style={{ cursor: "pointer" }}
                    >
                      É um Favorito
                    </label>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold small">
                      Status
                    </label>
                    <select
                      className="form-select fw-semibold bg-body"
                      value={editForm.status || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                    >
                      <option value="Watching">Assistindo</option>
                      <option value="Completed">Concluído</option>
                      <option value="On-Hold">Pausado</option>
                      <option value="Dropped">Abandonado</option>
                      <option value="Plan to Watch">Planejo Assistir</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold small">
                      Tipo
                    </label>
                    <select
                      className="form-select fw-semibold bg-body"
                      value={editForm.type || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, type: e.target.value })
                      }
                    >
                      <option value="TV">TV</option>
                      <option value="Movie">Filme</option>
                      <option value="OVA">OVA</option>
                      <option value="ONA">ONA</option>
                      <option value="Special">Especial</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label text-muted fw-semibold small">
                      Episódios (Total)
                    </label>
                    <input
                      type="number"
                      className="form-control fw-semibold bg-body"
                      min="0"
                      value={editForm.episodes || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          episodes: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted fw-semibold small">
                      Assistidos
                    </label>
                    <input
                      type="number"
                      className="form-control fw-semibold bg-body"
                      min="0"
                      value={editForm.watchedEpisodes || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          watchedEpisodes: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted fw-semibold small">
                      Nota (0-10)
                    </label>
                    <input
                      type="number"
                      className="form-control fw-semibold text-primary bg-body"
                      min="0"
                      max="10"
                      step="0.1"
                      value={editForm.score || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditForm({
                          ...editForm,
                          score:
                            val === ""
                              ? 0
                              : Math.max(0, Math.min(10, parseFloat(val))),
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold small">
                    Tags (separadas por vírgula)
                  </label>
                  <textarea
                    className="form-control fw-semibold bg-body"
                    placeholder="ação, aventura, isekai"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label text-muted fw-semibold small">
                    Anotações Pessoais
                  </label>
                  <textarea
                    className="form-control fw-semibold bg-body"
                    rows={4}
                    placeholder="Escreva as suas impressões, onde parou, etc..."
                    value={editForm.comments || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, comments: e.target.value })
                    }
                    style={{ resize: "none" }}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top-0 pt-0 pb-4 px-4">
            <button
              type="button"
              className="btn btn-body border-none hover:border-none fw-semibold px-4"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary bg-primary border-primary fw-bold px-3"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
