export const REGION_OPTIONS = [
  { value: "all", label: "All regions" },
  { value: "asia", label: "Asia & Pacific" },
  { value: "europe", label: "Europe" },
  { value: "americas", label: "The Americas" },
  { value: "africa", label: "Africa & Middle East" },
  { value: "oceania", label: "Oceania" }
] as const;

export const STYLE_OPTIONS = [
  { value: "any", label: "Any travel style" },
  { value: "culture", label: "Culture & history" },
  { value: "adventure", label: "Adventure" },
  { value: "history", label: "History & heritage" },
  { value: "food", label: "Food & wine" },
  { value: "outdoors", label: "Outdoor escapes" },
  { value: "relaxation", label: "Relaxation" }
] as const;
