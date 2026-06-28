/* eslint-disable @next/next/no-img-element */
import { Mail, Save, Loader2 } from "lucide-react";
import { UserProfile } from "@/types/user";

interface ProfileEditSidebarProps {
  userProfile: UserProfile;
  editName: string;
  setEditName: (val: string) => void;
  editImage: string;
  setEditImage: (val: string) => void;
  editPassword: string;
  setEditPassword: (val: string) => void;
  isSaving: boolean;
  message: { type: string; text: string };
  onUpdate: (e: React.FormEvent) => void;
}

export default function ProfileEditSidebar({
  userProfile,
  editName,
  setEditName,
  editImage,
  setEditImage,
  editPassword,
  setEditPassword,
  isSaving,
  message,
  onUpdate,
}: ProfileEditSidebarProps) {
  return (
    <div className="col-12 col-lg-4">
      {/* Cartão de Identificação */}
      <div className="card border border-secondary-subtle bg-body-tertiary shadow-sm rounded-4 p-4 mb-3">
        <img
          src={
            userProfile.profileImageUrl ||
            "https://placehold.co/150x150?text=User"
          }
          alt="Avatar de perfil"
          className="rounded-circle mb-3 border border-3 border-body mx-auto"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <h4 className="fw-bold m-0 text-body">{userProfile.name}</h4>
        <p className="text-muted small m-0 d-flex align-items-center justify-content-center gap-1 mt-1">
          <Mail size={14} /> {userProfile.email}
        </p>
      </div>

      {/* Cartão de Edição de Dados */}
      <div className="card border border-secondary-subtle bg-body-tertiary shadow-sm rounded-4 p-4">
        <h6 className="fw-bold mb-3 border-bottom pb-2">Editar Dados</h6>

        {message.text && (
          <div className={`alert alert-${message.type} py-2 small fw-semibold`}>
            {message.text}
          </div>
        )}

        <form onSubmit={onUpdate}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">
              Nome de Exibição
            </label>
            <input
              type="text"
              className="form-control fw-semibold"
              value={editName || ""}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">
              Avatar (URL)
            </label>
            <input
              type="url"
              className="form-control fw-semibold"
              placeholder="https://exemplo.com/foto.jpg"
              value={editImage || ""}
              onChange={(e) => setEditImage(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">
              Nova Senha (Opcional)
            </label>
            <input
              type="password"
              className="form-control fw-semibold"
              placeholder="Deixe em branco para manter a atual"
              value={editPassword || ""}
              onChange={(e) => setEditPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="icon-spin" size={18} /> Salvando...
              </>
            ) : (
              <>
                <Save size={18} /> Salvar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
