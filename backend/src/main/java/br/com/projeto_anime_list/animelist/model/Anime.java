package br.com.projeto_anime_list.animelist.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="Animes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"mal_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Anime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mal_id")
    private Long malId;

    @Column(nullable = false, length=200)
    private String title;

    @Column(length = 500)
    private String imageUrl;

    private String type;
    private Integer episodes;
    private Integer watchedEpisodes;
    private Double score;
    private String status;

    @Column(columnDefinition = "TEXT", length = 1000)
    private String comments;

    @ElementCollection
    @CollectionTable(name = "anime_tags", joinColumns = @JoinColumn(name = "anime_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Column(name = "is_favorite")
    private Boolean favorite = false;

    @Column(columnDefinition = "TEXT")
    private String reviewText;

    @Column(columnDefinition = "integer default 0")
    private Integer reviewLikes = 0;

    @ElementCollection
    @CollectionTable(name = "anime_review_likes", joinColumns = @JoinColumn(name = "anime_id"))
    @Column(name = "user_id")
    private Set<Long> likedByUsers = new HashSet<>();

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
