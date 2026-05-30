package br.com.projeto_anime_list.animelist.repository;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface AnimeRepository extends JpaRepository<Anime, Long>{
    List<Anime> findByImageUrlIsNull();
    List<Anime> findByUser(User user);
}
