package br.com.projeto_anime_list.animelist.controller;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.repository.AnimeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Define que esta classe é uma API e devolverá JSON
@RequestMapping("/api/animes") // O endereço base da URL
@RequiredArgsConstructor
@CrossOrigin(origins = "*")// API de qualquer origem

public class AnimeController {
    private final AnimeRepository animerepo;

    // rota GET:
    @GetMapping
    public ResponseEntity<List<Anime>> listarTodos(){
        List<Anime> animes = animerepo.findAll();

        return ResponseEntity.ok(animes);
    }

    // rota POST:
    @PostMapping
    public ResponseEntity<Anime> criarAnime(@RequestBody Anime novoAnime){
        Anime animeSalvo = animerepo.save(novoAnime);
        return ResponseEntity.status(HttpStatus.CREATED).body(animeSalvo);
    }

    // rota PUT:
    @PutMapping("/{id}")
    public ResponseEntity<Anime> atualizarAnime(@PathVariable Long id, @RequestBody Anime animeAtualizado){
        return animerepo.findById(id).map(animeExistence -> {
            animeAtualizado.setId(animeExistence.getId());
            Anime salvo = animerepo.save(animeAtualizado);
            return ResponseEntity.ok(salvo);
        }).orElse(ResponseEntity.notFound().build());
    }

}
