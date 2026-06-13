package br.com.projeto_anime_list.animelist.repository;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.model.ReviewDTO;
import br.com.projeto_anime_list.animelist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

public interface AnimeRepository extends JpaRepository<Anime, Long>{
    List<Anime> findByImageUrlIsNull();

    @EntityGraph(attributePaths = {"tags"})
    List<Anime> findByUser(User user);

    Optional<Anime> findByIdAndUser(Long id, User user);
    Optional<Anime> findByMalIdAndUser(Long malId, User user);
    Long countByMalId(Long malId);

    @Query("SELECT AVG(a.score) FROM Anime a WHERE a.malId = :malId AND a.score > 0")
    Double getGlobalAverageScoreByMalId(@Param("malId") Long malId);

    long countByUserAndStatus(User user, String status);
    long countByUser(User user);
    List<Anime> findByUserAndFavoriteTrue(User user);

    @Query("SELECT COALESCE(SUM(a.watchedEpisodes), 0) FROM Anime a WHERE a.user = :user")
    Long sumWatchedEpisodesByUser(@Param("user") User user);

    // reviewDTO
    @Query("SELECT new br.com.projeto_anime_list.animelist.model.ReviewDTO(" +
            "a.id, a.user.id, a.user.name, a.user.profileImageUrl, a.reviewText, a.reviewLikes, a.score, " + 
            "(CASE WHEN :userId IN elements(a.likedByUsers) THEN true ELSE false END)) " +
            "FROM Anime a WHERE a.malId = :malId AND a.reviewText IS NOT NULL AND TRIM(a.reviewText) <> '' " +
            "ORDER BY COALESCE(a.reviewLikes, 0) DESC")
    List<ReviewDTO> findReviewsGloballyByMalId(@Param("malId") Long malId, @Param("userId") Long userId);
}