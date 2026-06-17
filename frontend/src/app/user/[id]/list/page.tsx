"use client";
import { useState, useMemo } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import AnimeCard from "@/components/AnimeCard";
import AnimeControls from "@/components/AnimeControls";
import { Anime } from "@/types/anime";
import {
  CATEGORY_LABELS,
  VALUE_LABELS,
  STATUS_WEIGHTS,
  BADGE_CLASSES,
  FILTER_OPTIONS,
} from "@/constants/animeConstants";

export default function PublicList() {
  const [sortBy, setSortBy] = useState<string>("status");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    const fetchAnimes = async () => {
      if (!userId) return;
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:8080/api/users/${userId}/animes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          console.log("animes recebidos", data);
          setAnimes(data);
        } else {
          console.error("animes não recebidos: ", res.status);
        }
      } catch (error) {
        console.error("Erro ao carregar a lista pública:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnimes();
  }, [userId]);

  const handleFilterValueChange = (category: string) => {
    setFilterCategory(category);
    setFilterValue("");
  };

  const sortedAnimes = useMemo(() => {
    let animesCopy = [...animes];

    if (showFavoritesOnly) {
      animesCopy = animesCopy.filter((anime) => anime.favorite);
    }

    if (searchQuery.trim() !== "") {
      animesCopy = animesCopy.filter((anime) =>
        anime.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterCategory !== "all" && filterValue) {
      animesCopy = animesCopy.filter((anime) => {
        if (filterCategory === "status") return anime.status === filterValue;
        if (filterCategory === "type") return anime.type === filterValue;
        return true;
      });
    }

    return animesCopy.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "status":
          const pesoA = STATUS_WEIGHTS[a.status] || 999;
          const pesoB = STATUS_WEIGHTS[b.status] || 999;
          if (pesoA !== pesoB) return pesoA - pesoB;
          return (b.score || 0) - (a.score || 0);
        case "scoreDesc":
          return (b.score || 0) - (a.score || 0);
        case "scoreAsc":
          return (a.score || 0) - (b.score || 0);
        default:
          return 0;
      }
    });
  }, [
    animes,
    sortBy,
    filterCategory,
    filterValue,
    searchQuery,
    showFavoritesOnly,
  ]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5 text-body-secondary">
        <Loader2 size={48} className="icon-spin text-primary mb-3" />
        <h5 className="fw-semibold">Carregando acervo...</h5>
      </div>
    );
  }

  return (
    <main className="container py-5 mt-5">
      {/* Cabeçalho simplificado */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary-subtle pb-3 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold text-truncate mb-1">
            <span className="text-primary">Acervo Público</span>
          </h1>
          <p className="text-body-secondary m-0">Lista de Utilizador</p>
        </div>
        <div className="d-flex flex-row gap-2">
          <Link
            href={`/user/${userId}`}
            className="d-flex align-items-center gap-2 btn btn-outline-secondary fw-semibold rounded-pill px-4"
          >
            <ArrowLeft size={18} />
            Voltar ao Perfil
          </Link>
        </div>
      </div>

      <AnimeControls
        filterCategory={filterCategory}
        onFilterCategoryChange={handleFilterValueChange}
        filterValue={filterValue}
        onFilterValueChange={setFilterValue}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onOpenPopUp={() => void 0}
        filterOptions={FILTER_OPTIONS}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        isReadOnly={true}
      />

      <div
        className="mb-4 d-flex justify-content-between align-items-end border-bottom pb-2 mt-4"
        style={{ borderColor: "var(--bs-card-border-color)" }}
      >
        <div>
          {filterCategory !== "all" && filterValue && (
            <p className="m-0 text-body-secondary fw-medium">
              Filtrando por: <span>{CATEGORY_LABELS[filterCategory]}</span> -{" "}
              <span className="text-primary">
                {VALUE_LABELS[filterValue] || filterValue}
              </span>
            </p>
          )}
        </div>
        {filterCategory !== "all" && (
          <p className="m-0 text-body-secondary fw-semibold">
            <span className="text-primary fs-5">{sortedAnimes.length}</span>{" "}
            Animes encontrados
          </p>
        )}
      </div>

      <div className="row g-3">
        {sortedAnimes.map((anime) => (
          <div
            key={anime.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
          >
            <AnimeCard
              anime={anime}
              onIncrement={() => void 0}
              onToggleFavorite={() => void 0}
              valueLabels={VALUE_LABELS}
              badgeClasses={BADGE_CLASSES}
              isReadOnly={true}
            />
          </div>
        ))}

        {sortedAnimes.length === 0 && (
          <div className="col-12 text-center py-5 mt-5">
            <div
              className="alert bg-body-tertiary border shadow-sm d-inline-block p-4 rounded-4"
              role="alert"
            >
              <h5 className="alert-heading text-body-secondary fw-bold mb-1">
                Nenhum dado encontrado
              </h5>
              <p className="mb-0 text-body-secondary small">
                Este utilizador não tem animes com estes filtros.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
