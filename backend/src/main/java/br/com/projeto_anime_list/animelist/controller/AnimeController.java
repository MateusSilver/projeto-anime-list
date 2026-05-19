package br.com.projeto_anime_list.animelist.controller;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.repository.AnimeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
