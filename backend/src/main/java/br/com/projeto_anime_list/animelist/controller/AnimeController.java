package br.com.projeto_anime_list.animelist.controller;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.model.User;
import br.com.projeto_anime_list.animelist.repository.AnimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController // Define que esta classe é uma API e devolverá JSON
@RequestMapping("/api/animes") // O endereço base da URL
@RequiredArgsConstructor

public class AnimeController {
    private final AnimeRepository animerepo;
    public record AnimeDetailsDTO(Anime anime, Long globalUserCount){}

    // rota GET:
    @GetMapping
    public ResponseEntity<List<Anime>> listarAnimesDoUsuario(){
        User usuarioLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Anime> animesDoUsuario = animerepo.findByUser(usuarioLogado);

        return ResponseEntity.ok(animesDoUsuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarDetalhes(@PathVariable Long id) {
        User usuarioLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<Anime> animeOp = animerepo.findByIdAndUser(id, usuarioLogado);

        if(animeOp.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Anime não encontrado");
        }

        Anime animeFoco = animeOp.get();
        Long totalUsuarios = 0L;
        if(animeFoco.getMalId() != null){
            totalUsuarios = animerepo.countByMalId(animeFoco.getMalId());
        }

        return ResponseEntity.ok(new AnimeDetailsDTO(animeFoco ,totalUsuarios));
    }

    // rota POST:
    @PostMapping
    public ResponseEntity<?> criarAnime(@RequestBody Anime novoAnime){
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(novoAnime.getMalId() != null && novoAnime.getMalId() > 0){
            Optional<Anime> existente = animerepo.findByIdAndUser(novoAnime.getMalId(), logado);
            if(existente.isPresent()){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Voce já possui este anime!");
            }
        }

        novoAnime.setUser(logado);
        Anime animeSalvo = animerepo.save(novoAnime);
        return ResponseEntity.status(HttpStatus.CREATED).body(animeSalvo);
    }

    // rota PUT:
    @PutMapping("/{id}")
    public ResponseEntity<Anime> atualizarAnime(@PathVariable Long id, @RequestBody Anime animeAtualizado){
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        return animerepo.findByIdAndUser(id, logado).map(animeExistence -> {
            animeAtualizado.setId(animeExistence.getId());
            animeAtualizado.setUser(logado);

            Anime salvo = animerepo.save(animeAtualizado);
            return ResponseEntity.ok(salvo);
        }).orElse(ResponseEntity.notFound().build());
    }

}
