interface AnimeControlsProps {
  filterCategory: string;
  onFilterCategoryChange: (category: string) => void;
  filterValue: string;
  onFilterValueChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  onOpenPopUp: () => void;
  filterOptions: Record<string, { value: string; label: string }[]>;
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
}: AnimeControlsProps) {
  const currentFilterOptions = filterOptions[filterCategory] || [];

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 border rounded flex-wrap gap-3">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-primary fw-semibold align-self-start mb-4"
          onClick={onOpenPopUp}
        >
          + Adicionar
        </button>

        <div className="d-flex flex-column align-items-center gap-2">
          <label
            htmlFor="filterCategorySelect"
            className="form-label w-100 m-0 text-muted fw-semibold"
          >
            Filtrar por:
          </label>
          <select
            id="filterCategorySelect"
            className="form-select border-0 bg-light fw-semibold"
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
            className="form-select border-0 bg-light fw-semibold"
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
          className="form-select border-0 bg-light fw-semibold"
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
  );
}
