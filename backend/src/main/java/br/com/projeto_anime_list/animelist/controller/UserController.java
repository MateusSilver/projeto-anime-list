package br.com.projeto_anime_list.animelist.controller;


import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.model.User;
import br.com.projeto_anime_list.animelist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import br.com.projeto_anime_list.animelist.repository.AnimeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepo;
    private final AnimeRepository animeRepo;
    private final BCryptPasswordEncoder enconder = new BCryptPasswordEncoder();

    public record UserProfileDTO(
            String name,
            String email,
            String profileImageUrl,
            long totalAnimes,
            long watching,
            long completed,
            long dropped,
            long onHold,
            long planToWatch,
            long totalEpisodesWatched,
            List<Anime> favoriteAnimes
            ) {}
    public record UserUpdateDTO(
            String name,
            String profileImageUrl,
            String newPassword
    ) {}

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        long totalAnimes = animeRepo.countByUser(logado);
        long assistindo = animeRepo.countByUserAndStatus(logado, "Watching");
        long completos = animeRepo.countByUserAndStatus(logado, "Completed");
        long dropados = animeRepo.countByUserAndStatus(logado, "Dropped");
        long esperando = animeRepo.countByUserAndStatus(logado, "On-Hold");
        long plan_to_watch = animeRepo.countByUserAndStatus(logado, "Plan to Watch");

        long totalEpisodesWatched = animeRepo.sumWatchedEpisodesByUser(logado);
        List<Anime> favoritos = animeRepo.findByUserAndFavoriteTrue(logado);

        UserProfileDTO perfil = new UserProfileDTO(
                logado.getName(),
                logado.getEmail(),
                logado.getProfileImageUrl(),
                totalAnimes,
                assistindo,
                completos,
                dropados,
                esperando,
                plan_to_watch,
                totalEpisodesWatched,
                favoritos
        );

        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserUpdateDTO updateData) {
        User logado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User usuarioDB = userRepo.findById(logado.getId()).orElseThrow();

        if(updateData.name() != null && !updateData.name().isEmpty()) {
            usuarioDB.setName(updateData.name());
        }
        if(updateData.profileImageUrl() != null){
            usuarioDB.setProfileImageUrl(updateData.profileImageUrl());
        }
        if(updateData.newPassword() != null && !updateData.newPassword().isEmpty()){
            usuarioDB.setPassword(enconder.encode(updateData.newPassword()));
        }

        userRepo.save(usuarioDB);
        return ResponseEntity.ok("Perfil atualizado");
    }
}
