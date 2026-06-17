/* eslint-disable @next/next/no-img-element */
"use client";
import { ArrowLeft, Mail, StarIcon, List } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UserProfile } from "@/types/user";

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id;

  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userId}/public-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();

        console.log("🔍 Dados recebidos do Java:", data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, userId]);

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
    };
    loadProfile();
  }, [fetchProfile]);

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
        <h1 className="fw-bold m-0">{userProfile.name}</h1>
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
          <div className="card border-0 rounded-4 p-4 text-center mb-4 bg-body-subtle">
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
          <Link
            className="text-decoration-none d-grid "
            href={`/user/${userId}/list`}
          >
            <button className="btn bg-primary text-white rounded-3 p-2 d-flex justify-content-center gap-1">
              <List />
              Ver Lista
            </button>
          </Link>
        </div>

        {/* COLUNA DIREITA: Estatísticas e Favoritos */}
        <div className="col-12 col-lg-8">
          {/* PAINEL DE ESTATÍSTICAS */}
          <div className="bg-body-subtle border border-secondary-subtle rounded-4 overflow-hidden mb-4 d-flex flex-column">
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
