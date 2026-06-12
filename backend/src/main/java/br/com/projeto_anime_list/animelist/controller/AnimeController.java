package br.com.projeto_anime_list.animelist.controller;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.model.ReviewDTO;
import br.com.projeto_anime_list.animelist.model.ReviewInputDTO;
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
    public record AnimeDetailsDTO(Anime anime, Long globalUserCount, Double globalAverageScore){}

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
        Double mediaGlobal = 0.0;
        if(animeFoco.getMalId() != null){
            totalUsuarios = animerepo.countByMalId(animeFoco.getMalId());

            Double mediaCalculada = animerepo.getGlobalAverageScoreByMalId(animeFoco.getMalId());
            if(mediaCalculada != null){
                mediaGlobal = mediaCalculada;
            }
        }

        return ResponseEntity.ok(new AnimeDetailsDTO(animeFoco ,totalUsuarios, mediaGlobal));
    }

    // get reviews
    @GetMapping("/reviews/{malId}")
    public ResponseEntity<List<ReviewDTO>> getGlobalReviews(@PathVariable Long malId){
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ReviewDTO> reviews = animerepo.findReviewsGloballyByMalId(malId, logado.getId());
        return ResponseEntity.ok(reviews);
    }

    // rota POST:
    @PostMapping
    public ResponseEntity<?> criarAnime(@RequestBody Anime novoAnime){
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(novoAnime.getMalId() != null && novoAnime.getMalId() > 0){
            Optional<Anime> existente = animerepo.findByMalIdAndUser(novoAnime.getMalId(), logado);
            if(existente.isPresent()){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Voce já possui este anime!");
            }
        }

        novoAnime.setUser(logado);
        Anime animeSalvo = animerepo.save(novoAnime);
        return ResponseEntity.status(HttpStatus.CREATED).body(animeSalvo);
    }

    @PostMapping("/reviews/{reviewId}/like")
    public ResponseEntity<?> toggleReviewLike(@PathVariable Long reviewId) {
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<Anime> animeOpt = animerepo.findById(reviewId);
        if (animeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resenha não encontrada.");
        }

        Anime anime = animeOpt.get();
        Long meuId = logado.getId();

        // Liga/Desliga o Like
        if (anime.getLikedByUsers().contains(meuId)) {
            anime.getLikedByUsers().remove(meuId); // Remove o Like
        } else {
            anime.getLikedByUsers().add(meuId); // Adiciona o Like
        }

        // Atualiza a contagem
        anime.setReviewLikes(anime.getLikedByUsers().size());
        animerepo.save(anime);

        // Retorna a nova quantidade
        return ResponseEntity.ok(anime.getReviewLikes());
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

    @PatchMapping("/{id}/favorite")
    public ResponseEntity<?> alternarStatusFavorito(@PathVariable Long id) {
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return animerepo.findByIdAndUser(id, logado).map(anime -> {
            // blindado de nulo
            boolean isAtualmenteFavorito = anime.getFavorite() != null && anime.getFavorite();
            anime.setFavorite(!isAtualmenteFavorito);

            animerepo.save(anime);
            return ResponseEntity.ok(anime);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<?> atualizarResenha(@PathVariable Long id, @RequestBody ReviewInputDTO input) {
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<Anime> animeOpt = animerepo.findByIdAndUser(id, logado);

        if (animeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Anime não encontrado na sua lista.");
        }

        Anime anime = animeOpt.get();
        anime.setReviewText(input.reviewText());
        animerepo.save(anime);

        return ResponseEntity.ok().body("Resenha salva com sucesso!");
    }

}
