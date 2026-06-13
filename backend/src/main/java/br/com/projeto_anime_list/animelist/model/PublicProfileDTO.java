package br.com.projeto_anime_list.animelist.model;

import java.util.List;

public record PublicProfileDTO (
        Long id,
        String name,
        String email,
        String profileImageUrl,
        Long totalAnimes,
        Long completed,
        Long watching,
        Long dropped,
        Long onHold,
        Long totalEpisodesWatched,
        List<FavoriteAnimeDTO> favoriteAnimes
) {}