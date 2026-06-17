"use client";

import AnimeControls from "@/components/AnimeControls";
import FilterSummary from "@/components/FilterSummary";
import AnimeGrid from "@/components/AnimeGrid";
import AddAnimeModal from "@/components/AddAnimeModal";
import { useAnimes } from "@/hooks/useAnimes";
import { FILTER_OPTIONS } from "@/constants/animeConstants";

export default function List() {
  // cerebro
  const {
    sortedAnimes,
    isLoading,
    isPopupOpen,
    setIsPopupOpen,
    filterCategory,
    filterValue,
    setFilterValue,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    showFavoritesOnly,
    setShowFavoritesOnly,
    handleFilterCategoryChange,
    handleToggleFavorite,
    handleUpdateAnimeEpisodes,
    handleSaveAnime,
  } = useAnimes();

  return (
    <main className="container py-4 mt-4">
      <AnimeControls
        filterCategory={filterCategory}
        onFilterCategoryChange={handleFilterCategoryChange}
        filterValue={filterValue}
        onFilterValueChange={setFilterValue}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onOpenPopUp={() => setIsPopupOpen(true)}
        filterOptions={FILTER_OPTIONS}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
      />

      <FilterSummary
        filterCategory={filterCategory}
        filterValue={filterValue}
        totalFound={sortedAnimes.length}
      />

      <AnimeGrid
        animes={sortedAnimes}
        isLoading={isLoading}
        onIncrement={handleUpdateAnimeEpisodes}
        onToggleFavorite={handleToggleFavorite}
      />

      <AddAnimeModal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveAnime}
        filterOptions={FILTER_OPTIONS}
      />
    </main>
  );
}
