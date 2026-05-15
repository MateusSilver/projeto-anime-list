package br.com.projeto_anime_list.animelist.repository;

import br.com.projeto_anime_list.animelist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
