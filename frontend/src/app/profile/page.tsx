/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { ArrowLeft, Mail, Loader2, Save, StarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserProfile } from "@/types/user";

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();

        console.log("🔍 Dados recebidos do Java:", data);
        setUserProfile(data);
        setEditName(data.name);
        setEditImage(data.profileImageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
    };
    loadProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          profileImageUrl: editImage,
          newPassword: editPassword,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
        setEditPassword("");
        fetchProfile();
      } else {
        setMessage({
          type: "danger",
          text: "Erro de conexão com banco de dados.",
        });
      }
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Ocorreu um erro ao atualizar o perfil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return <div className="text-center mt-5">Carregando espaço...</div>;

  if (!userProfile) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">
          Não foi possível carregar os dados do perfil.
        </h4>
        <Link
          href="/"
          className="btn btn-primary mt-3 d-flex align-items-center gap-1"
        >
          <ArrowLeft size={16} /> Voltar ao Acervo
        </Link>
      </div>
    );
  }

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold m-0">Meu Perfil</h1>
        <Link
          href="/"
          className="d-flex align-items-center justify-content-between btn btn-outline-secondary rounded-pill px-3"
        >
          <ArrowLeft size={24} />
          Voltar
        </Link>
      </div>

      <div className="row g-4">
        {/* COLUNA ESQUERDA: Exibição da Foto e Formulário */}
        <div className="col-12 col-lg-4">
          {/* Cartão de Identificação */}
          <div className="card border-0 rounded-4 p-4 text-center mb-4 bg-body">
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
            <p className="text-muted small m-0">
              {" "}
              <Mail size={12} /> {userProfile.email}
            </p>
          </div>

          {/* Cartão de Edição de Dados */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h6 className="fw-bold mb-3 border-bottom pb-2">Editar Dados</h6>

            {message.text && (
              <div
                className={`alert alert-${message.type} py-2 small fw-semibold`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  Nome de Exibição
                </label>
                <div className="d-flex gap-1 align-items-center">
                  <input
                    type="text"
                    className="form-control fw-semibold"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  Avatar
                </label>
                <input
                  type="url"
                  className="form-control fw-semibold"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={editImage}
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
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold d-flex align-items-center gap-1 justify-content-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="icon-spin" size={18} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* COLUNA DIREITA: Estatísticas e Favoritos */}
        <div className="col-12 col-lg-8">
          {/* PAINEL DE ESTATÍSTICAS */}
          <div className="border border-secondary-subtle rounded-4 overflow-hidden mb-4 d-flex flex-column">
            <table className="table m-0 border-0">
              <tbody>
                <tr>
                  <td className="p-3 border-bottom border-secondary-subtle">
                    Total
                  </td>
                  <td className="p-3 border-bottom border-secondary-subtle fw-bold text-end">
                    {userProfile.totalAnimes
                      ? userProfile.totalAnimes.toLocaleString("pt-BR")
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-bottom border-secondary-subtle">
                    Completos
                  </td>
                  <td className="p-3  border-bottom border-secondary-subtle fw-bold text-end">
                    {userProfile.completed
                      ? userProfile.completed.toLocaleString("pt-BR")
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-bottom border-secondary-subtle">
                    Assistindo
                  </td>
                  <td className="p-3  border-bottom border-secondary-subtle fw-bold text-end">
                    {userProfile.watching
                      ? userProfile.watching.toLocaleString("pt-BR")
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-bottom border-secondary-subtle">
                    Pausados
                  </td>
                  <td className="p-3  border-bottom border-secondary-subtle fw-bold text-end">
                    {userProfile.onHold
                      ? userProfile.onHold.toLocaleString("pt-BR")
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-bottom border-secondary-subtle">
                    Abandonados
                  </td>
                  <td className="p-3  border-bottom border-secondary-subtle fw-bold text-end">
                    {userProfile.dropped
                      ? userProfile.dropped.toLocaleString("pt-BR")
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-bottom border-secondary-subtle">
                    Episódios Assistidos
                  </td>
                  <td className="p-3  border-bottom border-secondary-subtle fw-bold text-end">
                    {userProfile.totalEpisodesWatched
                      ? userProfile.totalEpisodesWatched.toLocaleString("pt-BR")
                      : 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* PAINEL DE FAVORITOS (Miniaturas) */}
          <h5 className="fw-bold mb-3 border-bottom pb-2">
            <StarIcon size={22} /> Favoritos (
            {userProfile.favoriteAnimes?.length
              ? userProfile.favoriteAnimes.length.toLocaleString("pt-BR")
              : 0}
            )
          </h5>

          {!userProfile.favoriteAnimes ||
          userProfile.favoriteAnimes.length === 0 ? (
            <div className="bg-body p-4 rounded-4 text-center border border-dashed">
              <p className="text-muted m-0 small fw-semibold">
                Nenhum anime favoritado ainda.
              </p>
            </div>
          ) : (
            <div className="row g-3">
              {userProfile.favoriteAnimes.map((anime) => (
                <div className="col-4 col-sm-3 col-md-2" key={anime.id}>
                  <Link
                    href={`/anime/${anime.id}`}
                    className="text-decoration-none"
                  >
                    <div
                      className="card border-0 h-100 text-center overflow-hidden"
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
                          anime.imageUrl ||
                          "https://placehold.co/200x300?text=Capa"
                        }
                        alt={anime.title}
                        className="card-img-top"
                        style={{ height: "120px", objectFit: "cover" }}
                      />
                      <div className="card-body p-2 d-flex align-items-center justify-content-center">
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
      </div>
    </main>
  );
}
