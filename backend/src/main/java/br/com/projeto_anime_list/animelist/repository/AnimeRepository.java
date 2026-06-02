package br.com.projeto_anime_list.animelist.repository;

import br.com.projeto_anime_list.animelist.model.Anime;
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
}
