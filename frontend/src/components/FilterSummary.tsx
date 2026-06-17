import { CATEGORY_LABELS, VALUE_LABELS } from "@/constants/animeConstants";

interface FilterSummaryProps {
  filterCategory: string;
  filterValue: string;
  totalFound: number;
}

export default function FilterSummary({
  filterCategory,
  filterValue,
  totalFound,
}: FilterSummaryProps) {
  return (
    <div
      className="mb-4 d-flex justify-content-between align-items-end border-bottom pb-2"
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
          <span className="text-primary fs-5">{totalFound}</span> Animes
          encontrados
        </p>
      )}
    </div>
  );
}
