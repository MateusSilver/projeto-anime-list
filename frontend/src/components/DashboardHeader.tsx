/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { LogOutIcon } from "lucide-react";

interface DashboardHeaderProps {
  userBasicInfo: { name: string; image: string } | null;
  onLogout: () => void;
}

export default function DashboardHeader({
  userBasicInfo,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3 flex-wrap">
      <div>
        <h1 className="fw-bold text-truncate mb-1">
          <span className="text-primary">My Anime List Pro</span>
        </h1>
        <p className="text-muted m-0">
          Gerenciamento de acervo pessoal e estatísticas
        </p>
      </div>
      <div className="d-flex flex-row gap-2">
        <Link href="/profile" className="text-decoration-none">
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 border border-secondary-subtle rounded-pill bg-body-tertiary shadow-sm"
            style={{ transition: "all 0.2s", cursor: "pointer" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="Acessar Meu Perfil"
          >
            <img
              src={
                userBasicInfo?.image || "https://placehold.co/150x150?text=User"
              }
              alt="Avatar"
              className="rounded-circle border border-2 border-primary"
              style={{ width: "35px", height: "35px", objectFit: "cover" }}
            />
            <span className="fw-bold text-body m-0 d-none d-sm-block">
              {userBasicInfo?.name || "Meu Perfil"}
            </span>
          </div>
        </Link>

        <button
          onClick={onLogout}
          className="d-flex align-items-center justify-content-center gap-1 btn btn-outline-danger fw-semibold rounded-pill px-4"
        >
          <LogOutIcon size={18} />
          Sair
        </button>
      </div>
    </div>
  );
}
