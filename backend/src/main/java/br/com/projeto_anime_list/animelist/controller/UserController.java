package br.com.projeto_anime_list.animelist.controller;


import br.com.projeto_anime_list.animelist.model.*;
import br.com.projeto_anime_list.animelist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import br.com.projeto_anime_list.animelist.repository.AnimeRepository;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/public-list")
    public ResponseEntity<List<PublicProfileDTO>> getAllPublicUsers() {
        // Busca usuarios
        List<User> allUsers = userRepo.findAll();

        // Converte cada utilizador para um DTO
        List<PublicProfileDTO> publicUsers = allUsers.stream().map(u -> {
            List<Anime> userAnimes = animeRepo.findByUser(u);

            long totalAnimes = userAnimes.size();
            long completed = userAnimes.stream().filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus())).count();
            long watching = userAnimes.stream().filter(a -> "WATCHING".equalsIgnoreCase(a.getStatus())).count();
            long dropped = userAnimes.stream().filter(a -> "DROPPED".equalsIgnoreCase(a.getStatus())).count();
            long onHold = userAnimes.stream().filter(a -> "ON-HOLD".equalsIgnoreCase(a.getStatus())).count();
            long totalEpisodesWatched = userAnimes.stream().mapToLong(Anime::getWatchedEpisodes).sum();
            List<FavoriteAnimeDTO> favs = userAnimes.stream()
                    .filter(a -> a.getFavorite() != null && a.getFavorite())
                    .map(a -> new FavoriteAnimeDTO(a.getId(), a.getTitle(), a.getImageUrl()))
                    .toList();

            return new PublicProfileDTO(
                    u.getId(), u.getName(), u.getEmail(), u.getProfileImageUrl(),
                    totalAnimes, completed, watching, dropped, onHold, totalEpisodesWatched, favs
            );
        }).toList();

        return ResponseEntity.ok(publicUsers);
    }

    @GetMapping("/{id}/public-profile")
    public ResponseEntity<?> getPublicProfile(@PathVariable Long id) {
        Optional<User> userOptional = userRepo.findById(id);

        if(userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilizador não encontrado");
        }

        User publicUser = userOptional.get();
        List<Anime> publicList = animeRepo.findByUser(publicUser);

        // map
        long totalAnimes = publicList.size();
        long completed = publicList.stream().filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus())).count();
        long watching = publicList.stream().filter(a -> "WATCHING".equalsIgnoreCase(a.getStatus())).count();
        long dropped = publicList.stream().filter(a -> "DROPPED".equalsIgnoreCase(a.getStatus())).count();
        long onHold = publicList.stream().filter(a -> "ON-HOLD".equalsIgnoreCase(a.getStatus())).count();
        long totalEpisodesWatched = publicList.stream().mapToLong(Anime::getWatchedEpisodes).sum();

        List<FavoriteAnimeDTO> favoriteAnimes = publicList.stream()
                .filter(a -> a.getFavorite() != null && a.getFavorite())
                .map(a -> new FavoriteAnimeDTO(a.getId(), a.getTitle(), a.getImageUrl()))
                .toList();

        PublicProfileDTO dto = new PublicProfileDTO(
                publicUser.getId(),
                publicUser.getName(),
                publicUser.getEmail(),
                publicUser.getProfileImageUrl(),
                totalAnimes,
                completed,
                watching,
                dropped,
                onHold,
                totalEpisodesWatched,
                favoriteAnimes
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{userId}/animes")
    public ResponseEntity<?> getPublicAnimeList(@PathVariable Long userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilizador não encontrado.");
        }

        User listOwner = userOpt.get();

        List<Anime> userAnimes = animeRepo.findByUser(listOwner);

        List<PublicAnimeDTO> publicList = userAnimes.stream()
                .map(a -> new PublicAnimeDTO(
                        a.getId(),
                        a.getMalId(),
                        a.getTitle(),
                        a.getImageUrl(),
                        a.getType(),
                        a.getEpisodes(),
                        a.getWatchedEpisodes(),
                        a.getScore(),
                        a.getStatus(),
                        a.getFavorite(),
                        a.getComments()
                ))
                .toList();

        return ResponseEntity.ok(publicList);
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
