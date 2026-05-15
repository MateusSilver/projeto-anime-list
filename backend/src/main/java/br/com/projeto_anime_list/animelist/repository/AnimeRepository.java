package br.com.projeto_anime_list.animelist.repository;

import br.com.projeto_anime_list.animelist.model.Anime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface AnimeRepository extends JpaRepository<Anime, Long>{
}
