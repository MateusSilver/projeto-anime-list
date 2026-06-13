package br.com.projeto_anime_list.animelist.model;

public record PublicAnimeDTO (
        Long id,
        Long malId,
        String title,
        String imageUrl,
        String type,
        Integer episodes,
        Integer watchedEpisodes,
        Double score,
        String status,
        Boolean favorite
) {}