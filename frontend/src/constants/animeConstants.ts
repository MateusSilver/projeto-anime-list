export const CATEGORY_LABELS: Record<string, string> = {
  status: "Status",
  type: "Tipo",
};

export const VALUE_LABELS: Record<string, string> = {
  Watching: "Assistindo",
  Completed: "Concluído",
  "On-Hold": "Pausado",
  Dropped: "Abandonado",
  "Plan to Watch": "Planejo ver",
  TV: "TV",
  Movie: "Filme",
  OVA: "OVA",
  ONA: "Streaming",
  Special: "Especial",
  all: "Todos",
};

export const STATUS_WEIGHTS: Record<string, number> = {
  Watching: 1,
  Completed: 2,
  "On-Hold": 3,
  Dropped: 4,
  "Plan to Watch": 5,
};

export const BADGE_CLASSES: Record<string, string> = {
  Watching: "bg-success text-white",
  Completed: "bg-info",
  "On-Hold": "bg-warning text-dark",
  Dropped: "bg-danger text-white",
  "Plan to Watch": "bg-dark text-white",
};

export const FILTER_OPTIONS: Record<
  string,
  { value: string; label: string }[]
> = {
  status: [
    { value: "Watching", label: "Assistindo" },
    { value: "Completed", label: "Concluído" },
    { value: "On-Hold", label: "Pausado" },
    { value: "Dropped", label: "Abandonado" },
    { value: "Plan to Watch", label: "Planejo ver" },
  ],
  type: [
    { value: "TV", label: "TV" },
    { value: "Movie", label: "Filme" },
    { value: "OVA", label: "OVA" },
    { value: "ONA", label: "Streaming" },
    { value: "Special", label: "Especial" },
  ],
};
