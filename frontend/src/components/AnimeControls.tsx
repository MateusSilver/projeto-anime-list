import { Search, Plus, Star } from "lucide-react";

interface AnimeControlsProps {
  filterCategory: string;
  onFilterCategoryChange: (category: string) => void;
  filterValue: string;
  onFilterValueChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  onOpenPopUp: () => void;
  filterOptions: Record<string, { value: string; label: string }[]>;

  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
}

export default function AnimeControls({
  filterCategory,
  onFilterCategoryChange,
  filterValue,
  onFilterValueChange,
  sortBy,
  onSortByChange,
  onOpenPopUp,
  filterOptions,
  searchQuery,
  onSearchQueryChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
}: AnimeControlsProps) {
  const currentFilterOptions = filterOptions[filterCategory] || [];

  return (
    <>
      <div className="bg-body p-3 rounded-3 border mb-4 d-flex align-items-center gap-2">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          className="form-control w-100 w-md-50 border-0 bg-body fw-semibold"
          placeholder="Pesquisar por nome..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          style={{ color: "var(--bs-body-color)" }}
        />
      </div>
      <div className="d-flex justify-content-between mb-4 bg-body p-3 border rounded flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <button
            className="fs-5 px-2 btn btn-primary fw-semibold rounded-pill d-flex align-items-center"
            onClick={onOpenPopUp}
          >
            <Plus size={32} />
          </button>

          <div className="d-flex flex-column align-items-center gap-2">
            <label
              htmlFor="filterCategorySelect"
              className="form-label w-100 m-0 text-body-secondary fw-semibold"
            >
              Filtrar por:
            </label>
            <select
              id="filterCategorySelect"
              className="form-select border-0 bg-body-secondary fw-semibold"
              value={filterCategory}
              style={{ minWidth: "200px", color: "var(--bs-body-color)" }}
              onChange={(e) => onFilterCategoryChange(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="status">Status</option>
              <option value="type">Tipo</option>
            </select>
          </div>

          <div className="d-flex flex-column align-items-center gap-2">
            <label
              htmlFor="filterValueSelect"
              className="form-label w-100 m-0 text-muted fw-semibold"
            >
              Opção:
            </label>
            <select
              id="filterValueSelect"
              className="form-select border-0 bg-body-secondary fw-semibold"
              value={filterValue}
              style={{ minWidth: "200px", color: "var(--bs-body-color)" }}
              onChange={(e) => onFilterValueChange(e.target.value)}
              disabled={filterCategory === "all"}
            >
              <option value="">
                {filterCategory === "all" ? "Selecione" : "Selecione o tipo"}
              </option>
              {currentFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-check d-flex align-items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="favoritesOnly"
              className="form-check-input"
              name="favoritesOnly"
              checked={showFavoritesOnly}
              onChange={onToggleFavoritesOnly}
            />
            <label htmlFor="favoritesOnly">Apenas Favoritos</label>
          </div>
        </div>

        <div className="d-flex flex-column align-items-center gap-2">
          <label
            htmlFor="sortSelect"
            className="form-label w-100 m-0 text-muted fw-semibold"
          >
            Ordenar por:
          </label>
          <select
            id="sortSelect"
            className="form-select border-0 bg-body-secondary fw-semibold"
            value={sortBy}
            style={{ minWidth: "200px", color: "var(--bs-body-color)" }}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="status">Status</option>
            <option value="name">Nome</option>
            <option value="scoreDesc">Maior Nota</option>
            <option value="scoreAsc">Menor Nota</option>
          </select>
        </div>
      </div>
    </>
  );
}
